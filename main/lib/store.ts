import fs from 'fs-extra'
import memoize from 'licia/memoize'
import Store from 'licia/Store'
import { getUserDataPath } from './util'

fs.exists(getUserDataPath('data'), function (exists) {
  if (!exists) {
    fs.mkdirp(getUserDataPath('data'))
  }
})

export const getMemStore = memoize(function () {
  return new Store({})
})
