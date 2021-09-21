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
      v-for="(d,dkey) in schema?.definitions" :key="dkey"
      :style=`{
        minWidth: '200px',
        maxWidth: '200px',
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
import useSWRV from 'swrv'

export default defineComponent({
  name: 'PageSchema',
  setup () {
    const { data: schema } = useSWRV('/schema', null)
    return {
      schema
    }
  }
})
</script>
