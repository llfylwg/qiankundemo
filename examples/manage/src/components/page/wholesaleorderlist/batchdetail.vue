<template lang="html">
  <ul>
    <li v-for="(i, k) in optData['items']">
      {{`${i['skuInfo']} / ${i['price']} 元 * ${i['count']}`}}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    optData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="css">
</style>
