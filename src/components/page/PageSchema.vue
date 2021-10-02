<style lang="scss" scoped>
.definition {
  border-radius: 4px;
  background: rgba(0,0,0,0.1);
}
</style>

<template lang="pug">
q-page(v-if="schema").q-pa-md.scroll
  q-dialog(
    dark side="right" position="right" square full-height
    :model-value="state.pkey ? true : false"
    @hide="propertyEditorClosed").window-height
    PropertyEditor(
      :dkey="state.dkey"
      :definition="state.definition"
      :pkey="state.pkey"
      :property="state.property"
      :style="{minWidth: '550px', maxWidth: '550px'}"
      @close="propertyEditorClosed")
  div(v-if="viewId === 'rows'").row.full-width.items-start.content-start
    //- header
    //- .row.full-width.q-py-sm
      q-input(
        v-model="searchText"
        borderless dense placeholder="Search"
        :input-style="{paddingLeft: '8px'}"
        ).full-width.br
    //- rows
    div(
      v-for="(d,dkey) in schema.definitions" :key="dkey"
      :style="{borderRadius: '4px'}"
      ).row.full-width.q-mb-sm.bg-grey-3
      .row.full-width.q-px-sm.q-pt-sm.q-pb-xs
        span.text-bold {{ dkey }}
        .row.full-width
          small(style="color: rgb(128, 128, 128); line-height: 1;") {{ d.description }}
      .row.full-width.q-pl-sm.q-pb-sm
        PropertyRowCell(
          v-for="(p,pkey) in d.properties" :key="pkey"
          :dkey="dkey"
          :definition="d"
          :pkey="pkey"
          :property="p"
          @click="propertyClick(dkey, d, pkey, p)")
  //- columns
  div(v-if="viewId === 'columns'").row.items-start.content-start.no-wrap
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
  //- graph
</template>

<script setup>
import useSWRV from 'swrv'
import PropertyEditor from 'components/schema/PropertyEditor.vue'
import PropertyRowCell from 'components/schema/PropertyRowCell.vue'

const logger = inject('logger')('PageSchema')
const { data: schema } = useSWRV('/schema', null)
const viewId = ref('rows')
const searchText = ref('')
const propertySelected = ref(null)

const state = reactive({
  dkey: null,
  definition: null,
  pkey: null,
  property: null
})
const propertyClick = (dkey, d, pkey, p) => {
  logger.log(':propertyClick', dkey, d, pkey, p)
  state.dkey = dkey
  state.definition = d
  state.pkey = pkey
  state.property = p
}
const propertyEditorClosed = () => {
  state.dkey = null
  state.definition = null
  state.pkey = null
  state.property = null
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>
