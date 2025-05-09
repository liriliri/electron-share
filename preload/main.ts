import { invoke } from './util'
import types from 'licia/types'
import { ipcRenderer } from 'electron'
import {
  IpcGetLanguage,
  IpcGetLogs,
  IpcGetOpenFile,
  IpcGetStore,
  IpcGetTheme,
  IpcIsCustomTitlebar,
  IpcOpenExternal,
  IpcOpenPath,
  IpcOpenWindow,
  IpcSendToWindow,
  IpcSetStore,
  IpcShowContextMenu,
  IpcShowItemInFolder,
  IpcShowOpenDialog,
  IpcShowSaveDialog,
} from '../common/types'

export default {
  getLanguage: invoke<IpcGetLanguage>('getLanguage'),
  getTheme: invoke<IpcGetTheme>('getTheme'),
  getMemStore: invoke<IpcGetStore>('getMemStore'),
  setMemStore: invoke<IpcSetStore>('setMemStore'),
  openExternal: invoke<IpcOpenExternal>('openExternal'),
  showContextMenu: invoke<IpcShowContextMenu>('showContextMenu'),
  showOpenDialog: invoke<IpcShowOpenDialog>('showOpenDialog'),
  showSaveDialog: invoke<IpcShowSaveDialog>('showSaveDialog'),
  openPath: invoke<IpcOpenPath>('openPath'),
  showItemInFolder: invoke<IpcShowItemInFolder>('showItemInFolder'),
  toggleDevTools: invoke('toggleDevTools'),
  sendToWindow: invoke<IpcSendToWindow>('sendToWindow'),
  relaunch: invoke('relaunch'),
  openWindow: invoke<IpcOpenWindow>('openWindow'),
  getLogs: invoke<IpcGetLogs>('getLogs'),
  clearLogs: invoke('clearLogs'),
  isCustomTitlebar: invoke<IpcIsCustomTitlebar>('isCustomTitlebar'),
  getOpenFile: invoke<IpcGetOpenFile>('getOpenFile'),
  on: (event: string, cb: types.AnyFn) => {
    const listener = (e, ...args) => cb(...args)
    ipcRenderer.on(event, listener)
    return () => ipcRenderer.off(event, listener)
  },
}
