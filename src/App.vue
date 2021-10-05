<template lang="pug">
router-view
</template>

<script setup>
import { supabase } from 'boot/api'
import { onMounted, provide } from 'vue'

const logger = (id) => {
  return {
    log (...msg) {
      console.log(`[${id}]`, ...msg)
    }
  }
}

const appLogger = logger('App')
const router = useRouter()
onMounted(() => {
  appLogger.log('onMounted')
  supabase.auth.onAuthStateChange(async (event, session) => {
    appLogger.log(':onAuthStateChange session', session)
    appLogger.log(':onAuthStateChange event', event)
    if (session?.user) {
      // For some reason does not replace immidiately
      setTimeout(() => {
        router.replace('/')
      })
    }
  })
})

provide('logger', logger)
</script>
