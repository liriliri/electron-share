import { autoUpdater } from 'electron-updater'
import * as window from './window'
import pkg from '../../../../package.json'
import detectOs from 'licia/detectOs'

export function checkUpdate() {
  autoUpdater.checkForUpdates()
}

export function init() {
  autoUpdater.setFeedURL('https://release.liriliri.io')
  autoUpdater.channel = `${
    pkg.productName
  }-latest-${getPlatform()}-${getArch()}`

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

function getPlatform() {
  const os = detectOs()

  if (os === 'os x') {
    return 'mac'
  } else if (os === 'windows') {
    return 'win'
  }

  return os
}

export function getArch() {
  const arch = process.arch
  const platform = getPlatform()

  if (arch === 'x64' && platform === 'linux') {
    return 'x86_64'
  }

  return arch
}
