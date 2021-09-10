<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  v-if="state.item"
  ).column.full-width.window-height.bg-white
  div(style="height: 50px;").row.full-width.items-center.content-center.q-px-md.bg-primary
    span(style="font-size: 18px").text-bold.text-white {{ state.item.title }}
  .col.full-width.scroll
    .row.full-width.items-start.content-start.q-px-md
      div(
        v-for="(p,pkey) in definition.properties" :key="pkey"
        ).row.full-width.q-mb-sm
        .row.full-width.q-px-sm
          span {{pkey}}
        q-input(
          dense filled hide-bottom-space
          v-model="state.item[pkey]").full-width.text-black
  //- actions
  .row.full-width.q-px-md.q-py-sm
    q-btn(dense no-caps color="primary").q-px-sm.q-mr-sm Update
    q-btn(dense no-caps outline color="red").q-px-sm Delete
</template>

<script>
import { defineComponent, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ItemEditor',
  props: ['item', 'definition'],
  emits: ['item-changed', 'close'],
  setup (props, ctx) {
    const $q = useQuasar()

    const state = reactive({
      item: null,
      ready: false,
      updating: false,
      deleting: false,
      changed: false
    })

    const itemUpdate = () => {
      console.log('[ItemEditor] itemUpdate')
      state.changed = false
    }
    const itemDelete = () => {
      console.log('[ItemEditor] itemDelete')
    }

    watch(
      () => state.item,
      (to, from) => {
        console.log('[ItemEditor] W state.item', to, from)
        if (to && from) {
          state.changed = true
          ctx.emit('item-changed')
        }
      },
      { deep: true })

    const tryItemClose = () => {
      console.log('[ItemEditor] tryItemClose')
      if (state.changed) {
        // dialog with save changed or discard?
        $q.dialog({
          title: 'Save changes?',
          message: '',
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          itemUpdate()
          ctx.emit('close')
        }).onCancel(() => {
          console.log('>>>> Cancel')
          ctx.emit('close')
        }).onDismiss(() => {
          console.log('I am triggered on both OK and Cancel')
          ctx.emit('close')
        })
      }
    }

    onMounted(() => {
      console.log('[ItemEditor] onMounted')
      state.item = JSON.parse(JSON.stringify(props.item))
    })
    onBeforeUnmount(() => {
      console.log('[ItemEditor] onBeforeUnmount')
    })

    return {
      state,
      itemUpdate,
      itemDelete,
      tryItemClose
    }
  }
})
</script>
