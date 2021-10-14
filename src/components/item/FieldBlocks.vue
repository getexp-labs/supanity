<style lang="scss">
.ProseMirror {
  min-height: 400px;
  width: 100%;
  padding: 8px;
}

</style>
<style lang="scss" scoped>
</style>

<template lang="pug">
.row.full-width.q-py-xs
  span {{fieldKey}}
div(
  style="border: 1px solid #eee; border-radius: 4px"
  ).row.full-width
  EditorContent(
    :editor="editor"
    :style="{minHeight: '400px'}").full-width
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const logger = inject('logger')('FieldBlocks')
const props = defineProps({
  fieldKey: { type: String },
  value: { type: [Object] },
})

const editor = useEditor({
  content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
  extensions: [
    StarterKit,
  ],
})

onMounted(() => {
  logger.log(':onMoutned')
})
onBeforeUnmount(() => {
  logger.log(':onBeforeUnmount')
})
</script>
