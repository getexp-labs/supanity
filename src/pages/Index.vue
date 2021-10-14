<template lang="pug">
q-page.q-pa-md
  //- img(alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px")
  //- small {{ schema }}
  small.full-width {{ storeMain.user }}
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { fetcherSchema } from 'boot/api'
import useSWRV from 'swrv'
import { useStoreMain } from 'src/stores/main.js'

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const storeMain = useStoreMain()

    return {
      storeMain
    }
  }
})
</script>
