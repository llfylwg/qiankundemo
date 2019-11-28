<template lang="html">
  <section class="info-detail-wrap">
    <goodsInfo :productId="productId"></goodsInfo>
  </section>
</template>

<script>
import goodsInfo from '../../components/page/backgoodsdetail/goodsinfo'
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
    this.productId = this.$route.query['id']
  }
}
</script>

<style lang="scss" scoped>
.info-detail-wrap{
  width: 100%;
  // height: 100vh;
}
</style>
