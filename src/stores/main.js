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
    ]
  },
  {
    id: 'views',
    type: 'group',
    name: 'Views',
    pages: [
    ]
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
    supabaseInit () {
      console.log('[main] supabaseInit')
      this.supabase = createClient(process.env.VUE_APP_SUPABASE_URL, process.env.VUE_APP_SUPABASE_KEY)
      console.log('supabase', this.supabase)
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
