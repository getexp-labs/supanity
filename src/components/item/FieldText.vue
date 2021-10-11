<style lang="scss" scoped>
</style>

<template lang="pug">
q-input(
  dense filled hide-bottom-space
  :label="label"
  :modelValue="modelValue"
  @update:modelValue="emit('update:modelValue', $event)"
  ).full-width.text-black
</template>

<script setup>

const props = defineProps({
  modelValue: { type: String },
  label: { type: String }
})

const emit = defineEmits(['update:modelValue'])

</script>
