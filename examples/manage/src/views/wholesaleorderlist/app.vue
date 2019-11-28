<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">

      <!-- 顶部tab -->
      <tabs @selectTab="selectTab"></tabs>

      <!-- 筛选项 -->
      <h-filter @search="setFilter" :tabCode="tabCode" ref="hfilter"></h-filter>
    </section>

    <div class="table-box">
      <buttons :tabCode="tabCode" :buttonDisable="buttonDisable" :selectList="selectList"
      @cancelOrder="cancelOrder"
      @exportList="exportList"
      @batchFreeShip="batchFreeShip"
      @getList="getList"
      ></buttons>

      <!-- 议价列表提示 -->
      <!-- <rules v-if="tabCode == 4"/> -->

      <!-- 列表 -->
      <h-table
        :isLoading="isLoading"
        :listData="listData"
        :listProps="listProps"
        :pageData="pageData"
        :total="total"
        :listOPs="listOPs"
        size="mini"
        :selection="true"
        @onSize="handleSizeChange"
        @onSelect="onSelect"
        @onCurrent="handleCurrentChange" v-if="tableShow">


        <!-- 订单明细-->
        <template slot="batchDetail" slot-scope="scope">
          <batchDetail :optData="scope.rowData" ></batchDetail>
        </template>
        <!-- 买家昵称-->
        <template slot="buyerNickName" slot-scope="scope">
          <buyer :optData="scope.rowData" ></buyer>
        </template>

        <!-- 应付款 -->
        <template slot="realPrice" slot-scope="scope">
          <realPrice :optData="scope.rowData" ></realPrice>
        </template>

        <!-- 议价倒计时 -->
        <template slot="time" slot-scope="scope">
          <cutdown :timeRemaining="scope.rowData['timeRemaining']" @getList="getList"></cutdown>
        </template>

        <template slot="opts" slot-scope="scope">
          <!-- 操作 -->
          <opts :optData="scope.rowData" @handleClickToDetail="handleClickToDetail" :tabCode="tabCode"></opts>
        </template>


      </h-table>
    </div>
    <!-- 取消订单 -->
   <cancelOrder v-if="cancelOrderShow" @modalClose="modalClose" :optData="optData" @getList="getList"></cancelOrder>

   <!-- 免运费 -->
   <freeShip v-if="freeShipShow" @modalClose="modalClose" :optData="optData" ></freeShip>

    <changePrice :currentPrice="optData['totalPrice']" :id="optData['orderId']" v-if="changePriceShow" @modalClose="modalClose" @getList="getList"></changePrice>

    <!-- 发货弹窗 -->
    <sendShip v-if="showSendShipModal" :orderId="optData['orderId']" @modalClose="modalClose" @getList="getList"></sendShip>
    <!-- 物流信息 -->
    <expressInfo v-if="showExpressInfoModal" @hideExpressModal="modalClose" :orderId="optData['orderId']"></expressInfo>
    <!-- 导出弹窗 -->
    <exportModal v-if="exportModalShow" @modalClose="modalClose" @sureExport="sureExport"></exportModal>
    <!-- 同意退款 -->
    <agreeRefund v-if="agreeRefundShow" @modalClose="modalClose" :optData="optData" @getList="getList"></agreeRefund>
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from '../../components/page/wholesaleorderlist/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'
  export default {
    components: {
      hTable
    },
    mixins: [mixin, componentsMixins],
    data () {
      let data = {
        tabCode: '1', // 上部button选项
        listProps: tabCofigData['allData'],
        listOPs: tabCofigData['allOpts'],
        listApiName: 'wholesale/order/list',
        productId: '',
        tableShow: true,
        selectList: [],
        timer: '',
        cancelOrderShow: false,
        freeShipShow: false,
        changePriceShow: false,
        exportModalShow: false,
        showSendShipModal: false,
        optData: '',
        showExpressInfoModal: false,
        agreeRefundShow: false
      }
      return data
    },
    computed: {
      buttonDisable () {
        return this.selectList.length ? false : true
      }
    },
    created () {
      window.clearInterval(this.timer)
      // const tabCode = this.$route.query['tabCode'] || '1'
      this.selectTab('1')
    },
    methods: {
      modalClose () {
        // 所有弹窗关闭
        Object.assign(this.$data, {
          changepriceModalShow: false,
          exportModalShow: false,
          cancelOrderShow: false,
          freeShipShow: false,
          changePriceShow: false,
          showSendShipModal: false,
          showExpressInfoModal: false,
          agreeRefundShow: false
        })
      },
      cancelOrder () {
        // 批量取消
        this.cancelOrderShow = true
        this.optData = this.selectList
      },
      exportList () {
        // 导出弹窗提示
        this.exportModalShow = true
      },
      batchFreeShip () {
        // 批量取消
        this.optData = this.selectList
        this.freeShipShow = true
      },
      sureExport () {
        // 点击弹窗确认导出
        const keys = Object.keys(this.filter)
        let str = ''
        console.log(this.filter)
        keys.map(item => {
          str += `${item}=${this.filter[item]}&`
          // item + this.filter[item] + '&'
        })
        this.exportModalShow = false
        window.location.href = '//ypwork.zhuanzhuan.com/ypee/wholesale/order/exportExcel?' + str
      },
      handleClickToDetail (data, {code}) {
        // 操作区域选项点击
        if (code === 'detail') {
          return this.$router.push({
            name: 'wholesaleorderdetail',
            query: {orderId: data['orderId']}
          })
        }
        if (code === 'deliverFaceToFace') {
          return this.$confirm('面交发货后，无法再次填写物流，请确认已与买家协商一致当面交易，是否确认面交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.get('/wholesale/order/deliverFaceToFace', {
              orderIds: data.orderId
            }).then(res => {
              this.$message({
                type: 'success',
                message: '发货成功'
              })
              this.getList()
            })
          })
        }
        if (code === 'refundDetail') {
          return this.$router.push({
            name: 'wholesalebackdetail',
            query: {
              orderId: data['orderId']
            }
          })
        }
        this.optData = data
        if (code === 'viewExpress') {
          // 查看物流
          return this.showExpressInfoModal = true
        }
        if (code === 'deliver' || code === 'alreadyDeliver') {
          // 发货
          return this.showSendShipModal = true
        }
        if (code === 'cancel') {
          // 取消订单
          return this.cancelOrderShow = true
        }
        if (code === 'modifyPrice') {
          // 改价
          return this.changePriceShow = true
        }
        if (code === 'modifyFreight') {
          // 免运费
          return this.freeShipShow = true
        }
        if (code === 'agreeRefound') {
          return this.agreeRefundShow = true
        }
      },
      selectTab (i) {
        if (this.tabCode === i) return
        this.tabCode = i
        this.listData = []
        window.clearInterval(this.timer)
        this.tableShow = false
        this.$nextTick(() => {
          // 让表格重新渲染
          this.tableShow = true
          this.selectList = []
        })
      },
      priceChange (type, price, productId) {
        // 点击修改价格事件
        this.currentPrice = price
        this.setPriceType = type
        this.changepriceModalShow = true
        this.productId = productId
      },
      onSelect (n) {
        // 多选选中事件
        this.selectList = n
      }
    }
  }
</script>

<style lang="scss" scoped>
    .goodslist-wrap{
      width: 100%;
      background: #F8F8F8;
      // overflow-x: auto;
    }
    .head-box{
      padding: 20px 24px 0;
      box-sizing: border-box;
      background: #FFF;
    }
  .split-line {
    line-height: 1px;
    height: 1px;
    margin: 10px 0;
    border-bottom:0.1rem solid rgba(221,221,221,0.8);
  }
  .link {
    color: #409EFF;
  }
  .tips-icon{
    display: inline-block;
    height: 100%;
    margin-left: 0;
  }
  .nav-icon{
    cursor: pointer;
    font-size: 10px;
  }
  .detail-icon{
    color: #909399;
  }
  .tip-content-box{
    background: red;
  }
  .table-box{
    background: #FFF;
    margin: 16px 16px 0;
    padding: 24px 32px 18px;
    // height: 100vh;
  }
</style>
<style lang="scss">
  .el-tooltip__popper.is-light{
    border-color: #909399!important;
  }
</style>
