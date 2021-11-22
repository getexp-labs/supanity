<style lang="scss" scoped>
.item-editor {
  min-width: 800px;
}
</style>

<template lang="pug">
.item-editor.column.fit.bg-white
  //- headeer
  .row.full-width.items-start.content-start.justify-between.q-pa-sm
    h4.q-ma-xs {{state.itemTitle}}
    q-btn(flat dense color="grey-7" icon="clear")
  //- body
  .col.full-width.scroll
    .row.full-width.items-start.content-start
      div(
        v-for="(t,tkey) in state.itemProperties" :key="tkey"
        ).row.full-width.q-pa-md
        //- small {{tkey}}
        //- small {{t}}
        q-input(
          v-if="t.input === 'text'"
          v-model="state.item[t.key]"
          dense color="black"
          :label="t.name").full-width
        q-input(
          v-else-if="t.input === 'id'"
          v-model="state.item[t.key]"
          dense color="black" readonly
          :label="t.name").full-width
        q-input(
          v-else-if="t.input === 'type'"
          v-model="state.item[t.key]"
          dense color="black" readonly
          :label="t.name").full-width
        q-input(
          v-else-if="t.input === 'date'"
          v-model="state.item[t.key]"
          :readonly="props.config.typePropertiesLocked.includes(t.key)").full-width
          template(v-slot:prepend)
            q-icon(name="event" class="cursor-pointer")
              q-popup-proxy(cover transition-show="scale" transition-hide="scale")
                q-date(v-model="state.item[t.key]" mask="YYYY-MM-DD HH:mm")
                  div(class="row items-center justify-end")
                    q-btn(v-close-popup label="Close" color="primary" flat)
          template(v-slot:append)
            q-icon( name="access_time" class="cursor-pointer")
              q-popup-proxy( cover transition-show="scale" transition-hide="scale")
                q-time( v-model="state.item[t.key]" mask="YYYY-MM-DD HH:mm" format24h)
                  div( class="row items-center justify-end")
                    q-btn( v-close-popup label="Close" color="primary" flat)
        q-checkbox(
          v-else-if="t.input === 'checkbox'"
          v-model="state.item[t.key]"
          dense color="black"
          :label="t.name"
          ).full-width
        div(
          v-else-if="t.input === 'ref'"
          ).row.full-width
          .row.full-width.items-center.content-center
            span {{t.name}}
            q-btn(flat dense color="grey-7" icon="edit")
          small {{state.item[t.key]}}
</template>

<script setup>
const logger = inject('logger')('ItemEditor')

const emit = defineEmits(['close'])
const props = defineProps({
  config: { type: Object },
  type: { type: Object },
  item: { type: Object }
})

const state = reactive({
  item: {},
  itemProperties: computed(() => {
    const p = { ...props.config.typePropertiesDefault, ...props.type.properties }
    return Object.entries(p).reduce((acc, [key, val]) => {
      if (props.config.typePropertiesLocked.includes(key)) {
        val.key = key
      }
      else {
        const k = val.name.toLowerCase().replace(/ /g, '_')
        val.key = k
      }
      acc[key] = val
      return acc
    }, {})
  }),
  itemTitle: computed(() => {
    const l = props.type.meta.propertyLabel
    const p = props.type.properties[l]
    const k = p.name.toLowerCase().replace(/ /g, '_')
    return state.item[k]
  })
})

onMounted(() => {
  logger.log(':onMounted')
  if (props.item) {
    state.item = JSON.parse(JSON.stringify(props.item))
  }
})
</script>
