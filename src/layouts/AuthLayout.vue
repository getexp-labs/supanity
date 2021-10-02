<style lang="scss" scoped>
</style>

<template lang="pug">
div(
  v-if="state.status === 'new'"
  ).row.full-width.items-center.content-center.justify-center.window-height
  div(:style="{maxWidth: '320px',}").row.full-width.justify-center.bg-grey-4.q-pa-xl
    h6.full-width.text-bold Хули тебе тут надо?
    q-btn(color="black" @click="storeMain.userSignIn()").full-width Enter
div(
  v-if="state.status === 'waiting'"
  ).row.full-width.items-center.content-center.justify-center.window-height
  q-spinner(color="black" size="50px")
</template>

<script setup>
import { supabase } from 'boot/api'
import { useStoreMain } from 'src/stores/main'

const logger = inject('logger')('AuthLayout')
const storeMain = useStoreMain()
const router = useRouter()
const state = reactive({
  status: 'new'
})

if (localStorage.getItem('auth_waiting')) {
  logger.log(':check auth_wating')
  state.status = 'waiting'
  supabase.auth.onAuthStateChange(async (event, session) => {
    logger.log(':onAuthStateChange', session)
    if (session?.user) {
      localStorage.removeItem('auth_waiting')
      router.replace('/')
    }
  })
}

onMounted(async () => {
  logger.log(':onMounted')
  const apples = await supabase.from('apples').select('*')
  logger.log(':onMounted apples', apples)
})
</script>
