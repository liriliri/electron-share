export type IpcGetLanguage = () => string
export type IpcGetTheme = () => string
export type IpcGetStore = (name: string) => any
export type IpcSetStore = (name: string, val: any) => any
export type IpcShowContextMenu = (x: number, y: number, template: any) => void
