<style lang="scss" scoped>
</style>

<template lang="pug">
.row.full-width.items-center.content-center.justify-center.window-height
  div(:style="{maxWidth: '320px',}").row.full-width.bg-grey-4.q-pa-xl
    h4.full-width.text-bold Authentication
    q-btn(color="black" @click="storeMain.userSignIn()").full-width Enter
</template>

<script>
import { defineComponent } from 'vue'
import { useStoreMain } from 'src/stores/main'

export default defineComponent({
  name: 'AuthLayout',
  setup () {
    const storeMain = useStoreMain()
    return {
      storeMain
    }
  }
})
</script>
