import { BrowserWindow, app, webContents } from 'electron'
import * as window from '../../main/lib/window'
import once from 'licia/once'
import { handleEvent } from '../lib/util'
import { IpcGetProcessData, IProcess } from '../../common/types'
import map from 'licia/map'

let win: BrowserWindow | null = null

export function showWin() {
  if (win) {
    win.focus()
    return
  }

  initIpc()

  win = window.create({
    name: 'process',
    width: 640,
    height: 320,
    minWidth: 640,
    minHeight: 320,
    menu: false,
  })

  win.on('close', () => {
    win?.destroy()
    win = null
  })

  window.loadPage(win, { page: 'process' })
}

const getProcessData: IpcGetProcessData = () => {
  const allWebContents = Object.fromEntries(
    map(webContents.getAllWebContents(), (webContent) => [
      webContent.getOSProcessId(),
      webContent,
    ])
  )

  return map(app.getAppMetrics(), (metric) => {
    const ret: IProcess = {
      name: metric.name || metric.serviceName || '',
      pid: metric.pid,
      cpu: metric.cpu.percentCPUUsage,
      memory: metric.memory.workingSetSize,
      type: metric.type,
    }

    const webContent = allWebContents[metric.pid]
    if (webContent) {
      ret.name = webContent.getTitle() || ret.name
    }
    if (metric.pid === process.pid) {
      ret.name = 'Main Process'
    }

    return ret
  })
}

const initIpc = once(() => {
  handleEvent('getProcessData', getProcessData)
})
