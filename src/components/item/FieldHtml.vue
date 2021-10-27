<style lang="scss">
.ProseMirror {
  min-height: 200px;
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
    :style="{minHeight: '200px', maxHeight: '300px'}").full-width
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const logger = inject('logger')('FieldBlocks')

const props = defineProps({
  fieldKey: { type: String },
  modelValue: { type: [String], default: '' },
  disabled: { type: Boolean },
  required: { type: Boolean, default: false },
  definition: { type: Object, required: true },
  label: { type: String }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure(),
    Strike
  ],
  onUpdate: () => {
    emit('update:modelValue', unref(editor).getHTML())
  },
})

watch(() => props.modelValue, (currentVal) => {
  const isSame = unref(editor).getHTML() === currentVal
  if (isSame) return
  unref(editor).commands.setContent(currentVal, false)
})

onMounted(() => {
  logger.log(':onMoutned')
})
onBeforeUnmount(() => {
  logger.log(':onBeforeUnmount')
})
</script>
