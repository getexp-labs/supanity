import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useStoreMain } from 'src/stores/main.js'
import { markRaw } from 'vue'

export default boot(({ app, router }) => {
  // Pinia
  const pinia = createPinia()
  pinia.use(() => ({ router }))
  // pinia.use(({ store }) => {
  //   store.router = markRaw(router)
  // })
  app.use(pinia)
  const storeMain = useStoreMain()

  router.beforeEach((to, from, next) => {
    console.log('[router] beforeEach')
    // TODO add auth guards and check token sessions, and user profile fetch
    // const storeMain = useStoreMain()
    if (!storeMain.supabase) storeMain.initSupabase()
    // if (!storeMain.ready) storeMain.init()
    next()
  })
})
