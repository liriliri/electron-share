import hotKey from 'licia/hotKey'
import { isDev, getPlatform } from '../common/util'
import './main.scss'
import './luna.scss'

if (isDev()) {
  hotKey.on('f5', () => location.reload())
  hotKey.on('f12', () => main.toggleDevTools())
}

document.body.classList.add(`platform-${getPlatform()}`)
