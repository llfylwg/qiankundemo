<template lang="html">
  <p>
    <span>{{optData['totalPrice']}}元</span>
    <i>{{`（含运费${optData['freight']}元`}}</i>
    <i v-if="optData['redPackMoney'] && optData['redPackMoney'] > 0"> ， 已减{{optData['redPackMoney']}} 元红包</i>
    <i>）</i>
  </p>
</template>

<script>
export default {
  props: {
    optData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
</style>
