import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
// import { api } from 'boot/axios.js'

export const useStoreMain = defineStore('main', {
  state: () => ({
    ready: false,
    token: null,
    currentUser: null,
    schema: null,
    pageGroups: [
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
    ],
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
    },
    pages () {
      const tables = []
      if (this.schema) {
        Object.entries(this.schema.definitions).map(([id, val]) => {
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
      }
      return this.pageGroups.map(g => {
        if (g.id === 'database') {
          g.pages = [...g.pages, ...tables]
        }
        return g
      })
    }
  },
  actions: {
    supabaseInit () {
      console.log('[main] supabaseInit')
      this.supabase = createClient('https://izodeaqdqzaxecxrwhmc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjAyMzYzMSwiZXhwIjoxOTQxNTk5NjMxfQ.xxRZIltJSorTFFr3rkvP-_qCqUa8B9leJPzTzaGvRL4')
    },
    schemaGet () {
      console.log('[main] schemaGet')
      const schema = require('src/assets/schema.json')
      return schema
    },
    init () {
      console.log('[main] init')
      this.schema = this.schemaGet()
      this.ready = true
    }
  }
})
