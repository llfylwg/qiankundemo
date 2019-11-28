<template lang="html">
  <section class="info-detail-wrap">
    <goodsInfo ></goodsInfo>
  </section>
</template>

<script>
import goodsInfo from '../../components/page/wholesalegoodsdetail/goodsinfo'
export default {
  data () {
    return {
      productId: ''
    }
  },
  components: {
    goodsInfo
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.info-detail-wrap{
  width: 100%;
  // min-height: 100vh;
  // overflow-y: auto;
  // background: #E7E7E7;
}
</style>
