<style lang="scss">
.q-table {
  tr {
    &:hover {
      background: #eee;
    }
    th {
      text-align: center;
    }
  }
}
</style>

<template lang="pug">
q-page()
  //- Dialog with item editor
  q-dialog(
    v-model="showEditor"
    dark side="right" position="right" square full-height
    :persistent="itemChanged"
    @shake="tryItemClose"
    ).window-height
    ItemEditor(
      :tableId="storeMain.page.id"
      :item="selectedItem"
      :definition="definition"
      :globalDisabledFields="schema?.meta?.disabledFields"
      :canEdit="!definition.meta?.disabled"
      @item-changed="itemChanged = true"
      @item-upserted="handleUpsert"
      )
  //- TODO
  //- Item Table
  ItemsTable(
    ref="tableObj"
    dense
    flat
    :definition="definition"
    :hiddenColumns="schema?.meta?.tableHiddenColumns"
    :tableId="storeMain.page.id"
    :style="{height: 'calc(100vh - 50px)'}"
    @row-click="itemClick"
    )
  //- Action Add Button
  q-page-sticky(v-if="!definition.meta?.disabled" position="bottom-right" :offset="[32, 64]")
    q-btn(round color="primary" size="md" icon="add" @click="handleAdd")
</template>

<script setup>
import useSWRV from 'swrv'
import { useQuasar } from 'quasar'
import { useStoreMain } from 'src/stores/main.js'
import ItemEditor from 'components/item/ItemEditor.vue'
import ItemsTable from 'components/base/ItemsTable.vue'

const $q = useQuasar()
const storeMain = useStoreMain()
const logger = inject('logger')('PageTable')
const { data: schema } = useSWRV('/schema', null)
const definition = schema?.value.definitions[storeMain.page.id]
const showEditor = ref(false)
const itemChanged = ref(false)
const selectedItem = ref()

const itemClick = (_, item) => {
  selectedItem.value = item
  showEditor.value = true
}

const handleAdd = () => {
  selectedItem.value = undefined
  showEditor.value = true
}

onBeforeUnmount(() => {
  logger.log('onBeforeUnmount')
})

const handleUpsert = (message) => {
  showEditor.value = false
  itemChanged.value = false
  tableObj.value.refresh()
  $q.notify({ message, type: 'positive', html: true })
}

const tryItemClose = () => {
  logger.log(':tryItemClose')
  if (itemChanged.value) {
    // dialog with save changed or discard?
    $q.dialog({
      title: 'Unsaved changes',
      message: 'You have made some unsaved, are you sure you want to close the form?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      logger.log('>>>> OK')
      showEditor.value = false
      itemChanged.value = false
    }).onCancel(() => {
      logger.log('>>>> Cancel')
    }).onDismiss(() => {
      logger.log('I am triggered on both OK and Cancel')
    })
  } else {
    showEditor.value = false
  }
}

const tableObj = ref(null)

</script>
