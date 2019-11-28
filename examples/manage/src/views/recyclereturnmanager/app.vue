<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">

      <!-- 顶部tab -->
      <tabs :tabChange="tabChange" :tabs="topTab" @selectTab="selectTab"></tabs>

      <!-- 筛选项 -->
      <h-filter :filter="filter" :tabCode="tabCode" @exportList="exportList" @search="setFilter"
                ref="hfilter"></h-filter>
    </section>

    <div class="table-box">
      <buttons :buttonDisable="buttonDisable" :selectList="selectList" :tabCode="tabCode"
               @getList="refreshPage"
               @showPiliangFaHuo="showPiliangFaHuo"
               @showPiliangMianJiao="showPiliangMianJiao"
      ></buttons>

      <!-- 列表 -->
      <h-table
          :isLoading="isLoading"
          :listData="listData"
          :listOPs="listOPs"
          :listProps="listProps"
          :pageData="pageData"
          :selectFn="selectFn"
          :selection="true"
          :total="total"
          @onCurrent="handleCurrentChange"
          @onSelect="onSelect"
          @onSize="handleSizeChange"
          size="mini" v-if="tableShow">

        <!-- 回收价格 -->
        <!-- <template slot="price" slot-scope="scope">
          <price :optData="scope.rowData" :orderType="tabs" @setPriceClick="setPriceClick"></price>
        </template> -->
        <!-- 操作 -->
        <template slot="opts" slot-scope="scope">
          <opts :optData="scope.rowData" :orderType="tabs" :tabCode="tabCode"
                @handleClickToDetail="handleClickToDetail"></opts>
        </template>
      </h-table>
    </div>
    <!-- 导出弹窗 -->
    <exportModal :filter="filter" @modalClose="modalClose" @sureExport="sureExport" v-if="exportModalShow"/>
    <!-- 面交发货弹框 -->
    <facereturn :optData="optData" @modalClose="modalClose" @sureFaceReturn="sureFaceReturn"
                v-if="showDialogStr === 'deliverFaceToFaceReturns'"/>
    <!-- 发货弹框 -->
    <sendship :isPiLiangFahuo="isPiLiangFahuo" :optData="optData" :selectList="selectList"
              @modalClose="modalClose" @sureReturn="sureReturn" v-if="showDialogStr === 'deliverReturns'"/>
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from '../../components/page/recyclereturnmanager/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'

  export default {
    components: {
      hTable
    },
    mixins: [mixin, componentsMixins],
    data () {
      let data = {
        tabs: tabCofigData['orderType'],
        topTab: [],
        tabCode: '0', // 上部button选项
        count: [],
        listProps: tabCofigData['allData'],
        listOPs: tabCofigData['allOpts'],
        listApiName: '/partner/recycle/returns/list',
        productId: '',
        tableShow: true,
        selectList: [],
        timer: '',
        exportModalShow: false,
        optData: '',
        tabChange: 0,
        showDialogStr: '',
        isPiLiangFahuo: false,
        isPiliangMianjiao: false
      }
      return data
    },
    computed: {
      buttonDisable () {
        return this.selectList.length ? false : true
      },
      selectReturnOrderId () {
        let orderIds = ''
        this.selectList.forEach(item => {
          orderIds = orderIds + item.returnOrderId + '|'
        })
        return orderIds.substr(0, orderIds.length - 1)
      }
    },
    created () {
      window.clearInterval(this.timer)
      this.tabCode = this.$route.query['status'] || '0'
      this.selectTab(this.tabCode)
      this.getTabs()
    },
    methods: {
      selectFn (row) {
        return row.operations.includes('deliverFaceToFaceReturns')
          || row.operations.includes('deliverReturns')
      },
      getTabs () {
        this.$http.get('/partner/recycle/returns/tabs').then(res => {
          this.topTab = res.data
          this.topTab.unshift({
            'code': 0,
            'desc': '全部'
          })
        })
      },
      refreshPage (form) {
        this.getList()
        this.tabChange += 1
      },
      modalClose () {
        this.showDialogStr = ''
      },
      sureReturn (expressInfo) {
        if (expressInfo && expressInfo.expressCompany === '' || expressInfo.expressNum === '') {
          this.$message({
            message: '请填写快递物流公司和单号',
            type: 'error'
          })
          return
        }
        let returnOrderId = this.isPiLiangFahuo ? this.selectReturnOrderId : this.optData.returnOrderId
        this.$http.get('/partner/recycle/returns/deliver', {
          returnOrderIds: returnOrderId,
          deliverType: 1,
          expressCompany: expressInfo.expressCompany,
          expressNum: expressInfo.expressNum
        }).then(res => {
          const {code, data, msg} = res
          if (code == 0) {
            this.$message({
              message: msg,
              type: 'success'
            })
          }
          this.showDialogStr = ''
          this.refreshPage()
        }).catch(e => {
          this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
          })
          this.showDialogStr = ''
        })
      },
      sureFaceReturn () {
        let returnOrderId = this.isPiliangMianjiao ? this.selectReturnOrderId : this.optData.returnOrderId
        this.$http.get('/partner/recycle/returns/deliver', {
          returnOrderIds: returnOrderId,
          deliverType: 2
        }).then(res => {
          const {code, data, msg} = res
          if (code == 0) {
            this.$message({
              message: msg,
              type: 'success'
            })
          }
          this.showDialogStr = ''
          this.refreshPage()
        }).catch(e => {
          this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
          })
          this.showDialogStr = ''
        })
      },
      sureReceipt () {
        const {orderId} = this.optData
        this.$http.get('/partner/recycle/receipt', {
          orderIds: orderId
        }).then(res => {
          const {code, data} = res
          if (code == 0) {
            this.$message({
              message: '确认收货成功',
              type: 'success'
            })
          }
          this.showDialogStr = ''
          this.refreshPage()
        }).catch(e => {
          this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
          })
          this.showDialogStr = ''
        })
      },
      sureReceiptNotOne () {
        this.$http.get('/partner/recycle/receipt', {
          orderIds: this.selectOrderIds
        }).then(res => {
          const {code, data} = res
          if (code == 0) {
            this.$message({
              message: '确认收货成功',
              type: 'success'
            })
          }
        }).catch(e => {
          this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
          })
          this.showDialogStr = ''
        })
      },
      setPriceClick (data) {

      },
      exportList () {
        // 导出弹窗提示
        this.exportModalShow = true
      },
      sureExport () {
        this.exportModalShow = false
      },
      handleClickToDetail (data, {code}) {
        const handlerMap = {
          // 订单详情
          'orderDetail': () => {
            this.$router.push({
              name: 'recycleOrderDetail',
              query: {orderId: data.orderId, returnOrderId: data.returnOrderId}
            })
          },
          'deliverFaceToFaceReturns': () => {
            this.optData = data
            this.showDialogStr = 'deliverFaceToFaceReturns'
          },
          'deliverReturns': () => {
            this.optData = data
            this.showDialogStr = 'deliverReturns'
          },
          'qcReturn': () => {
            window.open('https://youpinoffice.zhuanzhuan.com/qc/stock-out/send-confirm')
          }
        }
        handlerMap[code] && handlerMap[code]()
      },
      showPiliangFaHuo () {
        this.isPiLiangFahuo = true
        this.showDialogStr = 'deliverReturns'
      },
      showPiliangMianJiao () {
        this.isPiliangMianjiao = true
        this.showDialogStr = 'deliverFaceToFaceReturns'
      },
      selectTab (i) {
        console.log(i)
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
      onSelect (n) {
        // 多选选中事件
        console.log('onSelect: ', n)
        this.selectList = n
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goodslist-wrap {
    width: 100%;
    background: #F8F8F8;
    // overflow-x: auto;
  }

  .head-box {
    padding: 20px 24px 0;
    box-sizing: border-box;
    background: #FFF;
  }

  .split-line {
    line-height: 1px;
    height: 1px;
    margin: 10px 0;
    border-bottom: 0.1rem solid rgba(221, 221, 221, 0.8);
  }

  .link {
    color: #409EFF;
  }

  .tips-icon {
    display: inline-block;
    height: 100%;
    margin-left: 0;
  }

  .nav-icon {
    cursor: pointer;
    font-size: 10px;
  }

  .detail-icon {
    color: #909399;
  }

  .tip-content-box {
    background: red;
  }

  .table-box {
    background: #FFF;
    margin: 16px 16px 0;
    padding: 24px 32px 18px;
    // height: 100vh;
  }
</style>
<style lang="scss">
  .el-tooltip__popper.is-light {
    border-color: #909399 !important;
  }
</style>
