<style lang="scss" scoped>
</style>

<template lang="pug">
q-checkbox(
  :label="props.label"
  :modelValue="props.modelValue"
  :disable="props.disabled"
  @update:modelValue="emit('update:modelValue', $event)"
  ).full-width
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Boolean },
  disabled: { type: Boolean },
  label: { type: String },
})

const emit = defineEmits(['update:modelValue'])

</script>
