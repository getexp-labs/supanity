<style lang="scss" scoped>
.divider {
  width: 2px;
  height: 1.25rem;
  background-color: rgba(#000, 0.1);
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}
</style>

<template lang="pug">
div
  template(v-for="(item, index) in items")
    .divider(v-if="item.type === 'divider'" :key="`divider${index}`")
    menu-item(v-else :key="index" v-bind="item")
</template>

<script setup>
import MenuItem from './HtmlMenuItem.vue'

const props = defineProps({
  editor: { type: Object, required: true },
})

const toggleTextAlign = (align) =>
  props.editor.isActive({ textAlign: align })
    ? props.editor.chain().focus().unsetTextAlign().run()
    : props.editor.chain().focus().setTextAlign(align).run()

const items = [
  {
    icon: 'bold',
    title: 'Bold',
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold'),
  },
  {
    icon: 'italic',
    title: 'Italic',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic'),
  },
  {
    icon: 'strikethrough',
    title: 'Strike',
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike'),
  },
  {
    icon: 'underline',
    title: 'Underline',
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive('underline'),
  },
  {
    icon: 'code-view',
    title: 'Code',
    action: () => props.editor.chain().focus().toggleCode().run(),
    isActive: () => props.editor.isActive('code'),
  },
  // TODO: add color pickers for these
  // {
  //   icon: 'font-color',
  //   title: 'Text color',
  //   action: () => props.editor.chain().focus().setColor('#FAF594').run(),
  //   isActive: () => props.editor.isActive('textStyle', { color: '#FBBC88' }),
  // },
  // {
  //   icon: 'paint-fill',
  //   title: 'Background color',
  //   action: () => props.editor.chain().focus().setColor('#FAF594').run(),
  //   isActive: () => props.editor.isActive('textStyle', { color: '#FBBC88' }),
  // },
  {
    type: 'divider',
  },
  {
    icon: 'h-2',
    title: 'Heading 2',
    action: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => props.editor.isActive('heading', { level: 2 }),
  },
  {
    icon: 'h-3',
    title: 'Heading 3',
    action: () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => props.editor.isActive('heading', { level: 3 }),
  },
  {
    icon: 'paragraph',
    title: 'Paragraph',
    action: () => props.editor.chain().focus().setParagraph().run(),
    isActive: () => props.editor.isActive('paragraph'),
  },
  {
    icon: 'list-unordered',
    title: 'Bullet List',
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive('bulletList'),
  },
  {
    icon: 'list-ordered',
    title: 'Ordered List',
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive('orderedList'),
  },
  {
    type: 'divider',
  },
  {
    icon: 'align-left',
    title: 'Align left',
    action: () => toggleTextAlign('left'),
    isActive: () => props.editor.isActive({ textAlign: 'left' }),
  },
  {
    icon: 'align-center',
    title: 'Center',
    action: () => toggleTextAlign('center'),
    isActive: () => props.editor.isActive({ textAlign: 'center' }),
  },
  {
    icon: 'align-right',
    title: 'Align right',
    action: () => toggleTextAlign('right'),
    isActive: () => props.editor.isActive({ textAlign: 'right' }),
  },
  {
    icon: 'align-justify',
    title: 'Justify',
    action: () => toggleTextAlign('justify'),
    isActive: () => props.editor.isActive({ textAlign: 'justify' }),
  },
  {
    type: 'divider',
  },
  {
    icon: 'double-quotes-l',
    title: 'Blockquote',
    action: () => props.editor.chain().focus().toggleBlockquote().run(),
    isActive: () => props.editor.isActive('blockquote'),
  },
  {
    icon: 'separator',
    title: 'Horizontal Rule',
    action: () => props.editor.chain().focus().setHorizontalRule().run(),
  },
  {
    type: 'divider',
  },
  {
    icon: 'text-wrap',
    title: 'Hard Break',
    action: () => props.editor.chain().focus().setHardBreak().run(),
  },
  {
    icon: 'format-clear',
    title: 'Clear Format',
    action: () => props.editor.chain()
      .focus()
      .clearNodes()
      .unsetAllMarks()
      .run(),
  },
  {
    type: 'divider',
  },
  {
    icon: 'arrow-go-back-line',
    title: 'Undo',
    action: () => props.editor.chain().focus().undo().run(),
  },
  {
    icon: 'arrow-go-forward-line',
    title: 'Redo',
    action: () => props.editor.chain().focus().redo().run(),
  },
]
</script>
