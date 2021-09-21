<style lang="scss" scoped>
</style>

<template lang="pug">
q-page.q-pa-md
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(round color="primary" size="md" icon="add" class="" @click="itemCreate()")
  q-dialog(
    dark side="right" position="right" square full-height
    :model-value="state.item ? true : false"
    :persistent="state.itemChanged"
    @shake="itemChangedTryClose"
    @hide="state.item = null").window-height
    ItemEditor(
      v-if="state.item"
      ref="refItemEditor"
      :item="state.item"
      :definition="state.definition"
      :style="{minWidth: '550px', maxWidth: '550px'}"
      @item-changed="state.itemChanged = true"
      @close="state.item = null")
  //- items
  q-table(
    dense flat
    :rows="items"
    :columns="itemsColumns"
    @row-click="itemClick")
</template>

<script >
import useSWRV from 'swrv'
import { defineComponent, ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useStoreMain } from 'src/stores/main.js'
import ItemEditor from 'components/item/ItemEditor.vue'

export default defineComponent({
  name: 'PageTable',
  components: {
    ItemEditor
  },
  setup () {
    const refItemEditor = ref(null)
    const storeMain = useStoreMain()

    const { data: schema } = useSWRV('/schema', null)
    const state = reactive({
      tableId: computed(() => storeMain.page.id),
      definition: computed(() => schema?.value.definitions[state.tableId]),
      item: null,
      itemChanged: false
    })
    // const { data: items, error: itemsError } = useSWRV(`/${tableId.value}?select=*`, fetcher)
    const tables = {
      offers: [
        { id: '1', title: 'Offer one', game_id: null, discount_id: null },
        { id: '2', title: 'Offer two', game_id: null, discount_id: null }
      ]
    }
    const items = computed(() => {
      return tables[state.tableId] || []
    })
    const itemsColumns = computed(() => {
      return Object.entries(state.definition.properties).map(([key, val]) => {
        return {
          name: key,
          label: key,
          field: key
        }
      })
    })

    const itemClick = (e, item, itemIndex) => {
      console.log('[PageTable] itemClick', e, item, itemIndex)
      state.item = item
    }
    const itemCreate = () => {
      console.log('[PageTable] itemCreate')
      // go to server, try to create it
      // then update it? cant create without required fields...
    }
    const itemChangedTryClose = () => {
      console.log('[PageTable] itemChangedTryClose')
      if (refItemEditor.value) {
        refItemEditor.value.tryItemClose()
      }
    }
    onMounted(() => {
      console.log('[PageTable] onMounted')
    })
    onBeforeUnmount(() => {
      console.log('[PageTable] onBeforeUnmount')
    })

    return {
      refItemEditor,
      items,
      itemsColumns,
      state,
      itemClick,
      itemCreate,
      itemChangedTryClose
    }
  }
})
</script>
