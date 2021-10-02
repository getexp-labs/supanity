<template lang="pug">
router-view
</template>

<script setup>
import { onMounted, provide } from 'vue'

onMounted(() => {
  console.log('[App] onMounted')
})

const logger = (id) => {
  return {
    log (...msg) {
      console.log(`[${id}]`, ...msg)
    }
  }
}
provide('logger', logger)
</script>
