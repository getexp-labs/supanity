import { useStoreMain } from 'src/stores/main'
import { supabase, fetcher } from 'boot/api'

const needAnon = async (to, from, next) => {
  console.log('[needAnon] start')
  const currentUser = supabase.auth.user()
  console.log('[needAnon] currentUser')
  if (currentUser) {
    console.log('[needAnon] GOT currentUser')
    next('/')
  }
  else {
    console.log('[needAnon] NO currentUser')
    next()
  }
}

const needUser = async (to, from, next) => {
  console.log('[needUser] start')
  const currentUser = supabase.auth.user()
  console.log('[needUser] currentUser')
  if (currentUser) {
    const storeMain = useStoreMain()
    console.log('[needUser] GOT currentUser')
    await storeMain.userGet(currentUser.id)
    next()
  }
  else {
    console.log('[needUser] NO currentUser')
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
    path: '/test',
    component: () => import('layouts/TestLayout.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'page/:pageId', component: () => import('components/page/PageComposer.vue') },
      { path: 'page-extension/:pageId', component: () => import('components/page/PageComposer.vue') }
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
