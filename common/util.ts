import detectOs from 'licia/detectOs'
import isWindows from 'licia/isWindows'
import slugify from 'licia/slugify'

export function isDev() {
  // @ts-ignore
  return import.meta.env.MODE === 'development'
}

export function getPlatform() {
  const os = detectOs()
  if (os === 'os x') {
    return 'mac'
  }
  return os
}

export function slugifyFileName(name: string) {
  let ret = slugify(name)

  if (isWindows) {
    ret = ret.replace(/[/\\:*?"<>]/g, '-')
  }

  return ret
}
