<style lang="scss" scoped>
</style>

<template lang="pug">
.row.full-width
  //- span {{storeMain.page}}
  component(:is="storeMain.page.body.component")
</template>

<script setup>
import { useStoreMain } from 'src/stores/main.js'
const logger = inject('logger')('PageCustom')
const storeMain = useStoreMain()

</script>
