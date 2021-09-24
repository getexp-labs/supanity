<style lang="scss" scoped>
</style>

<template lang="pug">
q-input(
  dense filled hide-bottom-space
  v-model="value").full-width.text-black
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldNumber',
  props: {
    value: { type: [Number, String] }
  },
  setup () {
    return {
    }
  }
})
</script>
