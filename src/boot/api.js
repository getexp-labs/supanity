import { boot } from 'quasar/wrappers'
import { useStoreMain } from 'src/stores/main.js'
import { createClient } from '@supabase/supabase-js'
import { extend } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// const api = axios.create({ baseURL: 'https://api.example.com' })
// import { supabase } from 'boot/api'

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_CLIENT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
export const supabase = createClient(SUPABASE_CLIENT_URL, SUPABASE_ANON_KEY)

export default boot(({ app }) => {
  console.log('[api] start')
  // const storeMain = useStoreMain()
  // const user_id = localStorage.getItem('user_id')
  // if (user_id) {
  //   console.log('[boot] user_id FOUND')
  //   storeMain.user_id = user_id
  // }
  // else {
  //   console.log('[boot] user_id NOT FOUND')
  // }
  // app.get('/api/hello', (req, res) => {
  //   res.json({ hello: 'dick' })
  // })
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  // app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

// export { api }

export const fetcher = async (key) => {
  console.log('[fetcher] key', key)
  // const storeMain = useStoreMain()
  // const supabase = storeMain.supabase
  const response = await fetch(
    `${supabase.supabaseUrl}/rest/v1${key}`,
    {
      method: 'GET',
      headers: {
        apikey: supabase.supabaseKey,
        // Authorization: `Bearer ${supabase.supabaseKey}`
        Authorization: `Bearer ${supabase.auth.session()?.access_token}`
        // Authorization: `Beare`
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
      meta: { labelColumn: 'title' }
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
  console.log('schemaMerged', schemaMerged)
  return schema
}
