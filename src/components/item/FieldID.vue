<style lang="scss" scoped>
</style>

<template lang="pug">
div(:style=`{borderRadius: '4px'}`).row.full-width.bg-grey-3.q-pa-sm.cursor-pointer
  small {{ props.value }}
</template>

<script setup>

const props = defineProps({
  value: { type: String }
})

</script>
