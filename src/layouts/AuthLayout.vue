<style lang="scss" scoped>
</style>

<template lang="pug">
q-banner(v-if="state.status === 'error'").text-white.bg-red.text-center {{state.message}}
div(
  v-if="state.status !== 'waiting'"
  ).row.full-width.items-center.content-center.justify-center.window-height
  div(:style="{maxWidth: '320px',}").row.full-width.justify-center.bg-grey-4.q-pa-xl
    h6.full-width.text-bold Хули тебе тут надо?
    q-btn(color="black" @click="storeMain.userSignIn()").full-width Enter
div(
  v-else
  ).row.full-width.items-center.content-center.justify-center.window-height
  q-spinner(color="black" size="50px")
</template>

<script setup>
import { useStoreMain } from 'src/stores/main'

const logger = inject('logger')('AuthLayout')
const storeMain = useStoreMain()
const router = useRouter()
const route = useRoute()
const initialState = {
  status: route.hash ? 'waiting' : 'new'
}
if (route.query.error) {
  initialState.status = 'error'
  initialState.message = route.query.error_description
}
const state = reactive(initialState)

onMounted(async () => {
  logger.log(':onMounted')
})
</script>
