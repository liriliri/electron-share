import BaseStore from '../store/BaseStore'
import { IProcess } from '../../common/types'
import { action, makeObservable, observable, runInAction } from 'mobx'

class Store extends BaseStore {
  processes: IProcess[] = []
  filter = ''
  constructor() {
    super()

    makeObservable(this, {
      processes: observable,
      filter: observable,
      setFilter: action,
    })

    this.init()
  }
  setFilter(filter: string) {
    this.filter = filter
  }
  async init() {
    this.refresh()
    setInterval(() => this.refresh(), 5000)
  }
  async refresh() {
    const processes = await main.getProcessData()
    runInAction(() => {
      this.processes = processes
    })
  }
}

export default new Store()
