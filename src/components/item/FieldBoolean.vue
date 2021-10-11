<style lang="scss" scoped>
</style>

<template lang="pug">
q-checkbox(
  :label="label"
  :modelValue="modelValue"
  @update:modelValue="$emit('update:modelValue', $event)"
  ).full-width
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldBoolean',
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: Boolean },
    label: { type: String }
  },
})
</script>
