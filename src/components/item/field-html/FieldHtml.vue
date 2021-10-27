<style lang="scss">
.ProseMirror {
  min-height: 200px;
  max-height: 300px;
  width: 100%;
  padding: 8px;
  overflow-y: scroll;
  outline-style: none;
  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.2);
  }
}
</style>
<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  max-height: 26rem;
  color: #0D0D0D;
  background-color: #FFF;
  border: 1px solid #eee;
  border-radius: 4px;

  &-header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 1px solid #eee;
  }

  &-content {
    padding: 1.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>

<template lang="pug">
.row.full-width.q-py-xs
  span {{ fieldKey }}
div(v-if="editor").row.full-width.editor
  menu-bar.editor-header(:editor="editor")
  editor-content.editor-content.full-width(
    :editor="editor"
    :editable="!props.disabled"
  )
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import MenuBar from './HtmlMenuBar.vue'

const logger = inject('logger')('FieldBlocks')

const props = defineProps({
  fieldKey: { type: String },
  modelValue: { type: [String] },
  disabled: { type: Boolean },
  required: { type: Boolean, default: false },
  definition: { type: Object, required: true },
  label: { type: String }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextStyle,
    Underline,
    Color.configure({
      types: ['textStyle'],
    }),
    Placeholder.configure({
      placeholder: `Please enter ${props.label}...`,
      emptyEditorClass: 'is-editor-empty',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
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
