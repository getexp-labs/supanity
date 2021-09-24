<template lang="pug">
router-view
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  console.log('[App] onMounted')
})
</script>
