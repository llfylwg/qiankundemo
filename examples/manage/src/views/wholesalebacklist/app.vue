<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">
      <!-- 筛选项 -->
      <h-filter @search="setFilter" :tabCode="tabCode" ref="hfilter"></h-filter>
    </section>

    <div class="table-box">

      <!-- 列表 -->
      <h-table
        :listData="listData"
        :listProps="listProps"
        :pageData="pageData"
        :total="total"
        :listOPs="listOPs"
        size="mini"
        @onSize="handleSizeChange"
        @onCurrent="handleCurrentChange" v-if="tableShow">

        <template slot="gradeName" >
          <span>等级
            <i class="iconfont icon-wenhao nav-icon" @click="seeGrade"></i>
          </span>
        </template> 

        <!-- 订单明细-->
      <template slot="batchDetail" slot-scope="scope">
        <batchDetail :optData="scope.rowData" ></batchDetail>
      </template>

      <!-- 退款倒计时 -->
      <template slot="refundCountDown" slot-scope="scope">
        <countTime :optData="scope.rowData"></countTime>
      </template>
      

        <!-- 买家昵称-->
      <template slot="buyerNickName" slot-scope="scope">
        <buyer :optData="scope.rowData" ></buyer>
      </template>

      <!-- 应付款 -->
      <template slot="realPrice" slot-scope="scope">
        <realPrice :optData="scope.rowData" ></realPrice>
      </template>

      <!-- 操作 -->
      <template slot="opts" slot-scope="scope">
        <opts :optData="scope.rowData" @handleClickToDetail="handleClickToDetail" :tabCode="tabCode"></opts>
      </template>

      </h-table>
    </div>
    <!-- 同意退款 -->
    <agreeRefund v-if="agreeRefundShow" @modalClose="modalClose" :optData="optData" @getList="getList"></agreeRefund>
    <!-- 发货弹窗 -->
    <sendShip v-if="showSendShipModal" :orderId="optData['orderId']" @modalClose="modalClose" @getList="getList"></sendShip>
    <!-- 更改价格 -->
    <!-- <changePriceModal v-if="changepriceModalShow" @modalClose="modalClose" @getList="getList" :setPriceType="setPriceType" :currentPrice="currentPrice" :productId="productId"></changePriceModal> -->
    <!-- 导出弹窗 -->
    <!-- <exportModal v-if="exportModalShow" @modalClose="modalClose" @sureExport="sureExport"></exportModal> -->
    <!-- 批量定价导出 -->
    <!-- <exportPriceModal v-if="exportPriceModalShow" @modalClose="modalClose" @sureExportPriceList="sureExportPriceList"></exportPriceModal> -->
    <!-- 下架提示 -->
    <!-- <soldOut v-if="soldOutShow" @modalClose="modalClose" @getList="getList" :optData="optData"></soldOut> -->
    <!-- 查看详情旁边的问号弹窗 -->
    <!-- <infoDetailModal v-if="infoDetailModalShow" @modalClose="modalClose"></infoDetailModal> -->
    <!-- 选择卖场弹窗 -->
    <!-- <selectMark v-if="selectMarkShow" @modalClose="modalClose" @getList="getList" :optData="optData"></selectMark> -->
    <!-- 退回提示 -->
    <!-- <returnGood v-if="returnGoodShow" @modalClose="modalClose" @getList="getList" :optData="optData"></returnGood> -->
    <!-- 批量上架提示 -->
    <!-- <batchSale v-if="batchSaleShow" @modalClose="modalClose" @getList="getList"></batchSale> -->
    <!-- 上架失败提示 -->
    <!-- <salefail v-if="salefailShow" @modalClose="modalClose"></salefail> -->
    <!-- 待议价批量同意弹窗 -->
    <!-- <batchAgree v-if="batchAgreeShow" @modalClose="modalClose" @getList="getList" :optData="optData" /> -->
    <!-- 待议价批量拒绝弹窗 -->
    <!-- <batchReject v-if="batchRejectShow" @modalClose="modalClose" @getList="getList" :optData="optData" /> -->
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from '../../components/page/wholesalebacklist/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'
  export default {
    components: {
      hTable
    },
    mixins: [mixin, componentsMixins],
    data () {
      let data = {
        tabCode: null, // 上部button选项
        listProps: tabCofigData['allData'],
        listOPs: tabCofigData['allOpts'],
        listApiName: 'wholesale/order/list?status=6',
        productId: '',
        tableShow: true,
        selectList: [],
        timer: '',
        optData: '',
        agreeRefundShow: false,
        showSendShipModal: false
      }
      return data
    },
    computed: {
      buttonDisable () {
        return this.selectList.length ? false : true
      }
    },
    created () {
    },
    methods: {
      modalClose () {
        // 所有弹窗关闭
        Object.assign(this.$data, {
          agreeRefundShow: false,
          showSendShipModal: false
        })
      },
      applyReturn () {
        // 批量退回
        this.returnGoodShow = true
        this.optData = this.selectList
      },
      batchPutToMart () {
        //  批量上架
        this.selectMarkShow = true
        this.optData = this.selectList
      },
      batchWithdrawFromMart () {
        // 批量下架弹窗展示
        this.optData = this.selectList
        this.soldOutShow = true
      },
      batchAgree () {
        // 暗拍议价批量同意 弹窗展现
        this.optData = this.selectList
        this.batchAgreeShow = true
      },
      batchReject () {
        // 暗拍议价批量拒绝 弹窗展现
        this.optData = this.selectList
        this.batchRejectShow = true
      },
      exportData () {
        // 导出弹窗提示
        this.exportModalShow = true
      },
      exportPriceList () {
        // 导出定价
        this.exportPriceModalShow = true
      },
      sureExportPriceList () {
        // 确认批量导出定价
        const keys = Object.keys(this.filter)
        let str = ''
        keys.map(item => {
          str += `${item}=${this.filter[item]}&`
        })
        this.exportPriceModalShow = false
        window.location.href = '//ypwork.zhuanzhuan.com/ypee/bizProduct/export/pricingList?' + str
      },
      sureExport () {
        // 点击弹窗确认导出
        const keys = Object.keys(this.filter)
        let str = ''
        keys.map(item => {
          str += `${item}=${this.filter[item]}&`
          // item + this.filter[item] + '&'
        })
        this.exportModalShow = false
        window.location.href = '//ypwork.zhuanzhuan.com/ypee/bizProduct/export/list?' + str
      },
      handleClickToDetail (data, {code}) {
        // 操作区域选项点击
        if (code === 'detail') {
          // return this.$router.push({
          //   name: 'wholesalebackdetail',
          //   query: {orderId: data['orderId']}
          // })
          return this.$router.push({
            name: 'wholesaleorderdetail',
            query: {orderId: data['orderId']}
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
          this.agreeRefundShow = true
        }
      },
      seeGrade () {
        // 等级说明icon
        window.open('https://zzwos.58cdn.com.cn/GlEdCbAZyGj/youpinfe001/yp_1d0o9benfdm418rpj9dgid1q4b0.pdf')
      },
      seeFineness () {
        // 成色说明icon
        window.open('https://zzwos.58cdn.com.cn/GlEdCbAZyGj/youpinfe001/yp_1d0o97ufi1lgnga8nho1nhg1d2l0.pdf')
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
