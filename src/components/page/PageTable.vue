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
      :tableId="tableId"
      :relationUrl="relationUrl"
      :item="state.item"
      :definition="definition"
      :style="{minWidth: '550px', maxWidth: '550px'}"
      @item-changed="state.itemChanged = true"
      @close="state.item = null")
  //- items
  q-table(
    dense flat
    v-model:pagination="pagination"
    :loading="state.isLoading"
    :rows="state.items"
    :columns="itemsColumns"
    :style="{minHeight: '50vh'}"
    @request="onRequest"
    @row-click="itemClick")
</template>

<script >
import useSWRV from 'swrv'
import { defineComponent, ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useStoreMain } from 'src/stores/main.js'
import { rowFormating, isForeignKey, isPrimaryKey } from 'src/helpers/supabase.helper'
import ItemEditor from 'components/item/ItemEditor.vue'
import { fetcher, supabase } from 'boot/api'

export default defineComponent({
  name: 'PageTable',
  components: {
    ItemEditor
  },
  setup () {
    const refItemEditor = ref(null)
    const storeMain = useStoreMain()
    const logger = inject('logger')('PageTable')
    const { data: schema } = useSWRV('/schema', null)
    const tableBaseUrl = `/${storeMain.page.id}?select=*`
    const state = reactive({
      item: null,
      itemChanged: false,
      isLoading: false,
      items: [],
    })
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10
    })
    const definition = schema?.value.definitions[storeMain.page.id]
    const relationUrl = computed(() => {
      let base = tableBaseUrl
      Object
        .entries(definition.properties)
        .forEach(([key, val]) => {
          if (isForeignKey(val)) {
            base += `,${key}(*)`
          }
        })
      return base === tableBaseUrl ? null : base
    })

    const onRequest = async ({ pagination: { page, rowsPerPage, sortBy, descending } }) => {
      state.isLoading = true
      const startRecord = (page - 1) * rowsPerPage
      const { data } = await supabase.from(storeMain.page.id).select().range(startRecord, startRecord + rowsPerPage - 1)
      state.items = data
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.descending = descending
      state.isLoading = false
    }

    const itemsColumns = computed(() => {
      return Object.entries(definition.properties).map(([key, val]) => {
        const r = {
          name: key,
          label: key,
          field: key
        }
        r.style = 'max-width: 300px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center;'
        if (isPrimaryKey(val) || isForeignKey(val)) {
          r.style = 'max-width: 100px; overflow: hidden; text-overflow: ellipsis'
        }
        r.format = rowFormating(val.format)
        return r
      })
    })

    const itemClick = (e, item, itemIndex) => {
      logger.log('itemClick', e, item, itemIndex)
      state.item = item
    }
    const itemCreate = () => {
      logger.log('itemCreate')
      // go to server, try to create it
      // then update it? cant create without required fields...
    }
    const itemChangedTryClose = () => {
      logger.log('itemChangedTryClose')
      if (refItemEditor.value) {
        refItemEditor.value.tryItemClose()
      }
    }
    onMounted(async () => {
      logger.log('onMounted')
      onRequest({ pagination: pagination.value })
      const { count } = await supabase.from(storeMain.page.id).select('*', { count: 'exact', head: true })
      pagination.value.rowsNumber = count
    })
    onBeforeUnmount(() => {
      logger.log('onBeforeUnmount')
    })
    logger.log('definition: ', definition)
    return {
      refItemEditor,
      itemsColumns,
      state,
      pagination,
      definition,
      tableId: storeMain.page.id,
      relationUrl,
      onRequest,
      itemClick,
      itemCreate,
      itemChangedTryClose
    }
  }
})
</script>
