<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header()
    q-toolbar
      q-btn(flat dense round icon="menu" aria-label="Menu" @click="state.leftDrawerOpened = !state.leftDrawerOpened")
      q-toolbar-title {{storeMain?.page?.name}}
  q-drawer(
    :width="220"
    ).bg-grey-1(v-model="state.leftDrawerOpened" show-if-above bordered)
    Drawer
  q-page-container
    router-view
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useStoreMain } from 'src/stores/main.js'

import Drawer from 'components/Drawer.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    Drawer
  },
  setup () {
    const storeMain = useStoreMain()
    const state = reactive({
      leftDrawerOpened: false
    })

    return {
      storeMain,
      state
    }
  }
})
</script>
