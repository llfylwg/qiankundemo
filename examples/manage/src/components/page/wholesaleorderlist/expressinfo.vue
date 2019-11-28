<template lang="html">
  <el-dialog
    title="物流信息"
    :visible.sync="dialogVisible"
    width="932px"
    :before-close="hideExpressModal"
    >
      <p class="expressinfo-box">
        <template>
          <span>物流公司： {{deliverInfo.expressCompany}}</span>
          <span>物流单号：{{deliverInfo.expressNum}}</span>
        </template>
        <span>发货类型：{{deliverInfo.deliverTypeDesc}}</span>
      </p>
      <div class="express-list">
        <template v-if="deliverInfo['flowDetails']">
          <p v-for="item in deliverInfo['flowDetails']" class="express-item">
            {{item}}
          </p>
        </template>
        <p v-else class="no-express-info">暂无物流信息</p>
      </div>
      <div class="send-modal">
        <section class="recveive-person">
          <p><b>收件人: </b>{{deliverInfo['consigneeName']}}</p>
          <p><b>手机号码: </b>{{deliverInfo['consigneePhone']}}</p>
          <div><b>收货地址: </b>{{deliverInfo['consigeeAddr']}}</div>
        </section>
        <!-- <section class="send-person">
          <p>商户名: {{deliverInfo['consigneeName']}}</p>
          <p>手机号码: {{deliverInfo['consigneePhone']}}</p>
          <p>发货数量: {{deliverInfo['publishCount']}}</p>
        </section> -->
        <!--<h-table></h-table>-->
      </div>
      <el-table :data="deliverInfo.orderItems || []" style="width: 100%">
        <el-table-column prop="productId" label="商品编号" width="200"></el-table-column>
        <el-table-column prop="skuInfo" label="商品规格" width="400"></el-table-column>
        <el-table-column prop="price" label="批发价" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.price }} 元</div>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" align="center"></el-table-column>
        <el-table-column prop="operations" label="操作">
          <template slot-scope="scope">
            <span
              class="edit"
              @click="goodDetail('detail', scope.row)">详情  </span>
            <span
              class="edit"
              @click="goodDetail('quickcam', scope.row)">快照</span>
          </template>
        </el-table-column>
      </el-table>
  </el-dialog>
</template>

<script>
import hTable from 'sub/component/Table'
export default {
  props: {
      orderId: {
      type: String,
      default: null
    }
  },
  components: { hTable },
  data () {
    return {
      dialogVisible: true,
      deliverInfo: {},
      form: {
        company: '',
        name: ''
      }
    }
  },
  mounted () {
    this.$http.get('wholesale/order/queryExpressInfo', {orderId: this.orderId}).then(res => {
      this.deliverInfo = res['data']
    })
  },
  methods: {
    hideExpressModal () {
      this.$emit('hideExpressModal')
    },
    goodDetail (opt, data) {
      if (opt === 'detail') {
        this.$router.push({
          name: 'wholesalegoodsdetail',
          query: {
            productId: data['productId']
          }
        })
      } else {
        this.$router.push({
          name: 'wholesalegoodssnapshot',
          query: {
            subOrderId: data['subOrderId']
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.send-modal{
  display: flex;
  // justify-content: space-around;
  background: #F8F8F8;
}
.expressinfo-box {
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 15px;
}
.expressinfo-box span{
    display: inline-block;
    margin-right: 20px;
    text-align: left;
    font-size: 14px;
    color: #6D6F73;
    &::before{
      display: inline-block;
      vertical-align: middle;
      content: '';
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background: #D8D8D8;;
      margin-right: 6px;
    }
}
.send-person, .recveive-person{
  // width: 215px;
  padding: 10px 50px;
  line-height: 24px;
  font-size: 13px;
  // color: #9B9B9B;
  p {
    display: inline-block;
    margin-right: 100px;
  }
}
.express-list{
  padding-bottom: 34px;
  margin-left: 10px;
  .express-item{
    font-size: 13px;
    color: #9B9B9B;
    line-height: 17px;
    padding-bottom: 24px;
    border-left: 2px solid  #D8D8D8;
    padding-top: 0;
    padding-left: 25px;
    position: relative;
    &::before{
      position: absolute;
      left: -8px;
      top: 0;
      content: '';
      width: 14px;
      height: 14px;
      background: #D8D8D8;
      border-radius: 50%;
    }
    &:nth-last-child(1) {
      border: none;
      padding-bottom: none;
    }
    &:nth-child(1) {
      &::before{
        width: 20px;
        height: 20px;
        left: -11px;
        background: #4A90E2;
      }
    }
  }
}
.no-express-info{
  color: #909399;
}
.icon-list{

}
</style>
