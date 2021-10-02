<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  :style="{width: '180px', borderRadius: '4px', border: property.meta ? '0.1px solid black' : ''}"
  ).row.q-mr-xs.q-mt-xs.bg-white.q-pa-xs.cursor-pointer
  .row.full-width.justify-between.items-center.content-center
    //- required asterisk
    span {{ pkey }} {{ definition.required.includes(pkey) ? '*' : '' }}
    //- meta label
    small(
      v-if="property.meta"
      style="line-height: 1.5;padding:0 4px;margin: 0;border-radius: 4px;"
      ).bg-primary.text-white {{property.meta.type}}
  .row.full-width.justify-between
    small(style="color: rgb(128, 128, 128); line-height: 1;") {{property.type}}
    small(style="color: rgb(128, 128, 128); line-height: 1; max-width: 80px; overflow: hidden; white-space: nowrap") {{property.format}}
</template>

<script setup>
const logger = inject('logger')('PropertyRowCell')
const props = defineProps({
  dkey: { type: String, required: true },
  definition: { type: Object, required: true },
  pkey: { type: String, required: true },
  property: { type: Object, required: true }
})

</script>
