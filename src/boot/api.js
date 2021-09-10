import { boot } from 'quasar/wrappers'
import { useStoreMain } from 'src/stores/main.js'
// import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// const api = axios.create({ baseURL: 'https://api.example.com' })

export default boot(({ app }) => {
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
  const storeMain = useStoreMain()
  const supabase = storeMain.supabase
  const response = await fetch(
    `${supabase.supabaseUrl}/rest/v1${key}`,
    {
      method: 'GET',
      headers: {
        apikey: supabase.supabaseKey,
        Authorization: `Bearer ${supabase.auth.session()?.access_token}`
      }
    })
  return response.json()
}

export const fetcherSchema = async (key) => {
  console.log('[fetcherSchema]', key)
  const storeMain = useStoreMain()
  const supabase = storeMain.supabase
  const response = await fetch(
    `${supabase.supabaseUrl}/rest/v1/?apikey=${supabase.supabaseKey}`,
    {
      method: 'GET'
    })
  return response.json()
}
