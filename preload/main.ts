import { invoke } from './util'
import types from 'licia/types'
import { ipcRenderer } from 'electron'
import {
  IpcGetLanguage,
  IpcGetStore,
  IpcGetTheme,
  IpcOpenExternal,
  IpcSendToWindow,
  IpcSetStore,
  IpcShowContextMenu,
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
  toggleDevTools: invoke('toggleDevTools'),
  sendToWindow: invoke<IpcSendToWindow>('sendToWindow'),
  relaunch: invoke('relaunch'),
  on: (event: string, cb: types.AnyFn) => {
    const listener = (e, ...args) => cb(...args)
    ipcRenderer.on(event, listener)
    return () => ipcRenderer.off(event, listener)
  },
}
