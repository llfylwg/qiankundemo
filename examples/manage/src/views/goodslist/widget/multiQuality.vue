<template lang="html">
  <el-dialog title="转转官方二次质检提醒" :visible.sync="dialogFormVisible" width="586px" :before-close="modalClose">
    <p class="content">您选中的商品有部分命中转转官方二次质检，以下{{secondDatas.length}}个商品被命中。</p>
    <div class="quality">
      <h-table :listData="secondDatas" :listProps="listProps" size="mini"></h-table>
    </div>
    <p class="content">请尽快将该商品送检至官方自营质检中心，24小时内需要在后台操作填入每个商品的物流信息。若未按时发货则会对商家进行处罚，感谢配合。</p>
    <p class="description">二次质检流程说明：</p>
    <p class="description">为更好的保障自质检商家发布的商品质量，转转官方将在每日发布的自质检商品中进行抽检，命中二次质检的商品需要及时送检。如二次质检报告与初检一致，则官方质检中心将为该商品拍照上架，如果7日内卖出则由平台发货，应得交易额将自动打款给商家；如果7日后未卖出则自动退货给卖家。</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toPostage" class="cancle">去质检系统发货</el-button>
    </div>
  </el-dialog>
</template>

<script>
import hTable from 'sub/component/Table'
export default {
  components: {
    hTable
  },
  props: ['secondDatas'],
  data () {
    return {
      dialogFormVisible: true,
      multi: false,
      listProps:  [{
        prop: 'bizProductId',
        label: '编号',
      },
      {
        prop: 'title',
        label: '商品',
        width: '220'
      },
      {
        prop: 'deviceCode',
        label: 'IMEI'
      },
      {
        prop: 'qcCode',
        label: '质检码'
      }]
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
.quality{
  border-top: 1px solid #E4E7ED;
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
