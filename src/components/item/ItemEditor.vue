<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  v-if="state.item"
  ).column.full-width.window-height.bg-white
  q-form(@submit="handleSubmit")
    div(style="height: 50px;").row.full-width.items-center.content-center.q-px-md.bg-primary
      span(v-if="item && definition.meta && definition.meta.labelColumn" style="font-size: 18px").text-bold.text-white {{ state.item[definition.meta.labelColumn] }}
    q-banner(v-if="state.error").text-white.bg-red.text-center {{ state.error }}
    .col.full-width.scroll
      //- Default item editor with auto generated form from definition
      div.row.full-width.items-start.content-start.q-px-md.q-pt-md.q-mb-md
        div(
          v-for="(p,pkey) in definition.properties" :key="pkey"
          ).row.full-width.q-mb-sm
          FieldID(
            v-if="isPrimaryKey(p) && item && p.format === FORMATS.UUID && !isForeignKey(p)"
            :label="pkey"
            :value="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            )
          FieldEnum(
            v-else-if="p.enum"
            :enum="p.enum"
            :multiple="p.format === FORMATS.ARRAY"
            :label="pkey"
            v-model="state.item[pkey]"
            :required="definition.required?.includes(pkey)"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldImage(
            v-else-if="isImage(p)"
            :label="pkey"
            :required="definition.required?.includes(pkey)"
            height="300px"
            v-model="state.item[pkey]"
            :definition="p"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldImages(
            v-else-if="isImages(p)"
            height="300px"
            :label="pkey"
            v-model="state.item[pkey]"
            :definition="p"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldHtml(
            v-else-if="isHtml(p)"
            :label="pkey"
            v-model="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldText(
            v-else-if="p.format === FORMATS.TEXT || p.format === FORMATS.VARCHAR"
            :label="pkey"
            v-model="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldBoolean(
            v-else-if="p.format === FORMATS.BOOLEAN"
            :label="pkey"
            v-model="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldNumber(
            v-else-if="p.format === FORMATS.INTEGER"
            :label="pkey"
            v-model="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields?.includes(pkey)"
            )
          FieldRef(
            v-else-if="isForeignKey(p)"
            :label="pkey"
            v-model="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldJSONB(
            v-else-if="p.format === FORMATS.JSON"
            :label="pkey"
            :value="state.item[pkey]"
            :definition="p"
            :fieldKey="pkey"
            :disabled="!canEdit || disabledFields.includes(pkey)"
            )
          FieldUnknown(
            v-else
            :label="pkey"
            :value="state.item[pkey]"
            :fieldKey="pkey"
            )
    //- actions
    div(v-if="props.canEdit").row.full-width.q-px-md.q-py-sm
      q-btn(dense no-caps color="primary" type="submit" :loading="state.submitting").q-px-sm.q-mr-sm {{ item ? 'Update' : 'Create' }}
      q-btn(v-if="item" dense no-caps outline color="red" :loading="state.submitting" @click="handleDelete").q-px-sm Delete
</template>

<script setup>
import { supabase } from 'boot/api'
import { isPrimaryKey, isForeignKey, FORMATS, isImage, isImages, isHtml, getForeignKeyColumn, deleteFiles, uploadFile, uploadFiles, getPrimaryKeyMapping } from 'src/helpers/supabase.helper'
import { dataURLtoBlob } from 'src/helpers/file.helper'
import { areArraysEqual, diffArray } from 'src/helpers/array.helper'

import FieldID from './FieldID.vue'
import FieldText from './FieldText.vue'
import FieldBoolean from './FieldBoolean.vue'
import FieldNumber from './FieldNumber.vue'
import FieldRef from './FieldRef.vue'
import FieldJSONB from './FieldJSONB.vue'
import FieldEnum from './FieldEnum.vue'
import FieldImages from './FieldImages.vue'
import FieldImage from './FieldImage.vue'
import FieldHtml from './field-html/FieldHtml.vue'
import FieldUnknown from './FieldUnknown.vue'

const props = defineProps({
  tableId: { type: String, required: true },
  item: { type: Object },
  globalDisabledFields: { type: Array, default: () => [] },
  definition: { type: Object, required: true },
  canEdit: { type: Boolean, default: true }
})

const disabledFields = computed(() => props.definition.meta?.disabledFields || props.globalDisabledFields)

const emit = defineEmits(['item-changed', 'item-upserted'])

const logger = inject('logger')('ItemEditor')
const state = reactive({
  item: {},
  ready: !props.item,
  submitting: false,
  dirty: false,
  error: undefined,
  loading: !!props.item
})

watch(
  () => state.item,
  (to, from) => {
    logger.log(':W state.item')
    if (to && from && state.ready) {
      state.dirty = true
      emit('item-changed')
    } else if (!state.ready) {
      state.ready = true
    }
  },
  { deep: true })

const handleSubmit = async () => {
  logger.log('submitted')
  state.error = undefined
  state.submitting = true
  await (props.item ? handleUpdate() : handleCreate())
  state.submitting = false
}

const handleCreate = async () => {
  logger.log(':handleCreate start')
  try {
    const item = { ...state.item }
    const newImages = {}
    for (const [key, columnProps] of Object.entries(props.definition.properties)) {
      if (isForeignKey(columnProps) && item[key]) {
        item[key] = item[key][getForeignKeyColumn(columnProps)]
      } else if (isImage(columnProps) && item[key]) {
        newImages[key] = { data: [item[key]] }
        if (props.definition.required && props.definition.required.includes(key)) {
          // avoid non-null
          item[key] = 'TEMP_FILE_NAME'
        } else {
          delete item[key]
        }
      } else if (isImages(columnProps) && item[key]) {
        newImages[key] = { data: item[key] }
        if (props.definition.required && props.definition.required.includes(key)) {
          // avoid non-null
          item[key] = ['TEMP_FILE_NAME']
        } else {
          delete item[key]
        }
      }
    }
    const { data, error } = await supabase.from(props.tableId).insert(item).single()
    if (error || !data) {
      state.error = error ? error.message : 'Unexpected error, item was not inserted'
      return
    }
    const primaryKeys = getPrimaryKeyMapping(props.definition.properties, data)
    const itemIds = Object.values(primaryKeys)
    if (Object.keys(newImages).length) {
      for (const imgColumn in newImages) {
        const images = newImages[imgColumn].data.map(img => dataURLtoBlob(img))
        const newImageUrls = await uploadFiles(images, props.tableId, itemIds, imgColumn)
        newImages[imgColumn].publicUrls = newImageUrls
      }
      const { data: imageUpdateData, error: imageUpdateError } = await supabase
        .from(props.tableId)
        .update(
          Object
            .entries(newImages)
            .reduce(
              (result, [key, value]) => ({
                ...result,
                [key]: isImages(props.definition.properties[key]) ? value.publicUrls : value.publicUrls[0],
              }),
              {}
            )
        )
        .match(primaryKeys)
      if (imageUpdateError || !imageUpdateData) {
        state.error = error ? error.message : 'Images were not inserted'
        return
      }
    }
    emit('item-upserted', `Item ${itemIds.join(', ')} has been created successfully`)
    logger.log(':handleCreate done', data)
  }
  catch (e) {
    logger.log(':handleCreate e', e)
  }
}

const handleUpdate = async () => {
  logger.log(':handleUpdate start')
  try {
    const primaryKeys = getPrimaryKeyMapping(props.definition.properties, props.item)
    const itemIds = Object.values(primaryKeys)
    const item = Object.entries(state.item).reduce((result, [key, value]) =>
      primaryKeys[key] ? result : { ...result, [key]: value }
    , {})
    for (const [key, columnProps] of Object.entries(props.definition.properties)) {
      if (isForeignKey(columnProps) && item[key]) {
        item[key] = item[key][getForeignKeyColumn(columnProps)]
      } else if (isImage(columnProps) && props.item[key] !== item[key]) {
        if (props.item[key]) await deleteFiles([props.item[key]], props.tableId, itemIds, key)
        if (item[key]) {
          // new image should be in encoded in data string
          const blob = dataURLtoBlob(item[key])
          const fileName = await uploadFile(blob, props.tableId, itemIds, key)
          item[key] = fileName
        }
      } else if (isImages(columnProps) && !areArraysEqual(item[key], props.item[key])) {
        const deletedImages = diffArray(props.item[key] || [], item[key])
        await deleteFiles(deletedImages, props.tableId, itemIds, key)
        const newImages = item[key].reduce((result, value, index) => {
          // data url, new image
          if (value.startsWith('data:')) {
            return [...result, { index, value: dataURLtoBlob(value) }]
          }
          return result
        }, [])
        const newImageUrls = await uploadFiles(newImages.map(img => img.value), props.tableId, itemIds, key)
        item[key] = item[key].reduce((result, value, index) => {
          const newImgIndex = newImages.findIndex(img => img.index === index)
          if (newImgIndex >= 0) return [...result, newImageUrls[newImgIndex]]
          return [...result, value]
        }, [])
      }
    }
    const { data, error } = await supabase.from(props.tableId).update(item).match(primaryKeys)
    if (error) {
      state.error = error.message
    } else {
      emit('item-upserted', `Item ${itemIds.join(', ')} has been updated successfully`)
    }
    logger.log(':handleUpdate done', data)
  }
  catch (e) {
    logger.log(':handleUpdate e', e)
    state.error = e.toString()
  }
}

const handleDelete = async () => {
  state.error = undefined
  state.submitting = true
  logger.log(':handleDelete start')
  const primaryKeys = getPrimaryKeyMapping(props.definition.properties, props.item)
  const itemIds = Object.values(primaryKeys)
  for (const [key, columnProps] of Object.entries(props.definition.properties)) {
    if (isImage(columnProps) && props.item[key]) {
      await deleteFiles([props.item[key]], props.tableId, itemIds, key)
    } else if (isImages(columnProps) && props.item[key]) {
      await deleteFiles(props.item[key], props.tableId, itemIds, key)
    }
  }
  const { error } = await supabase.from(props.tableId).delete().match(primaryKeys)
  if (error) {
    state.error = error.message
  } else {
    logger.log(':handleDelete close')
    emit('item-upserted', `Item <strong>${itemIds.join(', ')}</strong> has been deleted successfully`)
  }
  state.submitting = false
}

onMounted(async () => {
  logger.log(':onMounted')
  if (!props.item) return
  let selectQuery = '*'
  Object
    .entries(props.definition.properties)
    .forEach(([key, val]) => {
      if (isForeignKey(val)) {
        selectQuery += `,${key}(*)`
      }
    })
  if (selectQuery.length > 1) {
    const primaryKeys = getPrimaryKeyMapping(props.definition.properties, props.item)
    const { data: itemDetail } = await supabase.from(props.tableId).select(selectQuery).match(primaryKeys).single()
    state.item = itemDetail
    logger.log('item fetched: ', itemDetail)
  } else {
    state.item = JSON.parse(JSON.stringify(props.item))
  }
  state.loading = false
})

onBeforeUnmount(() => {
  logger.log(':onBeforeUnmount')
})
</script>
