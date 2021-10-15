<style lang="scss" scoped>
.q-img {
  .q-img__content > div {
    background-color: transparent;
  }
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
  q-input(style="display: none;" ref="addFilePicker" type="file" @update:modelValue="saveFile" accept="image/*")
  q-img(v-if="modelValue" :src="modelValue" :alt="label" :height="height" fit="contain" loading="eager")
    div(v-if="!disabled").absolute-top.q-pa-sm.full-width.text-center.img-toolbar
      q-btn(round color="black" icon="edit" padding="xs" @click="handleAddClick").q-mr-sm
      q-btn(v-if="!required" round color="black" text-color="red" icon="delete" padding="xs" @click="handleDelete")
  div(v-else-if="!disabled").text-center.full-width
    q-btn(round color="black" icon="add" padding="xs" @click="handleAddClick")
  div(v-else)
    pre Value is empty and can not be updated
</template>

<script setup>
import { ref, inject } from 'vue'

const logger = inject('logger')('FieldImage')

const props = defineProps({
  label: { type: String },
  modelValue: { type: String },
  height: { type: String },
  required: { type: Boolean },
  disabled: { type: Boolean },
  multiple: { type: Boolean }
})

const emit = defineEmits(['update:modelValue'])
const handleDelete = () => {
  emit('update:modelValue', null)
  logger.log(':deleted')
}
const saveFile = (files) => {
  if (files.length) {
    const fr = new FileReader()
    fr.onload = function () {
      emit('update:modelValue', fr.result)
      logger.log(':added', files[0].name)
    }
    fr.readAsDataURL(files[0])
  }
}
const handleAddClick = () => {
  addFilePicker.value.$el.click()
}
const addFilePicker = ref(null)
</script>
