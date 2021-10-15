<style lang="scss" scoped>
</style>

<template lang="pug">
q-input(
  dense filled hide-bottom-space
  :modelValue="props.modelValue"
  :readonly="props.disabled"
  @update:modelValue="emit('update:modelValue', $event)").full-width.text-black
</template>

<script setup>

const props = defineProps({
  modelValue: { type: [Number, String] },
  disabled: { type: Boolean }
})

const emit = defineEmits(['update:modelValue'])
</script>
