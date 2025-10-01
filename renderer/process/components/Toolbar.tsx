import { observer } from 'mobx-react-lite'
import LunaToolbar, {
  LunaToolbarInput,
  LunaToolbarSeparator,
  LunaToolbarSpace,
  LunaToolbarText,
} from 'luna-toolbar/react'
import store from '../store'
import { t } from '../../../common/i18n'
import ToolbarIcon from '../../components/ToolbarIcon'
import LunaModal from 'luna-modal'

export default observer(function Toolbar() {
  async function stop() {
    const process = store.process!
    const result = await LunaModal.confirm(
      t('killProcessConfirm', { name: process.name })
    )
    if (result) {
      main.killProcess(process.pid)
      store.refresh()
    }
  }

  function inspect() {
    main.openDevtools(store.process!.webContentsId!)
  }

  return (
    <LunaToolbar>
      <LunaToolbarInput
        keyName="filter"
        value={store.filter}
        placeholder={t('filter')}
        onChange={(val) => store.setFilter(val)}
      />
      <LunaToolbarText
        text={t('totalProcess', { total: store.processes.length })}
      />
      <LunaToolbarSpace />
      <ToolbarIcon
        disabled={store.process === null || !store.process.webContentsId}
        icon="debug"
        title={t('inspect')}
        onClick={inspect}
      />
      <LunaToolbarSeparator />
      <ToolbarIcon
        disabled={store.process === null}
        icon="delete"
        title={t('stop')}
        onClick={stop}
      />
    </LunaToolbar>
  )
})
