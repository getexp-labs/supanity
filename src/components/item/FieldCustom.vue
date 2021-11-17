<style lang="scss" scoped>
</style>

<template lang="pug">
component(
  :is="fieldCustom.component"
  :definition="definition"
  :modelValue="modelValue"
  :fieldKey="fieldKey"
  :fieldCustom="fieldCustom"
  :item="item")
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean },
  label: { type: String },
  definition: { type: Object },
  fieldKey: { type: String },
  fieldCustom: { type: Object },
  item: { type: Object },
})

const emit = defineEmits(['update:modelValue'])

</script>
