<template lang="html">
  <section class="info-detail-wrap">
    <goodsInfo :productId="productId"></goodsInfo>
  </section>
</template>

<script>
import goodsInfo from '../../components/page/goodsdetail/goodsinfo'
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
  // min-height: 100vh;
  // overflow-y: auto;
  // background: #E7E7E7;
}
</style>
