import { defineStore } from 'pinia'
import { supabase } from 'boot/api'

const PAGE_GROUPS = [
  {
    id: 'database',
    type: 'group',
    name: 'Database',
    pages: [
      { id: 'schema', type: 'page', name: 'Schema', body: { type: 'schema' } }
      // { id: 'roles', type: 'page', name: 'Roles', body: { type: 'roles' } }
    ],
    isOpened: true
  },
  {
    id: 'pages',
    type: 'group',
    name: 'Pages',
    pages: [
    ],
    isOpened: false
  },
  {
    id: 'channels',
    type: 'group',
    name: 'Channels',
    pages: [
    ],
    isOpened: false
  },
  {
    id: 'apps',
    type: 'group',
    name: 'Apps',
    pages: [
    ],
    isOpened: false
  }
]

export const useStoreMain = defineStore('main', {
  state: () => ({
    // ready: false,
    // token: null,
    // currentUser: null,
    // supabase: null,
    user: null,
    userAuth: null,
    pages: PAGE_GROUPS,
    // user_id: null
  }),
  getters: {
    route () {
      return this.router.currentRoute
    },
    page () {
      // return this.pages.find(p => p.id === this.route?.params.pageId)
      return Object.values(this.pages).reduce((res, group) => {
        const page = group.pages.find(p => p.id === this.route.params.pageId)
        if (page) res = page
        return res
      }, null)
    }
  },
  actions: {
    initSupabase () {
      console.log('[initSupabase]')
      // const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
      // const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
      // const SUPABASE_CLIENT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
      // this.supabase = createClient(SUPABASE_CLIENT_URL, SUPABASE_ANON_KEY)
      // this.supabase.auth.onAuthStateChange(async (event, session) => {
      //   console.log('[authStateChange]', event, session)
      //   if (session?.user) {
      //     localStorage.setItem('user_id', session.user.id)
      //     this.userAuth = session.user
      //     await this.userGet(session.user.id)
      //   }
      //   else {
      //     storeMain.user_id = null
      //     localStorage.removeItem('user_id')
      //     this.router.replace('/auth')
      //   }
      // })
    },
    pagesGet () {
      return []
    },
    setPages (schema) {
      if (!schema) return
      const tables = []
      Object.entries(schema.definitions).map(([id, val]) => {
        tables.push({
          id: id,
          type: 'page',
          name: id,
          body: {
            type: 'table',
            definition: val
          }
        })
        return null
      })
      this.pages = PAGE_GROUPS.map(g => g.id === 'database' ? { ...g, pages: [...g.pages, ...tables] } : { ...g })
    },
    async userSignIn () {
      console.log('[userSignIn] start')
      const redirectTo = `${window.location.origin}`
      console.log('[userSignIn] redirectTo', redirectTo)
      const { user, session, error } = await supabase.auth.signIn({
        provider: 'discord'
      }, { redirectTo, scopes: 'identify email guilds.join' })
      console.log('[userSignIn] done')
    },
    async userSignOut () {
      console.log('[userSignOut] start')
      const { error } = await supabase.auth.signOut()
      // this.user = null
      // this.userAuth = null
      console.log('[userSignOut] done')
      window.location.reload()
    },
    async userGet (id) {
      console.log('[userGet]', id)
      if (!id) return
      const user = supabase.auth.user()
      if (user) {
        this.user = user
      }
    },
    // init () {
    //   console.log('[main] init')
    //   this.ready = true
    // }
  }
})
