<style lang="scss" scoped>
</style>

<template lang="pug">
.row.full-width
  .row.full-width
    span {{title}}
  //- images previews
  .row.full-width.justify-start.items-start.content-start.q-py-sm
    div(
      v-for="(i,ii) in files" :key="ii"
      @click="open"
      ).row
      img(
        draggable="false"
        :src="i.url"
        :style="{height: '50px', borderRadius: '4px'}")
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import SupaFilesEditor from './SupaFilesEditor.vue'

const $q = useQuasar()

const props = defineProps({
  title: { type: String },
  file: { type: Object, required: true }
})
const files = computed(() => {
  if (props.file && props.file.type === 'file') {
    return props.file.data.map(f => {
      const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
      return {
        url: `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/public/files/${props.file.id}/${f.filename}`,
        type: f.type,
        base_color: f.base_color,
        filename: f.filename
      }
    })
  } else {
    return []
  }
})
const open = () => {
  console.log('open')
  $q.dialog({
    component: SupaFilesEditor,
    componentProps: {
      file: props.file,
    }
  })
}
</script>
