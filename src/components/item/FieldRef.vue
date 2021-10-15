<style lang="scss" scoped>
</style>

<template lang="pug">
.row.full-width
  span {{label}}
div(v-if="modelValue").row.full-width.bg-grey-2
  q-expansion-item(
    expand-icon-toggle
    v-model="expanded"
    dense-toggle
    icon="link"
    style="border-radius: 10px; flex: 1;"
    :label="labelValue"
  )
    q-card(style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;").bg-grey-2
      q-card-section
        div(v-for="(propertyDefinition,property) in foreignProperties")
          strong {{property}}
          span : {{rowFormating(propertyDefinition.format)(modelValue[property])}}
  q-btn(v-if="!disabled" flat color="black" icon="edit" @click="handleUpsertClick").q-float-right
  q-btn(v-if="!required && !disabled" flat color="black" text-color="red" icon="delete" @click="handleDelete").q-float-right
div(v-else-if="!disabled").text-center.full-width
    q-btn(round color="black" icon="add" padding="xs" @click="handleUpsertClick")
div(v-else)
  pre Value is empty and can not be updated
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import useSWRV from 'swrv'
import { getForeignKeyTable, rowFormating, getPrimaryKeyMapping } from 'src/helpers/supabase.helper'
import FieldRefDialog from './FieldRefDialog.vue'

const props = defineProps({
  modelValue: { type: [Object, String, null] },
  label: { type: String },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean },
  definition: { type: Object, required: true },
  fieldKey: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()

const logger = inject('logger')('FieldRef')

const { data: schema } = useSWRV('/schema', null)
const foreignTable = getForeignKeyTable(props.definition)
const foreignTableDefinition = schema.value.definitions[foreignTable]
const labelColumn = foreignTableDefinition?.meta?.labelColumn
const foreignProperties = foreignTableDefinition?.properties
const labelValue = computed(() => {
  if (!props.modelValue) return undefined
  return labelColumn ? props.modelValue[labelColumn] : Object.values(getPrimaryKeyMapping(foreignProperties, props.modelValue)).join(', ')
})

const handleUpsertClick = () => {
  logger.log(':edit start')
  $q.dialog({
    component: FieldRefDialog,
    componentProps: {
      definition: foreignTableDefinition,
      tableId: foreignTable,
      required: props.required,
      modelValue: props.modelValue,
      title: props.label,
      // '@update:modelValue': (val) => emit('update:modelValue', val),
    },
  }).onOk((payload) => {
    logger.log('>>>> OK: ', payload.value)
    emit('update:modelValue', payload.value)
  }).onCancel(() => {
    logger.log('>>>> Cancel')
  }).onDismiss(() => {
    logger.log('I am triggered on both OK and Cancel')
  })
}

const handleDelete = () => {
  logger.log(':delete start')
  emit('update:modelValue', null)
  logger.log(':delete end')
}

const expanded = ref(false)
</script>
