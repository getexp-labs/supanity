<style lang="scss" scoped>
</style>

<template lang="pug">
q-table(
  dense flat
  v-model:pagination="pagination"
  :loading="state.isLoading"
  :rows="state.items"
  :columns="itemColumns"
  :filter="state.filterString"
  :style=`{
    minHeight: '80vh'
  }`
  @request="onRequest"
  @row-click="itemClick"
  )
  template(v-slot:top-right)
    .row
      q-input(
        v-model="state.filterString"
        borderless dense
        debounce="300"
        placeholder="Search")
        template(v-slot:append)
          q-icon(name="search")
</template>

<script setup>
// TODO add sticky header and footer and take all the height
import { supabase } from 'boot/api'
import { rowFormating, isForeignKey, isPrimaryKey } from 'src/helpers/supabase.helper'

const props = defineProps({
  rowActions: { type: Array },
  hiddenColumns: { type: Array, default: () => [] },
  tableId: { type: String, required: true },
  definition: { type: Object, required: true },
})

const emit = defineEmits(['row-click'])

const logger = inject('logger')('ItemTable')

const state = reactive({
  isLoading: false,
  items: [],
  filterString: '',
})

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 10
})

const onRequest = async ({ pagination: { page, rowsPerPage, sortBy, descending } }) => {
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
}

const itemColumns = computed(() => {
  const hiddenColumns = props.definition.meta?.tableHiddenColumns
    ? props.definition.meta.tableHiddenColumns
    : props.hiddenColumns
  return Object
    .entries(props.definition.properties)
    .filter(([key]) => !hiddenColumns.includes(key))
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
})

const refresh = () => onRequest({ pagination: pagination.value })

defineExpose({
  refresh
})

const itemClick = (e, item, itemIndex) => {
  logger.log('row-click', e, item, itemIndex)
  emit('row-click', e, item, itemIndex)
}
onMounted(async () => {
  logger.log('onMounted')
  onRequest({ pagination: pagination.value })
  const { count } = await supabase.from(props.tableId).select('*', { count: 'exact', head: true })
  pagination.value.rowsNumber = count
})
</script>
