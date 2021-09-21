<style lang="scss" scoped>
pre {
  font-size: 12px;
  padding: 8px;
}
</style>

<template lang="pug">
.row.full-width.bg-grey
  pre {{value}}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldFiles',
  props: {
    value: { type: Object }
  },
  setup () {
    return {
    }
  }
})
</script>
