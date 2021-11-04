<style lang="scss" scoped>
</style>

<template lang="pug">
component(:is="pageComponent" :key="route.path")
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStoreMain } from 'src/stores/main.js'

import PageTable from './PageTable.vue'
import PageSchema from './PageSchema.vue'
import PageRoles from './PageRoles.vue'
import PageUnknown from './PageUnknown.vue'

const route = useRoute()
const storeMain = useStoreMain()

/* Dynamic page component for every page type */
const pageComponent = computed(() => {
  if (storeMain.page?.body?.type === 'schema') return PageSchema
  if (storeMain.page?.body?.type === 'table') return PageTable
  if (storeMain.page?.body?.type === 'roles') return PageRoles
  else return PageUnknown
})
</script>
