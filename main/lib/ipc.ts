import { dialog, shell, app, ipcMain, BrowserWindow } from 'electron'
import * as window from './window'
import contextMenu from './contextMenu'
import { getOpenFileFromArgv, handleEvent } from './util'
import { getMemStore } from './store'
import log from '../../common/log'
import {
  IpcGetOpenFile,
  IpcGetStore,
  IpcOpenExternal,
  IpcOpenPath,
  IpcOpenWindow,
  IpcSendToWindow,
  IpcSetStore,
  IpcShowItemInFolder,
  IpcShowOpenDialog,
  IpcShowSaveDialog,
} from '../../common/types'
import isMac from 'licia/isMac'
import endWith from 'licia/endWith'
import * as terminal from '../window/terminal'

const memStore = getMemStore()

const logger = log('ipc')

const openWindow: IpcOpenWindow = (url, name, options) => {
  options = options || {}

  const win = window.create({
    name: name || url,
    preload: false,
    customTitlebar: false,
    menu: false,
    ...options,
  })

  win.loadURL(url)
}

let openFile = ''
if (isMac) {
  app.on('open-file', (_, path) => {
    openFile = path
  })
}

const getOpenFile: IpcGetOpenFile = (ext) => {
  if (isMac && endWith(openFile, ext)) {
    return openFile
  }

  return getOpenFileFromArgv(process.argv, ext)
}

export function init() {
  logger.info('init')

  handleEvent('showOpenDialog', <IpcShowOpenDialog>(
    ((options) => dialog.showOpenDialog(options))
  ))
  handleEvent('showSaveDialog', <IpcShowSaveDialog>(
    ((options) => dialog.showSaveDialog(options))
  ))
  handleEvent('openExternal', <IpcOpenExternal>((url) => {
    shell.openExternal(url)
  }))
  handleEvent('toggleDevTools', () => {
    const win = window.getFocusedWin()
    if (win) {
      win.webContents.toggleDevTools()
    }
  })
  handleEvent('sendToWindow', <IpcSendToWindow>((name, channel, ...args) => {
    window.sendTo(name, channel, ...args)
  }))
  handleEvent('setMemStore', <IpcSetStore>((name, val) => {
    memStore.set(name, val)
  }))
  handleEvent('getMemStore', <IpcGetStore>((name) => memStore.get(name)))
  memStore.on('change', (name, val) => {
    window.sendAll('changeMemStore', name, val)
  })
  ipcMain.handle('showContextMenu', (event, x, y, template) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.focus()
      contextMenu(x, y, template)
    }
  })
  handleEvent('relaunch', () => {
    app.relaunch()
    app.exit()
  })
  handleEvent('openPath', <IpcOpenPath>((path: string) => {
    shell.openPath(path)
  }))
  handleEvent('showItemInFolder', <IpcShowItemInFolder>((path: string) => {
    shell.showItemInFolder(path)
  }))
  handleEvent('openWindow', openWindow)
  ipcMain.handle('isCustomTitlebar', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    if (win) {
      return (win as any).customTitlebar
    }

    return true
  })
  handleEvent('getOpenFile', getOpenFile)
  handleEvent('showTerminal', () => terminal.showWin())
}
