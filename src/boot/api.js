import { boot } from 'quasar/wrappers'
import { useStoreMain } from 'src/stores/main.js'
import { createClient } from '@supabase/supabase-js'
import { extend } from 'quasar'

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_CLIENT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`

export const supabase = createClient(SUPABASE_CLIENT_URL, SUPABASE_ANON_KEY)

export default boot(({ app }) => {
  console.log('[api] start')
})

export const fetcher = async (key) => {
  console.log('[fetcher] key', key)
  const response = await fetch(
    `${supabase.supabaseUrl}/rest/v1${key}`,
    {
      method: 'GET',
      headers: {
        apikey: supabase.supabaseKey,
        // Authorization: `Bearer ${supabase.supabaseKey}`
        Authorization: `Bearer ${supabase.auth.session()?.access_token}`
      }
    })
  return response.json()
}

export const schemaMeta = reactive({
  meta: {
    tableHiddenColumns: ['created_at', 'updated_at'],
    disabledFields: ['created_at', 'updated_at'],
  },
  definitions: {
    offers: {
      meta: {
        labelColumn: 'title',
        tableHiddenColumns: ['created_at', 'updated_at', 'cover_image', 'gallery_images', 'game_id'],
      },
      properties: {
        cover_image: { meta: { type: 'img:one' } },
        gallery_images: { meta: { type: 'img:many' } },
        description: { meta: { type: 'html' } },
      }
    },
    order_offers: {
      meta: {
        disabled: true
      },
    },
    game_categories: {
      meta: { labelColumn: 'name' }
    },
    games: {
      meta: { labelColumn: 'title' },
      properties: {
        platforms: { enum: ['PC', 'PS', 'XBOX'] },
      }
    },
    orders: {
      meta: {
        disabled: true,
      },
      properties: {
        type: { enum: ['C1', 'RETURN'] },
        status: { enum: ['PAYED', 'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'PAUSED', 'DONE'] }
      }
    }
  }
})

export const fetcherSchema = async (key) => {
  console.log('[fetcherSchema]', key)
  const response = await fetch(
    `${supabase.supabaseUrl}/rest/v1/?apikey=${encodeURIComponent(supabase.supabaseKey)}`,
    {
      method: 'GET'
    }
  )
  const schema = await response.json()
  const schemaMerged = await extend(true, schema, schemaMeta)
  // console.log('schemaMerged', schemaMerged)
  return schemaMerged
  // return schema
}
