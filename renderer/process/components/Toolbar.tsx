import { observer } from 'mobx-react-lite'
import LunaToolbar, { LunaToolbarInput } from 'luna-toolbar/react'
import store from '../store'
import { t } from '../../../common/i18n'

export default observer(function Toolbar() {
  return (
    <LunaToolbar>
      <LunaToolbarInput
        keyName="filter"
        value={store.filter}
        placeholder={t('filter')}
        onChange={(val) => store.setFilter(val)}
      />
    </LunaToolbar>
  )
})
