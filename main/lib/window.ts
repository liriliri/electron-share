import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  screen,
} from 'electron'
import noop from 'licia/noop'
import types from 'licia/types'
import defaults from 'licia/defaults'
import remove from 'licia/remove'
import each from 'licia/each'
import path from 'path'
import { attachTitlebarToWindow } from 'custom-electron-titlebar/main'
import { colorBgContainer, colorBgContainerDark } from '../../../common/theme'
import { getTheme } from './util'
import isWindows from 'licia/isWindows'
import debounce from 'licia/debounce'
import { isDev } from '../../common/util'
import isEmpty from 'licia/isEmpty'
import query from 'licia/query'
import log from '../../common/log'
import once from 'licia/once'

const logger = log('window')

interface IWinOptions {
  name: string
  maximized?: boolean
  customTitlebar?: boolean
  minWidth?: number
  minHeight?: number
  width?: number
  height?: number
  preload?: boolean
  menu?: boolean
  x?: number
  y?: number
  onSavePos?: types.AnyFn
  resizable?: boolean
}

const visibleWins: BrowserWindow[] = []
const wins: types.PlainObj<BrowserWindow> = {}
let focusedWin: BrowserWindow | null = null

export function create(opts: IWinOptions) {
  defaults(opts, {
    customTitlebar: true,
    preload: true,
    maximized: false,
    minWidth: 1280,
    minHeight: 850,
    width: 1280,
    height: 850,
    onSavePos: noop,
    menu: false,
    resizable: true,
  })
  const winOptions = opts as Required<IWinOptions>

  const options: BrowserWindowConstructorOptions = {
    minWidth: winOptions.minWidth,
    minHeight: winOptions.minHeight,
    show: false,
    resizable: winOptions.resizable,
  }
  if (winOptions.x && winOptions.y) {
    const x = winOptions.x
    const y = winOptions.y
    const width = winOptions.width
    const height = winOptions.height
    const area = screen.getDisplayMatching({
      x,
      y,
      width,
      height,
    }).workArea
    if (
      x >= area.x &&
      x + width <= area.x + area.width &&
      y >= area.y &&
      y + height <= area.y + area.height
    ) {
      options.x = winOptions.x
      options.y = winOptions.y
    }
    if (width <= area.width && height <= area.height) {
      options.width = winOptions.width
      options.height = winOptions.height
    }
  }

  options.backgroundColor = getTheme() ? colorBgContainerDark : colorBgContainer

  if (winOptions.preload) {
    options.webPreferences = {
      preload: path.join(__dirname, '../preload/index.js'),
      webSecurity: false,
      sandbox: false,
    }
  }
  if (winOptions.customTitlebar) {
    options.titleBarStyle = 'hidden'
    options.titleBarOverlay = true
  }

  const win = new BrowserWindow(options)
  ;(win as any).customTitlebar = winOptions.customTitlebar
  if (!winOptions.menu) {
    win.setMenu(null)
  }

  const onSavePos = debounce(() => {
    if (!win.isFullScreen()) {
      winOptions.onSavePos()
    }
  }, 1000)

  const readyAndShow = once(() => {
    logger.info(opts.name, 'ready and show')
    if (winOptions.maximized && isWindows) {
      win.maximize()
    }
    win.show()
    win.on('resize', onSavePos)
    win.on('moved', onSavePos)
  })
  win.once('ready-to-show', () => {
    logger.info(opts.name, 'on ready-to-show')
    readyAndShow()
  })
  // Make sure the window is shown even if the ready-to-show event is not emitted
  setTimeout(() => readyAndShow(), 1000)

  win.on('show', () => visibleWins.push(win))
  win.on('focus', () => {
    focusedWin = win
    win.webContents.send('focusWin')
  })
  win.on('hide', () => remove(visibleWins, (window) => window === win))
  win.on('closed', () => {
    delete wins[opts.name]
  })
  wins[opts.name] = win

  if (winOptions.customTitlebar) {
    attachTitlebarToWindow(win)
    win.setMinimumSize(winOptions.minWidth, winOptions.minHeight)
  }

  return win
}

export function sendAll(channel: string, ...args: any[]) {
  each(wins, (win) => {
    win.webContents.send(channel, ...args)
  })
}

export function sendFocused(channel: string, ...args: any[]) {
  if (focusedWin) {
    focusedWin.webContents.send(channel, ...args)
  }
}

export function sendTo(name: string, channel: string, ...args: any[]) {
  const win = getWin(name)
  if (win) {
    win.webContents.send(channel, ...args)
  }
}

export function loadPage(win: BrowserWindow, q: types.PlainObj<string> = {}) {
  if (isDev()) {
    let url = 'http://localhost:8080/'
    if (!isEmpty(q)) {
      url += `?${query.stringify(q)}`
    }
    win.loadURL(url)
  } else {
    win.loadFile(path.resolve(__dirname, '../renderer/index.html'), {
      query: q,
    })
  }
}

export function getWin(name: string) {
  return wins[name]
}

export function getFocusedWin() {
  return focusedWin
}

export function savePos(
  win: BrowserWindow | null,
  store: any,
  maximized = false
) {
  if (!win) {
    return
  }

  const isMaximized = win.isMaximized()
  if (!isWindows || !isMaximized) {
    store.set('bounds', win.getBounds())
  }
  if (isWindows && maximized) {
    store.set('maximized', isMaximized)
  }
}
