<style lang="scss" scoped>
</style>

<template lang="pug">
q-dialog(ref="dialogRef" @hide="onDialogHide")
  q-card(style="max-width: 80vw; width: 700px;")
    q-card-section.text-h6 {{ title }}
    q-card-section
      q-expansion-item(
        v-for="item in state.selectedItems"
        expand-icon-toggle
        dense-toggle
        icon="link"
        group="selectedValues"
        style="border-radius: 10px; flex: 1;"
      ).full-width.bg-grey-2.q-mb-lg
        template(v-slot:header)
          q-item-section {{ labelKeys.map(labelKey => item[labelKey]).join(', ') }}
          q-item-section(side)
            .row.items-right
              q-btn(v-if="state.selectedItems.length > 1 || !required" flat color="black" text-color="red" icon="delete" @click="handleDelete(item)")
        q-card(style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;").bg-grey-2
          q-card-section
            div(v-for="(propertyDefinition,property) in definition.properties")
              strong {{ property }}
              span : {{ rowFormating(propertyDefinition.format)(item[property]) }}
    q-card-section.column.q-mx-lg
      ItemSearchList(
        :definition="definition"
        :tableId="tableId"
        canSelect
        :labelKeys="labelKeys"
        :hasLabel="!!props.definition?.meta?.labelColumn"
        :selectedItems="state.selectedItems"
        @select="handleItemSelect"
      )
    q-card-actions(align="right")
      q-btn(color="primary" label="Cancel" @click="onDialogCancel")
      q-btn(color="primary" label="OK" :disabled="required && !state.selectedItems.length" @click="handleSave")
</template>

<script setup>
import { computed } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { getPrimaryKeyMapping, rowFormating } from 'src/helpers/supabase.helper'
import ItemSearchList from './ItemSearchList.vue'

const props = defineProps({
  definition: { type: Object, required: true },
  tableId: { type: String, required: true },
  title: { type: String, required: true },
  required: { type: Boolean, default: false },
  modelValue: { type: Object }
})
let initialItems = []
if (props.modelValue) {
  initialItems = props.modelValue instanceof Array ? props.modelValue : [props.modelValue]
}
const state = reactive({
  selectedItems: initialItems
})

// eslint-disable-next-line
defineEmits(['update:modelValue', ...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const labelKeys = computed(() => props.definition?.meta?.labelColumn
  ? [props.definition?.meta?.labelColumn]
  : Object.keys(getPrimaryKeyMapping(props.definition.properties, {}))
)

const handleSave = () => {
  onDialogOK({ value: props.modelValue instanceof Array ? state.selectedItems : state.selectedItems[0] })
}

const handleDelete = (item) => {
  state.selectedItems = state.selectedItems.filter(modelItem => modelItem !== item)
}

const handleItemSelect = (item) => {
  state.selectedItems = props.modelValue instanceof Array ? [...state.selectedItems, item] : [item]
}

</script>
