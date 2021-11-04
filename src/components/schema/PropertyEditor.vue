<style lang="scss" scoped>
</style>

<template lang="pug">
.column.full-width.window-height.bg-white
  div(style="height: 50px;").row.full-width.items-center.content-center.q-px-md.bg-primary
    span(style="font-size: 18px").text-bold.text-white {{ pkey }}
  .col.full-width.scroll
    .row.full-width.items-start.content-start.q-pa-md
      span.text-bold {{propertyPath}}
      div(v-html="property.description").row.full-width
      pre(style="font-size: 12px; line-height: 0.8; border-radius: 4px;").full-width.bg-grey-3.q-pa-sm {{property}}
      span(
        v-if="property.meta"
        ) Property meta
      pre(
        v-if="property.meta"
        style="font-size: 12px; line-height: 0.8; border-radius: 4px;").full-width.bg-grey-3.q-pa-sm {{property.meta}}
      .row.full-width.q-py-sm
        q-btn(icon="add" outline no-caps color="primary").full-width Add meta
  .row.full-width
</template>

<script setup>
const logger = inject('logger')('PropertyEditor')
const props = defineProps({
  dkey: { type: String, required: true },
  definition: { type: Object, required: true },
  pkey: { type: String, required: true },
  property: { type: Object, required: true }
})

const propertyPath = computed(() => {
  return `definitions.${props.dkey}.properties.${props.pkey}`
})
</script>
