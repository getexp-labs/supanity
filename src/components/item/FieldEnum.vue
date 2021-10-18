<style lang="scss" scoped>
</style>

<template lang="pug">
q-select(
  options-selected-class="bg-grey-3"
  :label="props.label"
  :options="props.enum"
  :readonly="props.disabled"
  :multiple="props.multiple"
  :modelValue="props.modelValue"
  :clearable="!props.required"
  @update:modelValue="emit('update:modelValue', $event)"
  ).full-width
</template>

<script setup>

const props = defineProps({
  enum: { type: Array },
  modelValue: { type: [String, Array] },
  disabled: { type: Boolean },
  required: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  label: { type: String }
})

const emit = defineEmits(['update:modelValue'])

</script>
