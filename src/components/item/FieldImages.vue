<style lang="scss" scoped>
.q-carousel {
  .img-toolbar {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.4s linear;
  }
  &:hover .img-toolbar {
    display: block;
    visibility: visible;
    opacity: 0.8;
  }
}
</style>

<template lang="pug">
.row.full-width
  .row.full-width
    span {{label}}
  //- images previews
  q-input(style="display: none;" ref="addFilePicker" type="file" @update:modelValue="addFile")
  q-input(style="display: none;" ref="editFilePicker" type="file" @update:modelValue="replaceFile")
  q-carousel(v-if="modelValue && modelValue.length" animated v-model="slide" arrows navigation :height="height").full-width
    q-carousel-slide(v-for="(image, index) in modelValue" :key="image" :name="index" :img-src="image")
      div(v-if="!disabled").row.absolute-top.text-center.q-pa-sm.img-toolbar
        q-btn(round color="black" icon="add" padding="xs" @click="handleAddClick(index)").q-mr-sm
        q-btn(round color="black" icon="edit" padding="xs" @click="handleEditClick(index)").q-mr-sm
        q-btn(round color="black" text-color="red" icon="delete" padding="xs" @click="handleDelete(index)")
  div(v-else-if="!disabled").text-center.full-width
    q-btn(round color="black" icon="add" padding="xs" @click="handleAddClick")
  div(v-else)
    pre Value is empty and can not be updated
</template>

<script setup>

const props = defineProps({
  label: { type: String },
  height: { type: String },
  modelValue: { type: Array },
  multiple: { type: Boolean },
  disabled: { type: Boolean }
})
const logger = inject('logger')('FieldImages')
const emit = defineEmits(['update:modelValue'])
const handleDelete = (index) => {
  logger.log(':delete start')
  const newItems = props.modelValue.filter((_, currentIndex) => currentIndex !== index)
  emit('update:modelValue', newItems)
  logger.log(':delete finish')
}
const replaceFile = (files) => {
  if (files.length) {
    const index = itemIndex.value
    const fr = new FileReader()
    fr.onload = function () {
      const newItems = props.modelValue.map((val, currentIndex) => currentIndex !== index ? val : fr.result)
      emit('update:modelValue', newItems)
    }
    fr.readAsDataURL(files[0])
    logger.log(':replacing with file: ', files)
  }
}
const addFile = (files) => {
  if (files.length) {
    const index = itemIndex.value
    const fr = new FileReader()
    fr.onload = function () {
      const oldValues = props.modelValue || []
      const newItems = [...oldValues.slice(0, index), fr.result, ...oldValues.slice(index)]
      emit('update:modelValue', newItems)
      logger.log(':added file: ', files[0].name)
    }
    fr.readAsDataURL(files[0])
  }
}

const slide = ref(0)
const editFilePicker = ref(null)
const addFilePicker = ref(null)
const itemIndex = ref(0)

const handleEditClick = (index) => {
  itemIndex.value = index
  editFilePicker.value.$el.click()
}
const handleAddClick = (index) => {
  itemIndex.value = index
  addFilePicker.value.$el.click()
}
</script>
