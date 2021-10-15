<style lang="scss" scoped>
</style>

<template lang="pug">
q-input(
  dense filled hide-bottom-space
  :label="label"
  type="textarea"
  :readonly="disabled"
  :modelValue="modelValue"
  @update:modelValue="emit('update:modelValue', $event)"
  ).full-width.text-black
</template>

<script setup>

const props = defineProps({
  value: { type: [String, Object] },
  disabled: { type: Boolean },
  label: { type: String }
})

const emit = defineEmits(['update:modelValue'])

const modelValue = computed(() => JSON.stringify(props.value, undefined, 2))

</script>
