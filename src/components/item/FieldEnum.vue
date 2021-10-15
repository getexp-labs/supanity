<style lang="scss" scoped>
</style>

<template lang="pug">
q-select(
  :label="props.label"
  :options="props.enum"
  :readonly="props.disabled"
  :modelValue="props.modelValue"
  @update:modelValue="emit('update:modelValue', $event)"
  ).full-width
</template>

<script setup>

const props = defineProps({
  enum: { type: Array },
  modelValue: { type: String },
  disabled: { type: Boolean },
  label: { type: String }
})

const emit = defineEmits(['update:modelValue'])

</script>
