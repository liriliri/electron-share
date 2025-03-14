import {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
} from 'electron'

export interface IModalProps {
  visible: boolean
  onClose: () => void
}

export type IpcGetLanguage = () => string
export type IpcGetTheme = () => string
export type IpcGetStore = (name: string) => any
export type IpcSetStore = (name: string, val: any) => void
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
export type IpcOpenPath = (path: string) => void
export type IpcShowItemInFolder = IpcOpenPath
