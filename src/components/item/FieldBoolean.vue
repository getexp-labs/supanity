<style lang="scss" scoped>
</style>

<template lang="pug">
q-checkbox(
  :label="label"
  :model-value="value"
  @update:model-value="$emit('update', $event)"
  ).full-width
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldBoolean',
  emits: ['update'],
  props: {
    value: { type: Boolean },
    label: { type: String }
  },
  setup () {
    return {
    }
  }
})
</script>
