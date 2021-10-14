<style lang="scss" scoped>
</style>

<template lang="pug">
q-input(v-if="labelKeys.length === 1" v-model="state.searchText" debounce="500" placeholder="Search by key")
  template(v-slot:prepend)
    q-icon(name="search")
pre(v-else) Search for composite keys is not supported, please add "labelColumn" to enable search
div(v-if="state.error").text-red {{ state.error }}
q-list(ref="scrollTargetRef" style="max-height: 500px;").full-width.scroll
  q-infinite-scroll(@load="onLoad" :offset="100" :scroll-target="scrollTargetRef" :disable="!state.totalCount || state.items.length >= state.totalCount")
    q-expansion-item(v-for="(item, index) in filteredItems" group="itemSearchList" :key="index" expand-icon-toggle)
      template(v-slot:header)
        q-item-section {{ labelKeys.map(labelKey => item[labelKey]).join(', ') }}
        q-item-section(side)
          .row.items-right
            q-btn(v-if="canSelect" size="12px" flat dense round icon="done" @click="handleSelect(item)").text-grey-8
      q-card(style="border-radius: 10px;").bg-grey-2
        q-card-section
          div(v-for="(propertyDefinition,property) in definition.properties")
            strong {{ property }}
            span : {{ rowFormating(propertyDefinition.format)(item[property]) }}
    template(v-slot:loading)
      .row.justify-center.q-my-md
        q-spinner-dots(color="primary" size="40px")
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from 'src/boot/api'
import { rowFormating, areEntitiesEqual } from 'src/helpers/supabase.helper'

const props = defineProps({
  definition: { type: Object, required: true },
  labelKeys: { type: Array, required: true },
  tableId: { type: String, required: true },
  selectedItems: { type: Array, required: true },
  canSelect: { type: Boolean },
  hasLabel: { type: Boolean },
  modelValue: { type: Object },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['select'])

const state = reactive({
  loading: true,
  items: [],
  error: undefined,
  searchText: '',
  filterQuery: undefined,
  page: 0,
  totalCount: 0,
})

const handleSelect = (item) => {
  emit('select', props.modelValue instanceof Array ? [...props.modelValue, item] : item)
}

watch(() => state.searchText, async (newValue) => {
  let baseCountQuery = supabase.from(props.tableId).select('*', { count: 'exact', head: true })
  if (newValue) {
    const query = props.hasLabel ? [props.labelKeys[0], 'like', `%${newValue}%`] : [props.labelKeys[0], 'eq', newValue]
    state.filterQuery = query
    baseCountQuery = baseCountQuery.filter(...query)
  } else {
    state.filterQuery = undefined
  }
  const { count } = await baseCountQuery
  state.totalCount = count
  state.items = []
  state.page = 0
  await onRequest()
})

const filteredItems = computed(() => {
  return state.items.filter(item => !props.selectedItems.some(item2 => areEntitiesEqual(props.definition.properties, item, item2)))
})

onMounted(async () => {
  const { count } = await supabase.from(props.tableId).select('*', { count: 'exact', head: true })
  state.totalCount = count
})

const onRequest = async () => {
  state.loading = true
  state.error = undefined
  const startRecord = state.page * props.pageSize
  let baseQuery = supabase.from(props.tableId).select().range(startRecord, startRecord + props.pageSize - 1)
  if (state.filterQuery) {
    baseQuery = baseQuery.filter(...state.filterQuery)
  }
  const { data, error } = await baseQuery
  if (data) state.items = state.page ? [...state.items, ...data] : data
  else if (error) state.error = error.message
  else state.error = 'No data returned during search'
  state.loading = false
}

const onLoad = async (index, done) => {
  state.page = index - 1
  await onRequest()
  done()
}

const scrollTargetRef = ref(null)

</script>
