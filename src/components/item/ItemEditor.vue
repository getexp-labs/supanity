<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  v-if="state.item"
  ).column.full-width.window-height.bg-white
  div(style="height: 50px;").row.full-width.items-center.content-center.q-px-md.bg-primary
    span(style="font-size: 18px").text-bold.text-white {{ state.item.title }}
  .col.full-width.scroll
    div(style="margin-bottom: 50vh").row.full-width.items-start.content-start.q-px-md.q-pt-md
      div(
        v-for="(p,pkey) in definition.properties" :key="pkey"
        ).row.full-width.q-mb-sm
        FieldID(
          v-if="pkey === 'id'"
          :label="pkey"
          :value="state.item[pkey]"
          :definition="p"
          :fieldKey="pkey")
        FieldText(
          v-else-if="p.type === 'string' && p.format === 'text'"
          :label="pkey"
          :value="state.item[pkey]"
          :definition="p"
          :fieldKey="pkey")
        FieldBoolean(
          v-else-if="p.type === 'boolean'"
          :label="pkey"
          :value="state.item[pkey]"
          :definition="p"
          :fieldKey="pkey"
          @update="fieldUpdated(pkey, $event)")
        FieldNumber(
          v-else-if="p.type === 'integer'"
          :label="pkey"
          :value="state.item[pkey]"
          :definition="p"
          :fieldKey="pkey")
        FieldRef(
          v-else-if="p.type === 'string' && p.format === 'uuid'"
          :label="pkey"
          :value="state.item[pkey]"
          :definition="p"
          :fieldKey="pkey")
        FieldJSONB(
          v-else-if="p.type === 'string' && p.format === 'jsonb'"
          :label="pkey"
          :value="state.item[pkey]"
          :definition="p"
          :fieldKey="pkey")
  //- actions
  .row.full-width.q-px-md.q-py-sm
    //- TODO create
    q-btn(
      dense no-caps color="primary"
      @click="handleUpdate").q-px-sm.q-mr-sm Update
    q-btn(
      dense no-caps outline color="red"
      @click="handleDelete").q-px-sm Delete
</template>

<script>
import { defineComponent, reactive, onMounted, onBeforeUnmount, watch, inject } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/api'
import FieldID from './FieldID.vue'
import FieldText from './FieldText.vue'
import FieldBoolean from './FieldBoolean.vue'
import FieldNumber from './FieldNumber.vue'
import FieldRef from './FieldRef.vue'
import FieldJSONB from './FieldJSONB.vue'

export default defineComponent({
  name: 'ItemEditor',
  components: {
    FieldID,
    FieldText,
    FieldBoolean,
    FieldNumber,
    FieldRef,
    FieldJSONB
  },
  props: ['tableId', 'item', 'definition'],
  emits: ['item-changed', 'close'],
  setup (props, ctx) {
    const $q = useQuasar()
    const logger = inject('logger')('ItemEditor')
    const state = reactive({
      item: null,
      ready: false,
      updating: false,
      deleting: false,
      changed: false
    })
    const fieldUpdated = (k, val) => {
      logger.log(':fieldUpdated', k, val)
      state.item[k] = val
    }
    const itemUpdate = () => {
      logger.log(':itemUpdate')
      state.changed = false
    }
    const itemDelete = () => {
      logger.log(':itemDelete')
    }

    watch(
      () => state.item,
      (to, from) => {
        logger.log(':W state.item')
        if (to && from) {
          state.changed = true
          ctx.emit('item-changed')
        }
      },
      { deep: true })

    const tryItemClose = () => {
      logger.log(':tryItemClose')
      if (state.changed) {
        // dialog with save changed or discard?
        $q.dialog({
          title: 'Save changes?',
          message: '',
          cancel: true,
          persistent: true
        }).onOk(() => {
          logger.log('>>>> OK')
          itemUpdate()
          ctx.emit('close')
        }).onCancel(() => {
          logger.log('>>>> Cancel')
          ctx.emit('close')
        }).onDismiss(() => {
          logger.log('I am triggered on both OK and Cancel')
          ctx.emit('close')
        })
      }
    }

    const handleCreate = async () => {
      logger.log(':handleCreate start')
    }
    const handleUpdate = async () => {
      logger.log(':handleUpdate start')
      try {
        const payload = { color: state.item.color }
        // const data = supabase
        //   .from(props.tableId)
        //   .update(payload)
        //   .match({ id: item.id })
        logger.log(':handleUpdate done', data)
      }
      catch (e) {
        logger.log(':handleUpdate e', e)
      }
    }
    const handleDelete = () => {
      logger.log(':handleDelete start')
    }

    onMounted(() => {
      logger.log(':onMounted')
      state.item = JSON.parse(JSON.stringify(props.item))
    })
    onBeforeUnmount(() => {
      logger.log(':onBeforeUnmount')
    })

    return {
      state,
      itemUpdate,
      itemDelete,
      tryItemClose,
      fieldUpdated,
      handleUpdate,
      handleDelete,
    }
  }
})
</script>
