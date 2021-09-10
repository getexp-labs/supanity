<style lang="scss" scoped>
.definition {
  border-radius: 4px;
  background: rgba(0,0,0,0.1);
}
</style>

<template lang="pug">
q-page().q-pa-md.scroll
  .row.items-start.content-start.no-wrap
    div(
      v-for="(d,dkey) in storeMain.schema.definitions" :key="dkey"
      :style=`{
        minWidth: '220px',
        maxWidth: '220px',
      }`
      ).definition.row.items-start.content-start.q-mr-sm
      .row.full-width.q-pa-sm
        span.text-bold {{dkey}}
      .row.full-width.items-start.content-start.q-px-sm
        div(
          v-for="(p,pkey) in d.properties" :key="pkey"
          ).row.full-width.items-center.content-center.justify-start.q-py-xs
          span.q-mr-sm {{pkey}}
          .row.full-width
            small(style="line-height: 1") {{p.format}}
            //- small.full-width.bg-green {{p}}
</template>

<script >
import { defineComponent } from 'vue'
import { useStoreMain } from 'src/stores/main.js'

export default defineComponent({
  name: 'PageSchema',
  setup () {
    const storeMain = useStoreMain()

    return {
      storeMain
    }
  }
})
</script>
