<template lang="pug">
router-view
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App'
})
</script>

<script setup>
import { useStoreMain } from 'src/stores/main.js'
const storeMain = useStoreMain()
storeMain.supabaseInit()
</script>
