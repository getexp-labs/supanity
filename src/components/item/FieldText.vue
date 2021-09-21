<style lang="scss" scoped>
</style>

<template lang="pug">
q-input(
  dense filled hide-bottom-space
  :label="label"
  v-model="value"
  ).full-width.text-black
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldText',
  props: {
    value: { type: String },
    label: { type: String }
  },
  setup () {
    return {
    }
  }
})
</script>
