<style lang="scss">
.field-ref-editor-wrapper {
  max-height: 500px;
  max-width: 600px;
  .fitem {
    cursor: pointer;
    &:hover {
      background: #eee !important;
    }
  }
}
</style>

<template lang="pug">
.field-ref-editor-wrapper.column.full-width.q-pa-md.bg-grey-3
  //- header
  .row.full-width.items-center.content-center.q-pb-md
    .col
      h6.q-ma-xs Links editor
    q-btn(
      round flat dense color="black" icon="add"
      @click="itemCreateAndLink").q-mr-md
    q-btn(
      round flat dense color="black" icon="clear"
      @click="$emit('close')")
  //- search bar
  .row.full-width
    q-input(
      v-model="state.searchText"
      filled
      placeholder="Search"
      :input-style="{padding: '8px', borderRadius: '4px', overflow: 'hidden'}"
      ).full-width
      template(v-slot:append)
        q-btn(
          v-if="state.searchText.length > 0"
          color="red" flat dense no-caps
          @click="state.searchText = ''") Clear
    //- pick refsFrom
    .row.full-width.q-pt-sm
      q-btn-group(outline).full-width
        q-btn(
          v-for="t in state.refsFromItems" :key="t.id"
          color="grey-10" no-caps dense
          :outline="t.id !== state.refsFrom"
          :filled="t.id === state.refsFrom"
          @click="state.refsFrom = t.id").col {{ t.name }}
  //- body items
  //- TODO add quasar table with pagination, and?
  .col.full-width.scroll.q-mt-sm
    .row.full-width.items-start.content-start
      div(
        v-for="(i,ii) in state.items" :key="i.id"
        ).fitem.row.full-width.items-center.content-center.q-px-sm.q-py-xs.bg-white
        //- q-btn(
          round flat dense icon="preview"
          @click="itemOpen(i)")
        div(
          @click="itemOpen(i)"
          ).col.q-px-sm
          span {{ i.name }}
        q-btn(
          v-if="state.refsFrom === 'linked'"
          round flat dense icon="delete_outline"
          @click="itemUnlink(i)")
        q-btn(
          v-if="state.refsFrom === 'new'"
          round flat dense icon="link"
          @click="itemLink(i)")
</template>

<script setup>
// TODO add auto-import to Quasar projects...
import { reactive, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/api'

const $q = useQuasar()
const logger = inject('logger')('FieldRefEditor')

const emit = defineEmits(['close', 'item:update'])
const props = defineProps({
  definition: { type: Object, required: true },
  value: { type: Array, default: () => [] },
})

const state = reactive({
  refsFromItems: [{ id: 'linked', name: 'Linked' }, { id: 'new', name: 'New' }],
  refsFrom: 'linked',
  items: computed(() => {
    if (state.refsFrom === 'linked') return state.itemsLinked
    else if (state.refsFrom === 'new') return state.itemsNew
    else return []
  }),
  itemsLinked: computed(() => {
    // TODO filter linked from value only?
    return props.value.filter(i => {
      return i.name.includes(state.searchText)
    })
  }),
  itemsNew: computed(() => {
    // TODO filter new not linked items not in itemsLinked?
    return [{ id: 'black', name: 'Black' }, { id: 'white', name: 'White' }]
  }),
  searchText: '',
})

const itemUnlink = (item) => {
  logger.log(':itemUnlink', item)
  // Confirm dialog, Just unlink, Unlink and delete, Cancel
  $q.dialog({
    title: 'Unlink item',
    message: 'Choose your options:',
    options: {
      type: 'toggle',
      model: [],
      // inline: true,
      items: [
        { label: 'And delete', value: 'after:delete', color: 'secondary' },
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(options => {
    logger.log(':itemUnlink >>>> OK, received', options)
    // unlink with supabase
    if (options.includes('after:delete')) {
      // delete it after, maybe soft
      // delete with supabase
    }
  }).onCancel(() => {
    logger.log(':itemUnlink >>>> Cancel')
  }).onDismiss(() => {
    logger.log(':itemUnlink I am triggered on both OK and Cancel')
  })
}

const itemLink = (item) => {
  logger.log('itemLink', item)
  // we just link if not linked already
  // TODO link with supabase
}
const itemCreateAndLink = () => {
  logger.log('itemCreateAndLink')
  // open itemEditor for new item
  // on success event:created we link it
}

const itemOpen = (item) => {
  logger.log('itemOpen', item)
  // open itemEditor, nested and read only...
}

onMounted(() => {
  logger.log('onMounted')
})

onBeforeUnmount(() => {
  logger.log('onBeforeUnmount')
})
</script>
