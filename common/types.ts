import {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
} from 'electron'

export type IpcGetLanguage = () => string
export type IpcGetTheme = () => string
export type IpcGetStore = (name: string) => any
export type IpcSetStore = (name: string, val: any) => any
export type IpcShowContextMenu = (x: number, y: number, template: any) => void
export type IpcShowOpenDialog = (
  options: OpenDialogOptions
) => Promise<OpenDialogReturnValue>
export type IpcShowSaveDialog = (
  options: SaveDialogOptions
) => Promise<SaveDialogReturnValue>
export type IpcSendToWindow = (
  name: string,
  channel: string,
  ...args: any[]
) => void
export type IpcOpenExternal = (url: string) => void
