<style lang="scss" scoped>
.page {
  border-radius: 4px;
  &.active {
    background: rgba(220,220,220,1);
  }
}
</style>

<template lang="pug">
.column.fit.items-start.content-start.justify-start
  div(:style=`{height: '50px'}`).row.full-width.items-center.content-center.bg-primary.q-px-md
    span(:style=`{fontSize: '18px'}`).text-bold.text-white Supanity
  .col.full-width.scroll
    .row.full-width.items-start.content-start
      //- group
      div(
        v-for="(g,gi) in storeMain.pages" :key="g.id"
        ).row.full-width.items-start.content-start.q-px-md
        //- group header
        div(
          @click="g.isOpened = !g.isOpened"
          ).row.full-width.items-center.content-center.q-py-sm.justify-between.cursor-pointer
          span {{g.name}}
          q-icon(:name="g.isOpened ? 'keyboard_arrow_down' : 'keyboard_arrow_up'")
        //- pages
        div(
          v-show="g.isOpened"
          ).row.full-width.items-start.content-start
          router-link(
            v-for="(p,pi) in g.pages" :key="p.id"
            :to="`/page/${p.id}`"
            :class="{'active': p.id === storeMain?.page?.id}"
            ).page.row.full-width.items-center.content-center.q-px-md.q-py-sm
            span {{p.name}}
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStoreMain } from 'src/stores/main.js'

export default defineComponent({
  name: 'Drawer',
  setup () {
    const storeMain = useStoreMain()
    return {
      storeMain
    }
  }
})
</script>
