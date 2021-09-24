<template lang="pug">
router-view
//- sn-shit
</template>

<script setup>
import { onMounted } from 'vue'
import { useStoreMain } from 'src/stores/main.js'
// const storeMain = useStoreMain()
// storeMain.supabaseInit()
onMounted(() => {
  const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
  console.log('[App] onMounted SUPABASE_PROJECT_ID', SUPABASE_PROJECT_ID)
})
</script>
