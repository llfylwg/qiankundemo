<template lang="html">
  <el-dialog title="该商品已命中转转官方二次质检" :visible.sync="dialogFormVisible" width="486px" :before-close="modalClose">
    <p class="content">请尽快将该商品送检至官方自营质检中心，24小时内需要填入该商品（IMEI：{{secondDatas.deviceCode || ''}}，质检码：{{secondDatas.qcCode || ''}}）物流信息。若未按时发货则会对商家进行处罚，感谢配合。</p>
    <p class="description">二次质检流程说明：</p>
    <p class="description">为更好的保障自质检商家发布的商品质量，转转官方将在每日发布的自质检商品中进行抽检，命中二次质检的商品需要及时送检。如二次质检报告与初检一致，则官方质检中心将为该商品拍照上架，如果7日内卖出则由平台发货，应得交易额将自动打款给商家；如果7日后未卖出则自动退货给卖家。</p>
    <div slot="footer" class="dialog-footer">
        <el-button @click="toPostage" class="cancle">去填物流信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['secondDatas'],
  data () {
    return {
      dialogFormVisible: true,
      multi: false
    }
  },
  methods: {
    modalClose () {
      this.$emit('changeTab')
      this.$emit('modalClose')
    },
    toPostage () {
      window.open('https://youpinoffice.zhuanzhuan.com/qc/stock-out/send-confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}
.content {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
.description{
  color: #999;
  font-size: 14px;
  line-height: 20px;
}
.dialog-footer{
  text-align: center;
}
</style>
