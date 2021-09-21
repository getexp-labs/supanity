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
      ).row
      img(
        draggable="false"
        :src="i.url"
        :style="{height: '50px', borderRadius: '4px'}")
</template>

<script setup>
import { computed } from 'vue'
import { useStoreMain } from 'src/stores/main'

const storeMain = useStoreMain()

const props = defineProps({
  title: { type: String },
  file: { type: Object, required: true }
})
const files = computed(() => {
  if (props.file && props.file.type === 'file') {
    return props.file.data.map(f => {
      return {
        url: `${process.env.VUE_APP_SUPABASE_STORAGE_URL}/storage/v1/object/public/public/files/${props.file.id}/${f.filename}`,
        // url2: 'https://tutoudzncttbsezeimjo.supabase.in/storage/v1/object/public/public/files/4716ead5-350f-4aec-ae69-2f9e361b62c4/file.jpg',
        type: f.type,
        base_color: f.base_color,
        filename: f.filename
      }
    })
  } else {
    return []
  }
})
</script>
