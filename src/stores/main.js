import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
// import { api } from 'boot/axios.js'

const PAGE_GROUPS = [
  {
    id: 'database',
    type: 'group',
    name: 'Database',
    pages: [
      { id: 'schema', type: 'page', name: 'Schema', body: { type: 'schema' } },
      { id: 'roles', type: 'page', name: 'Roles', body: { type: 'roles' } }
    ],
    isOpened: true
  },
  {
    id: 'views',
    type: 'group',
    name: 'Views',
    pages: [
    ],
    isOpened: false
  }
]

export const useStoreMain = defineStore('main', {
  state: () => ({
    ready: false,
    token: null,
    currentUser: null,
    pages: PAGE_GROUPS,
    supabase: null
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
      const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
      const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
      const SUPABASE_CLIENT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
      this.supabase = createClient(SUPABASE_CLIENT_URL, SUPABASE_ANON_KEY)
      // console.log('[initSupabase]', this.supabase)
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
    init () {
      console.log('[main] init')
      this.ready = true
    }
  }
})
