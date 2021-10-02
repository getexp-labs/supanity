<template lang="pug">
.row.full-width
  FieldRefEditor(
    v-bind="propsDefault"
  )
</template>

<script setup>
import FieldRefEditor from 'src/components/item/FieldRefEditor.vue'
import { computed, reactive } from 'vue'
const propsDefault = reactive({
  definition: {

  },
  value: [
    { id: '1', name: 'Red' },
    { id: '2', name: 'Green' },
    { id: '3', name: 'Blue' },
    { id: '4', name: 'Red 4' },
    { id: '5', name: 'Red 5' },
    { id: '6', name: 'Red' },
    { id: '7', name: 'Green' },
    { id: '8', name: 'Blue' },
    { id: '9', name: 'Red 4' },
    { id: '10', name: 'Red 5' },
    { id: '11', name: 'Red' },
    { id: '12', name: 'Green' },
    { id: '13', name: 'Blue' },
    { id: '14', name: 'Red 4' },
    { id: '15', name: 'Red 5' }
  ]
})
</script>
