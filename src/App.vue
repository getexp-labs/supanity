<template lang="pug">
router-view
</template>

<script setup>
import { supabase, useLogger } from 'boot/api'

provide('logger', useLogger)
const logger = useLogger('App')
const router = useRouter()

onMounted(() => {
  logger.log(':onMounted')
  supabase.auth.onAuthStateChange(async (event, session) => {
    logger.log(':onAuthStateChange session', session)
    logger.log(':onAuthStateChange event', event)
    if (session?.user) {
      logger.log(':onAuthStateChange session.user found')
      // For some reason does not replace immidiately
      setTimeout(() => {
        router.replace('/')
      })
    }
  })
})

onBeforeUnmount(() => {
  logger.log(':onBeforeUnmount')
})
</script>
