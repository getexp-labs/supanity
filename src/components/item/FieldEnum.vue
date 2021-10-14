<style lang="scss" scoped>
</style>

<template lang="pug">
q-select(
  :label="label"
  :options="enum"
  :modelValue="modelValue"
  @update:modelValue="$emit('update:modelValue', $event)"
  ).full-width
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldEnum',
  emits: ['update:modelValue'],
  props: {
    enum: { type: Array },
    modelValue: { type: String },
    label: { type: String }
  },
})
</script>
