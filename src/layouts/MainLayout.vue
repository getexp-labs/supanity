<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header()
    q-toolbar
      q-btn(flat dense icon="menu" aria-label="Menu" @click="state.leftDrawerOpened = !state.leftDrawerOpened")
      q-toolbar-title {{storeMain?.page?.name}}
      q-space
      span.q-mr-md {{storeMain.user.user_metadata?.full_name}}
      q-btn(flat dense icon="logout" @click="storeMain.userSignOut()")
  q-drawer(
    v-model="state.leftDrawerOpened" show-if-above bordered
    :width="220"
    ).bg-grey-1
    BaseDrawer
  q-page-container
    router-view
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
import { fetcherSchema } from 'boot/api'
import useSWRV from 'swrv'
import { useStoreMain } from 'src/stores/main.js'

import BaseDrawer from 'components/base/BaseDrawer.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    BaseDrawer
  },
  setup () {
    const storeMain = useStoreMain()
    const state = reactive({
      leftDrawerOpened: false
    })
    const { data: schema, error: schemaError } = useSWRV('/schema', fetcherSchema)
    // Using a watcher, you can update the store with any changes coming from swrv
    watch(schema, newSchema => {
      // storeMain.setPages(newSchema)
      storeMain.schema = newSchema
    })

    return {
      storeMain,
      state
    }
  }
})
</script>
