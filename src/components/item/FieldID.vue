<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  @click="onClick"
  :style=`{borderRadius: '4px 4px 0px 0px'}`).row.full-width.bg-grey-3.q-pa-sm.cursor-pointer
  .row.full-width.q-pl-xs
    small(style="line-height: 1").text-grey-7 ID
  small.q-ml-xs {{ props.value }}
</template>

<script setup>
import { useQuasar, copyToClipboard } from 'quasar'
const logger = inject('logger')('FieldID')
const $q = useQuasar()

const props = defineProps({
  value: { type: String }
})

const onClick = () => {
  logger.log('onClick start')
  copyToClipboard(props.value)
    .then(() => {
      logger.log('onClick copied')
      $q.notify({ type: 'positive', message: 'ID Copied!' })
    })
    .catch(() => {
      logger.log('onClick copy failed')
      $q.notify({ type: 'negative', message: 'Failed to copy ID!' })
    })
}
</script>
