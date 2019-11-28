<template lang="html">
  <p>
    <span>{{optData['totalPrice']}} 元</span>
    <span>{{`（${optData['isModefiedPrice'] ? '已改价' : '未改价'}）`}}</span>
    <i>{{`（含运费${optData['freight']} 元）`}}</i>
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
