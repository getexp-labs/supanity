<style lang="scss" scoped>
</style>

<template lang="pug">
component(
  :is="component"
  :definition="definition"
  :modelValue="modelValue"
  :fieldKey="fieldKey"
  :item="item")
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Object },
  label: { type: String },
  definition: { type: Object },
  fieldKey: { type: String },
  item: { type: Object },
})

const component = computed(() => {
  const supanityExtension = window.supanityExtension
  return supanityExtension.components[props.definition.meta.component]
})
</script>
