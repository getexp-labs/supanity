<style lang="scss" scoped>
</style>

<template lang="pug">
q-page.q-pa-md
  //- items
  //- ItemTable(
  //-   dense
  //-   flat
  //-   :definition="definition"
  //-   :tableId="tableId"
  //-   @row-click="itemClick"
  //- )
  <q-input v-if="labelKeys.length === 1" v-model="state.searchText" debounce="500" placeholder="Search by key">
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
  pre(v-else) Search for composite keys is not supported, please add "labelColumn" to enable search
  div(v-if="state.error").text-red {{state.error}}
  q-list.full-width
    q-item(v-for="item in state.items")
      - var itemKeys = labelKeys.map(labelKey => item[labelKey]).join('_')
      q-item-label {{itemKeys.slpit('_').join(', ')}}
    q-item-section(side)
      q-btn(v-if="!hasValue(item)" size="12px" flat dense round icon="done" @click="handleSelect").gt-xs.text-grey-8.q-gutter-xs
      q-icon(v-else size="12px" icon="done").gt-xs.text-success
      q-btn(v-else size="12px" flat dense round icon="delete" @click="() => handleDelete(item)").gt-xs.text-red.q-gutter-xs
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import useSWRV from 'swrv'
import { getForeignKeyTable, getPrimaryKeyMapping } from 'src/helpers/supabase.helper'
import { supabase } from 'src/boot/api'

const props = defineProps({
  definition: { type: Object, required: true },
  tableId: { type: String, required: true },
  labelKeys: { type: Array },
  modelValue: { type: Object }
})

const emit = defineEmits(['update:modelValue'])

const state = reactive({
  loading: true,
  items: undefined,
  error: undefined,
  searchText: '',
})

const $q = useQuasar()

const logger = inject('logger')('FieldRef')

const { data: schema } = useSWRV('/schema', null)
const foreignTable = getForeignKeyTable(props.definition)
const foreignTableDefinition = schema.value.definitions[foreignTable]
const labelColumn = foreignTableDefinition?.meta?.labelColumn
const foreignProperties = foreignTableDefinition?.properties
const labelKeys = computed(() => foreignTableDefinition?.meta?.labelColumn
  ? [foreignTableDefinition?.meta?.labelColumn]
  : Object.keys(getPrimaryKeyMapping(foreignProperties, props.modelValue))
)

const handleDelete = (item) => {
  logger.log(':delete start')
  emit('update:modelValue', props.modelValue instanceof Array ? props.modelValue.filter(modelItem => modelItem !== item) : null)
  logger.log(':delete end')
}

const handleSelect = (item) => {
  emit('update:modelValue', props.modelValue instanceof Array ? [...props.modelValue, item] : item)
}

const hasValue = (item) =>
  props.modelValue instanceof Array ? props.modelValue.includes(item) : props.modelValue === item

onMounted(async () => {
  const { data, error } = await supabase.from(props.tableId).select()
  state.items = data
  state.loading = false
})

watch(() => state.searchText, async (newValue) => {
  state.loading = false
  state.error = undefined
  let baseQuery = supabase.from(props.tableId).select()
  if (newValue) {
    const filterQuery = labelColumn ? [labelColumn, 'like', `%${newValue}%`] : [labelKeys.value[0], 'eq', newValue]
    baseQuery = baseQuery.filter(...filterQuery)
  }
  const { data, error } = await baseQuery
  if (data) state.items = data
  else if (error) state.error = error.message
  else state.error = 'No data returned during search'
  state.loading = true
})

const expanded = ref(false)
</script>
