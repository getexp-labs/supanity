<style lang="scss" scoped>
pre {
  font-size: 12px;
  padding: 8px;
  margin: 0;
}
</style>

<template lang="pug">
SupaFiles(
  v-if="value?.type === 'file'"
  :title="label"
  :file="value")
div(
  v-else
  ).row.full-width
  .row.full-width
    span {{label}}
  div(
    :style="{maxHeight: '100px', overflow: 'scroll', borderRadius: '4px'}"
    ).row.full-width.bg-grey-3
    pre {{value}}
</template>

<script lang="js">
import { defineComponent } from 'vue'
import SupaFiles from 'components/base/SupaFiles.vue'

export default defineComponent({
  name: 'FieldFiles',
  components: {
    SupaFiles
  },
  props: {
    value: { type: Object, required: true },
    label: { type: String },
    definition: { type: Object, required: true },
    fieldKey: { type: Object, required: true },
  },
  setup () {
    return {
    }
  }
})
</script>
