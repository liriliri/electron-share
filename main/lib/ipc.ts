import { dialog, shell, app } from 'electron'
import * as window from './window'
import contextMenu from './contextMenu'
import { handleEvent } from './util'
import { getMemStore } from './store'
import log from '../../common/log'
import {
  IpcGetStore,
  IpcOpenExternal,
  IpcOpenPath,
  IpcSendToWindow,
  IpcSetStore,
  IpcShowItemInFolder,
  IpcShowOpenDialog,
  IpcShowSaveDialog,
} from '../../common/types'

const memStore = getMemStore()

const logger = log('ipc')

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
  handleEvent('showContextMenu', contextMenu)
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
}
