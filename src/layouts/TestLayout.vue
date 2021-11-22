<style lang="scss">
.q-table {
  tbody {
    border-bottom: 1px solid #eee;
  }
}
</style>

<template lang="pug">
q-layout()
  q-dialog(
    v-model="state.itemEditorOpened"
    @hide="state.item = null")
    ItemEditor(
      :config="config" :type="type" :item="state.item"
      @close="state.itemEditorOpened = false, state.item = null")
  q-page-container
    q-page
      .row.full-width.items-center.content-center
        q-btn(flat icon="data_array")
        q-tabs(v-model="state.typeSelected" no-caps dense align="left" switch-indicator)
          q-tab(v-for="(t,tkey) in config.types" :key="tkey" :name="tkey" :label="t.name")
        q-btn(flat dense icon="add")
      //- table
      div().row.full-width
        .row.full-width.q-pa-sm.items-center.content-center
          q-btn(flat dense no-caps color="grey-7" icon="keyboard_arrow_down").q-ml-xs.q-mr-sm Table
          q-btn(flat dense no-caps color="grey-7") Filters
          q-btn(flat dense no-caps color="grey-7") Columns
          q-btn(flat dense no-caps color="grey-7").q-mr-sm Sort
          q-input(v-model="state.itemSearchString" dense borderless placeholder="Search" style="font-weight: 500; max-width: 330px").col
        q-table(
          dense flat
          separator="cell"
          :rows="items"
          :columns="itemsColumns"
          :style="{borderTop: '1px solid #eee', height: 'calc(100vh - 100px)'}"
          @row-click="itemClick"
          ).full-width
          template(v-slot:body-cell="props")
            td(v-if="props.col.meta.input === 'ref'")
              //- small {{props.value[0] ? props.value[0] : '-'}}
              div(v-for="(i,ii) in props.value").row.full-width
                small {{i}}
            td(v-else)
              small {{props.value}}
      q-page-sticky(position="bottom-right" :offset="[26, 64]")
        q-btn(round color="black" icon="add" size="lg" @click="state.itemEditorOpened = true")
</template>

<script setup>
import { extend } from 'quasar'
import { supabase, useLogger, fetcher } from 'boot/api'
import useSWRV from 'swrv'
import ItemEditor from 'components/test/ItemEditor.vue'

const logger = useLogger('TestLayout')

const state = reactive({
  type: null,
  typeEditorOpened: false,
  typeSelected: null,
  typeDefault: {
    type: 'object',
    name: '',
    description: '',
    properties: {}
  },
  // prop: null,
  // propEd
  item: null,
  itemEditorOpened: false,
  itemSearchString: '',
})

const config = reactive({
  types: {
    t1: {
      type: 'object',
      name: 'Person',
      description: '',
      properties: {
        p1: { name: 'Name', type: 'string', input: 'text' },
        p2: { name: 'Friend', type: 'object', input: 'ref', ref: 't1' },
        p3: { name: 'Enemy', type: 'object', input: 'ref', ref: 't1' },
        p4: { name: 'Apple', type: 'object', input: 'ref', ref: 't2' },
        p5: { name: 'Active', type: 'boolean', input: 'checkbox', default: false },
        // p4: { name: 'Image background', type: 'object', input: 'image' }
      },
      meta: {
        propertyLabel: 'p1',
        columnsDefault: ['p1', 'p2', 'p3']
      },
      permissions: {
        r1: {
          create: null,
          read: 'created_at=eq.shit',
          update: null,
          delete: null
        }
      }
    },
    t2: {
      type: 'object',
      name: 'Apple',
      description: '',
      properties: {
        p1: { name: 'Color', type: 'string', input: 'color' }
      },
      meta: {
        propertyLabel: 'p1',
        columnsDefault: ['p1']
      }
    }
  },
  typePropertiesLocked: ['id', 'type', 'created_at', 'created_by', 'updated_at', 'updated_by', 'deleted_at', 'deleted_by'],
  typePropertiesDefault: {
    id: { name: 'ID', type: 'string', input: 'id' },
    type: { name: 'Type', type: 'string', input: 'type' },
    created_at: { name: 'Created', type: 'string', input: 'date' },
    updated_at: { name: 'Updated', type: 'string', input: 'date' },
    deleted_at: { name: 'Deleted', type: 'string', input: 'date' }
  }
})

const type = computed(() => {
  return config.types[state.typeSelected]
})

const typeRelations = computed(() => {
  if (!type.value) return []
  return Object.entries(type.value.properties)
    .reduce((acc, [key, val]) => {
      if (val.input === 'ref') acc.push(key)
      // acc.push()
      return acc
    }, [])
})

const urlSelect = '*'
const urlSelectRelations = 'ra:r!ia(type,ib(*)),rb:r!ib(type,ia(*))'
const urlFilterRelations = computed(() => {
  const keys = typeRelations.value.join(',')
  return `ra.type=in.(${keys})&rb.type=in.(${keys})`
})
// const urlLimitRelations = ''
// const urlOrderRelations = ''
const urlFilterType = computed(() => {
  // return 'type=neq.null'
  return `type=eq.${state.typeSelected}`
})
const { data, error } = useSWRV(() => state.typeSelected && `/i?select=${urlSelect},${urlSelectRelations}&${urlFilterRelations.value}&${urlFilterType.value}`, fetcher)

const itemClick = (e, row) => {
  logger.log('itemClick', row)
  state.item = row
  state.itemEditorOpened = true
}

const itemPack = (type, itemRaw) => {
  // logger.log('itemPack')
  // relations?
  // return {id,type,data:{p1,p2,p3}}
}

const itemUnpack = (type, itemRaw, relationsRaw) => {
  // logger.log('itemUnpack')
  if (!type || !itemRaw) return {}
  const item = {
    id: itemRaw.id,
    type: config.types[itemRaw.type].name,
    created_at: itemRaw.created_at,
    updated_at: itemRaw.updated_at,
    deleted_at: itemRaw.deleted_at,
  }
  const data = Object.entries(type.properties)
    .reduce((acc, [key, val]) => {
      // logger.log('key', key)
      const k = val.name.toLowerCase().replace(/ /g, '_')
      if (relationsRaw && val.input === 'ref') {
        const ir = relationsRaw[key] || []
        // logger.log('ir', ir)
        acc[k] = ir.map(iir => itemUnpack(config.types[iir.type], iir))
      }
      else {
        acc[k] = itemRaw.data[key] === undefined ? null : itemRaw.data[key]
      }
      return acc
    }, {})
  return { ...item, ...data }
}

const items = computed(() => {
  if (!data.value) return []
  return data.value.reduce((acc, i) => {
    // check type
    const type = config.types[i.type]
    // logger.log('type', type)
    if (!type) return acc
    // relations
    const relations = {}
    i.ra.map(ir => {
      if (!relations[ir.type]) relations[ir.type] = []
      relations[ir.type].push(ir.ib)
      return ir
    })
    i.rb.map(ir => {
      if (!relations[ir.type]) relations[ir.type] = []
      relations[ir.type].push(ir.ia)
      return ir
    })
    // logger.log('relations', relations)
    // data
    const item = itemUnpack(type, i, relations)
    // item
    acc.push(item)
    return acc
  }, [])
})

const itemsColumns = computed(() => {
  const type = config.types[state.typeSelected]
  if (!type) return []
  return Object.entries(type.properties)
    .reduce((acc, [key, val]) => {
      const k = val.name.toLowerCase().replace(/ /g, '_')
      acc.push({
        // name: 'data',
        // field: (row) => row.data[k],
        name: k,
        field: k,
        label: val.name,
        align: 'left',
        sortable: true,
        meta: val
      })
      return acc
    }, [
      { name: 'id', field: 'id', label: 'ID', align: 'left', sortable: true, meta: { name: 'ID', type: 'string', input: 'id' } },
      { name: 'type', field: 'type', label: 'Type', align: 'left', sortable: true, meta: { name: 'Type', type: 'string', input: 'type' } },
      { name: 'created_at', field: 'created_at', label: 'Created', align: 'left', sortable: true, meta: { name: 'Created', type: 'string', input: 'datez' } },
      { name: 'updated_at', field: 'updated_at', label: 'Updated', align: 'left', sortable: true, meta: { name: 'Updated', type: 'string', input: 'datez' } },
      { name: 'deleted_at', field: 'deleted_at', label: 'Deleted', align: 'left', sortable: true, meta: { name: 'Deleted', type: 'string', input: 'datez' } },
    ])
})

onMounted(() => {
  logger.log(':onMounted')
  const types = Object.keys(config.types)
  if (types.length) state.typeSelected = types[0]
})
</script>
