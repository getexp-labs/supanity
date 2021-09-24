import { useStoreMain } from 'src/stores/main'
import { fetcher } from 'boot/api'

const needAnon = async (to, from, next) => {
  console.log('[needAnon] start')
  const storeMain = useStoreMain()
  if (storeMain.user_id) next('/')
  else next()
}

const needUser = async (to, from, next) => {
  console.log('[needUser] start')
  const storeMain = useStoreMain()
  if (storeMain.user_id) {
    console.log('[needUser] storeMain.user_id FOUND')
    // const user = await storeMain.userGet(storeMain.user_id)
    // console.log('[needUser] user', user)
    next()
  }
  else {
    console.log('[needUser] storeMain.user_id NOT FOUND')
    next('/auth')
  }
}

const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    beforeEnter: needAnon
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'page/:pageId', component: () => import('components/page/PageComposer.vue') }
    ],
    beforeEnter: needUser
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
