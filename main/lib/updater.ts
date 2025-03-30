import { autoUpdater } from 'electron-updater'
import * as window from './window'
import pkg from '../../../../package.json'
import { getPlatform } from 'share/common/util'

export function checkUpdate() {
  autoUpdater.checkForUpdates()
}

export function init() {
  autoUpdater.setFeedURL('https://release.liriliri.io')
  autoUpdater.channel = `${pkg.productName}-latest-${getArch()}`

  autoUpdater.on('update-not-available', () => {
    window.sendTo('main', 'updateNotAvailable')
  })
  autoUpdater.on('update-available', () => {
    window.sendTo('main', 'updateAvailable')
  })
  autoUpdater.on('error', () => {
    window.sendTo('main', 'updateError')
  })
}

export function getArch() {
  const arch = process.arch
  const platform = getPlatform()

  if (arch === 'x64' && platform === 'linux') {
    return 'x86_64'
  }

  return arch
}
