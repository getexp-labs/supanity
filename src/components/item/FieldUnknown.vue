<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  :style="{borderRadius: '4px 4px 0px 0px'}"
  ).row.full-width.q-pa-sm.bg-grey-3.br
  .row.full-width
    small(style="line-height: 1;").text-grey-7 {{label}}
  small {{value}}
</template>

<script setup>
const logger = inject('logger')('FieldUnknowns')
const props = defineProps({
  value: { type: [String, Array] },
  label: { type: String }
})
</script>
