<template lang="pug">
q-page.flex.flex-center
  //- img(alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px")
  //- small {{ schema }}
</template>

<script>
import { defineComponent } from 'vue'
import { fetcherSchema } from 'boot/api'
import useSWRV from 'swrv'
import { useStoreMain } from 'src/stores/main.js'

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const storeMain = useStoreMain()
    // const { data: schema, error: schemaError } = useSWRV('/schema', fetcherSchema)
    // const schema = storeMain.schemaGet()
    // console.log('schema', schema)

    return {
      // schema
    }
  }
})
</script>
