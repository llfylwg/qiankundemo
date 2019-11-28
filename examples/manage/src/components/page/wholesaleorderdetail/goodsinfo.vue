<template>
  <div class="goods-info-wrap">
    <p class="detail-title">订单详情</p>
    <el-card class="box-card" >
      <div class="detail-box">
        <stateBar :process="detailData['process']"></stateBar>
      </div>
    </el-card>

    <currentInfo :info="detailData" v-if="detailData" @buttonclick="opt" @refresh="getDetail"></currentInfo>

    <!-- 子订单信息列表 -->
     <div class="table-box">
       <h-table
         :listData="listData"
         :listProps="listProps"
         :pageData="pageData"
         :total="total"
         :listOPs="listOPs"
         size="mini">
         <template slot="price" slot-scope="scope">
          <div>{{ scope.rowData.price }}元</div>
         </template>
         <template slot="opts" slot-scope="scope">
           <!-- 操作 -->
           <p>
             <el-button type="text" @click="goodDetail('detail', scope.rowData)">详情</el-button>
             <el-button type="text" @click="goodDetail('quickcam', scope.rowData)">快照</el-button>
           </p>
         </template>
       </h-table>
     </div>


    <!-- 取消订单 -->
   <cancelOrder v-if="cancelOrderShow" @modalClose="modalClose" :optData="detailData" @getList="getDetail"></cancelOrder>
    <!-- 发货弹窗 -->
    <sendShip v-if="showSendShipModal" :orderId="detailData['orderId']" @modalClose="modalClose" @getList="getDetail"></sendShip>
  </div>
</template>

<script>
  import stateBar from './stateBar'
  import currentInfo from './currentinfo'
  import sendShip from './sendship'
  import cancelOrder from './cancelorder'
  import hTable from 'sub/component/Table'
  import mixin from '../../tableMixin.js'
  export default {
    data () {
      return {
        detailData: '',
        showReport: false,
        cancelOrderShow: false,
        showSendShipModal: false,
        listProps:[
          {
            prop: 'productId',
            label: '商品id'
          },
          // {
          //   prop: 'orderId',
          //   label: '子订单id'
          // },
          {
            prop: 'skuInfo',
            label: '商品信息'
          },
          {
            prop: 'count',
            label: '数量'
          },
        ],
        listOPs: [
          {
            name: 'price',
            label: '批发价'
          },
          {
            name: 'opts',
            label: '操作'
          }
        ]
      }
    },
    mixins: [mixin],
    components: {
      stateBar,
      currentInfo,
      cancelOrder,
      sendShip,
      hTable
    },
    created () {
      this.orderId = this.$route.query['orderId']
      this.getDetail()
    },
    methods: {
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
      getDetail () {
        this.$http.get('wholesale/order/detail', {orderId: this.orderId}).then(res => {
          this.detailData = res['data']
          this.listData = res['data']['items']
        })
      },
      modalClose () {
        Object.assign(this.$data, {
          showSendShipModal: false,
          cancelOrderShow: false
        })
      },
      opt (optCode) {
        if (optCode === 'cancel') {
          this.cancelOrderShow = true
        } else if (optCode === 'sendship') {
          this.showSendShipModal = true
        } else if (optCode === 'backdetail') {
          // console.log('backdetail', optCode, this.orderId);
          this.$router.push({
            name: 'wholesalebackdetail',
            query: {
              orderId: this.orderId
            }
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.quickPic-tip{
  text-align: center;
  font-size: 14px;
  color: #FF8A00;
  background: #FDF1C6;
  height: 48px;
  line-height: 48px;
  .icon-dengpao{
    color: #FF8A00;
    font-size: 16px;
  }
}
.table-box{
  margin: 14px;
}
.text.item {
  display: inline-block;
  width: 30%;
  text-align: left;
  font-size: 14px;
}
.box-card{
  margin: 14px;
  // margin-bottom: 100px;
}
.detail-title{
  font-weight: bold;
  width: 100%;
  background: #FFF;
  padding: 28px 32px 30px;
  font-size: 16px;
  color: #2E3135;
}
.card-title{
  display: block;
  padding: 15px 0 10px;
  font-size: 14px;
  color: #6D6F73;
  font-size: 16px;
}
.item-box{
  padding: 0 20px 10px;
  border-bottom: 1px solid #E7E7E7;
  line-height: 32px;
  font-size: 14px;
  color: #6D6F73;
  &:nth-last-child(1) {
    border-bottom: none;
  }
}
.see-report{
  float: right;
}
.promise-text{
  margin-right: 8px;
}
.promise-xuanzhong{
  color: #4A90E2;
  font-weight: bold;
  font-size: 10px;
  margin-right: 5px;
}
.piclist-box{
  vertical-align: top;
  text-align: left;
  span{
    display: inline-block;
    vertical-align: top;

  }
  img{
    display: inline-block;
    width: 160px;
    height: 147px;
    margin-right: 16px;
  }
}
</style>
<style  lang="scss">
  .goods-info-wrap .el-card__header{
    background: #FFF;
  }
  .goods-info-wrap .el-card {
  }
  .goods-info-wrap .el-card__body{
    padding-left: 0!important;
    padding-right: 0!important;
    padding-top: 0!important;
  }
</style>
