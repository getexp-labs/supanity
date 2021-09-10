import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useStoreMain } from 'src/stores/main.js'

export default boot(({ app, router }) => {
  const pinia = createPinia()
  pinia.use(() => ({ router }))
  app.use(pinia)

  router.beforeEach((to, from, next) => {
    console.log('[router] beforeEach')
    // TODO add auth guards and check token sessions, and user profile fetch
    const storeMain = useStoreMain()
    if (!storeMain.supabase) storeMain.initSupabase()
    if (!storeMain.ready) storeMain.init()
    next()
  })
})
