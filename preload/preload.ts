import { Titlebar, TitlebarColor } from 'custom-electron-titlebar'
import { colorBgContainer, colorBgContainerDark } from '../../common/theme'
import getUrlParam from 'licia/getUrlParam'
import isMac from 'licia/isMac'
import mainObj from './main'
import { webUtils } from 'electron'

let titleBar: Titlebar

window.addEventListener('DOMContentLoaded', async () => {
  titleBar = new Titlebar({
    containerOverflow: 'hidden',
  })
  if (getUrlParam('page') && !isMac) {
    document.body.classList.add('hide-cet-menubar')
  }
  updateTheme()
  mainObj.on('updateTheme', updateTheme)
})

async function updateTheme() {
  const theme = await mainObj.getTheme()
  if (theme === 'dark') {
    document.body.classList.add('-theme-with-dark-background')
  } else {
    document.body.classList.remove('-theme-with-dark-background')
  }
  const backgroundColor = TitlebarColor.fromHex(
    theme === 'dark' ? colorBgContainerDark : colorBgContainer
  )
  ;(titleBar as any).currentOptions.menuBarBackgroundColor = backgroundColor
  titleBar.updateBackground(backgroundColor)
}

mainObj.on('refreshMenu', () => {
  if (titleBar) {
    titleBar.refreshMenu()
  }
})

export default {
  setTitle: (title: string) => {
    document.title = title
    if (titleBar) {
      titleBar.updateTitle(title)
    }
  },
  getPathForFile: (file: File) => {
    return webUtils.getPathForFile(file)
  },
}
