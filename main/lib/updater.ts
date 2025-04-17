import { autoUpdater } from 'electron-updater'
import * as window from './window'
import isMac from 'licia/isMac'
import pkg from '../../../../package.json'

autoUpdater.autoDownload = false

export function checkUpdate() {
  autoUpdater.checkForUpdates()
}

export function init() {
  autoUpdater.setFeedURL('https://release.liriliri.io')
  autoUpdater.channel = `${pkg.productName}-latest`
  if (isMac && process.arch !== 'arm64') {
    autoUpdater.channel = `${pkg.productName}-x64-latest`
  }

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
