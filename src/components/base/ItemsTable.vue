<style lang="scss" scoped>
</style>

<template lang="pug">
q-table(
  dense flat square
  separator="cell"
  table-header-class="text-left"
  :loading="state.isLoading"
  :rows="state.items"
  :columns="itemColumns"
  :visible-columns="state.properties"
  :filter="state.filterString"
  :pagination="pagination"
  :style=`{
    minHeight: '80vh'
  }`
  @request="onRequest"
  @row-click="itemClick"
  )
  template(v-slot:top)
    .row.full-width.items-center.content-center
      q-input(
        v-model="state.filterString"
        borderless dense
        debounce="300"
        placeholder="Search"
        ).col
        template(v-slot:prepend)
          q-icon(name="search")
      q-btn(color="grey-6" flat dense no-caps) Properties
      q-btn(color="grey-6" flat dense no-caps) Filter
      q-btn(color="grey-6" flat dense no-caps) Sort
      q-btn(color="grey-6" flat dense icon="more_vert")
  template(v-slot:header-cell="{col}")
    th.br
      .row.full-width.justify-start
        span {{col.name}}
</template>

<script setup>
// TODO add sticky header and footer and take all the height
import { supabase } from 'boot/api'
import { rowFormating, isForeignKey, isPrimaryKey } from 'src/helpers/supabase.helper'

const logger = inject('logger')('ItemTable')

const emit = defineEmits(['row-click'])
const props = defineProps({
  rowActions: { type: Array },
  hiddenColumns: { type: Array, default: () => [] },
  tableId: { type: String, required: true },
  definition: { type: Object, required: true },
})

const state = reactive({
  isLoading: false,
  items: [],
  filterString: '',
  properties: []
})

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 10
})

const onRequest = async ({ pagination: { page, rowsPerPage, sortBy, descending } }) => {
  logger.log(':onRequest start')
  state.isLoading = true
  const startRecord = (page - 1) * rowsPerPage
  let query = supabase.from(props.tableId).select()
  // for 'All' options quasar sets rowsPerPage to 0
  if (rowsPerPage !== 0) {
    query = query.range(startRecord, startRecord + rowsPerPage - 1)
  }
  const { data } = await query
  state.items = data
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
  state.isLoading = false
  logger.log(':onRequest done')
}

const itemColumns = computed(() => {
  const hiddenColumns = props.definition.meta?.tableHiddenColumns
    ? props.definition.meta.tableHiddenColumns
    : props.hiddenColumns

  return Object
    .entries(props.definition.properties)
    // .filter(([key]) => !hiddenColumns.includes(key))
    .map(([key, val]) => {
      const columnDefinition = {
        name: key,
        label: key,
        field: key,
        align: 'left',
      }

      columnDefinition.style = 'max-width: 300px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'

      if (isPrimaryKey(val) || isForeignKey(val)) {
        columnDefinition.style = 'max-width: 100px; overflow: hidden; text-overflow: ellipsis'
      }

      columnDefinition.format = rowFormating(val.format)

      return columnDefinition
    })
    // .filter(c => {
    //   return ['title', 'cost'].includes(c.field)
    // })
})

const refresh = () => onRequest({ pagination: pagination.value })

defineExpose({
  refresh
})

const itemClick = (e, item, itemIndex) => {
  logger.log('itemClick', e, item, itemIndex)
  emit('row-click', e, item, itemIndex)
}

onMounted(async () => {
  logger.log(':onMounted')
  // Properties
  let tableColumnsDefault = props.definition.meta.tableColumns
  if (!tableColumnsDefault) {
    tableColumnsDefault = Object.keys(props.definition.properties)
  }
  state.properties = tableColumnsDefault
  onRequest({ pagination: pagination.value })
  const { count } = await supabase.from(props.tableId).select('*', { count: 'exact', head: true })
  pagination.value.rowsNumber = count
})

onBeforeUnmount(() => {
  logger.log(':onBeforeUnmount')
})
</script>
