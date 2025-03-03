import { invoke } from './util'
import types from 'licia/types'
import { ipcRenderer, OpenDialogOptions, SaveDialogOptions } from 'electron'
import {
  IpcGetLanguage,
  IpcGetStore,
  IpcGetTheme,
  IpcSetStore,
} from '../common/types'

export default {
  getLanguage: invoke<IpcGetLanguage>('getLanguage'),
  getTheme: invoke<IpcGetTheme>('getTheme'),
  getMemStore: invoke<IpcGetStore>('getMemStore'),
  setMemStore: invoke<IpcSetStore>('setMemStore'),
  openExternal: invoke('openExternal'),
  showContextMenu: (x: number, y: number, template: any) => {
    ipcRenderer.invoke(
      'showContextMenu',
      Math.round(x),
      Math.round(y),
      template
    )
  },
  showOpenDialog: (options: OpenDialogOptions = {}) => {
    return ipcRenderer.invoke('showOpenDialog', options)
  },
  showSaveDialog: (options: SaveDialogOptions = {}) => {
    return ipcRenderer.invoke('showSaveDialog', options)
  },
  toggleDevTools: () => ipcRenderer.invoke('toggleDevTools'),
  sendToWindow: (name: string, channel: string, ...args: any[]) => {
    ipcRenderer.invoke('sendToWindow', name, channel, ...args)
  },
  on: (event: string, cb: types.AnyFn) => {
    const listener = (e, ...args) => cb(...args)
    ipcRenderer.on(event, listener)
    return () => ipcRenderer.off(event, listener)
  },
}
