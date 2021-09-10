<style lang="scss" scoped>
</style>

<template lang="pug">
q-page.q-pa-md
  span Page unknown
  .row.full-width
    small {{storeMain.page}}
</template>

<script >
import { defineComponent } from 'vue'
import { useStoreMain } from 'src/stores/main.js'

export default defineComponent({
  name: 'PageUnknown',
  setup () {
    const storeMain = useStoreMain()

    return {
      storeMain
    }
  }
})
</script>
