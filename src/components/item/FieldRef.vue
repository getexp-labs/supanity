<style lang="scss">
.q-item__section--side {
  // display: none;
  max-width: 40px !important;
  // padding-right: -16px !important;
}
</style>

<template lang="pug">
div(:style="{borderRadius: '4px 4px 0px 0px'}").row.full-width.items-start.content-start.bg-grey-3
  //- title
  .row.full-width.q-pa-sm
    small(style="line-height: 1;").text-grey-7 {{props.definition?.meta?.label || fieldKey}}
  div(v-if="modelValue").row.full-width.items-start.content-start
    .col
      q-expansion-item(
        v-model="expanded"
        dense-toggle
        icon="link"
        filled
        expand-icon="keyboard_arrow_down"
        style=""
        :label="labelValue"
        :style="{maxWidth: '100%'}"
        ).full-width
        template(v-slot:header)
          .row.full-width.q-py-sm
            q-icon(name="link" size="sm").q-mr-md
            span.text-bold {{labelValue}}
        //- Card of the opened item
        div(style="max-width: 100%; overflow: scroll; max-height: 300px;").row.full-width.q-pa-sm
          div(v-for="(propertyDefinition,property) in foreignProperties").row.full-width
            strong.full-width {{property}}
            small(style="") {{rowFormating(propertyDefinition.format)(modelValue[property])}}
    //- Actions
    .row.q-pa-sm
      q-btn(v-if="!disabled" round flat dense color="black" icon="edit" @click="handleUpsertClick").q-float-right
      q-btn(v-if="!required && !disabled" round flat dense color="black" text-color="red" icon="delete" @click="handleDelete").q-float-right
  //- empty and can be update
  div(
    v-else-if="!disabled"
    ).row.full-width.full-width.q-pa-sm
      q-btn(flat dense no-caps color="black" icon="add" @click="handleUpsertClick").q-ml-xs
        span.q-ml-md.text-bold Add connection
  //- empty and disabled
  div(
    v-else
    ).row.full-width.q-pa-sm
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
  // label: { type: String },
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
