<style lang="scss" scoped>
</style>

<template lang="pug">
div(:style=`{borderRadius: '4px'}`).row.full-width.bg-grey-3.q-pa-sm.cursor-pointer
  small {{ value }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FieldId',
  props: {
    value: { type: String }
  },
  setup () {
    return {
    }
  }
})
</script>
