<style lang="scss" scoped>
</style>

<template lang="pug">
pre {{ value }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldJSONB',
  props: {
    value: { type: [String, Object] }
  },
  setup () {
    return {
    }
  }
})
</script>
