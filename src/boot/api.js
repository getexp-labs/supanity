import { boot } from 'quasar/wrappers'
// import { useStoreMain } from 'src/stores/main.js'
import { createClient } from '@supabase/supabase-js'
import { extend } from 'quasar'

export const useLogger = (id) => {
  return {
    log (...msg) {
      console.log(`[${id}]`, ...msg)
    }
  }
}

const logger = useLogger('boot:api')

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_CLIENT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`

export const supabase = createClient(SUPABASE_CLIENT_URL, SUPABASE_ANON_KEY)

let supanityExtension = null

export default boot(({ app }) => {
  logger.log(':start')
  supanityExtension = app.config.globalProperties?.supanityExtension
  logger.log(':done')
})

export const fetcher = async (key) => {
  logger.log(':fetcher key', key)
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

export const fetcherSchema = async (key) => {
  logger.log(':fetcherSchema start')
  const response = await fetch(
    `${supabase.supabaseUrl}/rest/v1/?apikey=${encodeURIComponent(supabase.supabaseKey)}`,
    {
      method: 'GET'
    }
  )
  const schema = await response.json()
  // return schema
  const schemaExtension = supanityExtension?.schema || {}
  const schemaMerged = await extend(true, schema, schemaExtension)
  logger.log(':fetcherSchema schemaMerged', schemaMerged)
  return schemaMerged
}
