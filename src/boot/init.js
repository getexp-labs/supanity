import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  const extension = app.config.globalProperties.supanityExtension
  console.log('extension', extension)
  window.supanityExtension = extension
  app.provide('supanityExtension', extension)
})
