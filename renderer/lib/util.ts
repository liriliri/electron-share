import contain from 'licia/contain'
import h from 'licia/h'
import { isObservable, toJS } from 'mobx'
import LunaNotification, { INotifyOptions } from 'luna-notification'

let notification: LunaNotification | null = null

export function notify(content: string, options?: INotifyOptions) {
  if (!notification) {
    const div = h('div')
    document.body.appendChild(div)
    notification = new LunaNotification(div, {
      position: {
        x: 'center',
        y: 'top',
      },
    })
  }

  notification.notify(content, options)
}

export async function setMemStore(name: string, val: any) {
  await main.setMemStore(name, isObservable(val) ? toJS(val) : val)
}

export function isFileDrop(e: React.DragEvent) {
  return contain(e.dataTransfer.types, 'Files')
}
