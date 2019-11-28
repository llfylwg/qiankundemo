<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">
      <!-- 顶部tab -->
      <tabs :tabChange="tabChange" :tabs="topTab" @selectTab="selectTab"></tabs>
      <!-- 筛选项 -->
      <h-filter :filter="filter" :tabCode="tabCode" @search="setFilter" ref="hfilter"></h-filter>
    </section>

    <div class="table-box">
      <buttons :buttonDisable="buttonDisable" :filter="filter" :selectList="selectList" :tabCode="tabCode"
               @confirmList="confirmList"
               @exportList="exportList"
               @getList="refreshPage"
               @getTabs="getTabs"
               @handleClickToDetail="handleClickToDetail"
               @offlineSellOrders="offlineSellOrders"
               @onlineSellOrders="onlineSellOrders"
               @payMoneyList="payMoneyList"
               @uploadPrice="uploadPrice"
               @uploadPriceSuccess="uploadPriceSuccess"
      ></buttons>

      <!-- 议价列表提示 -->
      <!-- <rules v-if="tabCode == 4"/> -->

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
        <template slot="price" slot-scope="scope">
          <price :optData="scope.rowData" :orderType="tabs" @handleClickToDetail="handleClickToDetail"
                 @setPriceClick="setPriceClick"></price>
        </template>
        <!-- 操作 -->
        <template slot="opts" slot-scope="scope">
          <opts :optData="scope.rowData" :orderType="tabs" :tabCode="tabCode"
                @handleClickToDetail="handleClickToDetail"></opts>
        </template>
      </h-table>
    </div>
    <!-- 立即报价 -->
    <setPrice :optData="optData" @getList="refreshPage" @modalClose="modalClose" v-if="setPriceVisible"/>

    <!-- 确认回收 -->
    <confirmRecycle :optData="optData" @getList="refreshPage" @modalClose="modalClose" v-if="confirmRecycleVisible"/>

    <!-- 改价弹窗 -->
    <changePrice :optData="optData" @getList="refreshPage" @modalClose="modalClose" v-if="changePriceVisible"/>

    <!-- 打款弹窗 -->
    <payMoney :optData="optData" @getList="refreshPage" @modalClose="modalClose" v-if="payMoneyVisible"/>

    <!-- 导出弹窗 -->
    <exportModal :filter="filter" @modalClose="modalClose" @sureExport="sureExport" v-if="exportModalShow"/>

    <!-- 批量确认订单 -->
    <confirmSelectOrders :selection="selectList" @getList="refreshPage" @modalClose="modalClose"
                         v-if="confirmSelectOrdersVisible"/>

    <!-- 批量打款弹窗 -->
    <paySelectOrder :selection="selectList" @getList="refreshPage" @modalClose="modalClose"
                    v-if="paySelectOrdersVisible"/>
    <!-- 确认收货弹框 -->
    <receipt :optData="optData" @modalClose="modalClose" @sureReceipt="sureReceipt" v-if="showDialogStr === 'receipt'"/>
    <!-- 批量确认收货弹框 -->
    <receiptNotOne :optData="optData" :selectList="selectList" @modalClose="modalClose"
                   @sureReceiptNotOne="sureReceiptNotOne" v-if="showDialogStr === 'receiptNotOne'"/>
    <!-- 查看物流弹框 -->
    <express :orderId="optData['orderId']" @modalClose="modalClose" v-if="showDialogStr === 'getExpressInfo'"/>
    <!-- 选择卖场弹框 -->
    <select-sell :optData="optData" @getList="refreshPage" @getTabs="getTabs" @modalClose="modalClose"
                 v-if="selectSellVisible"/>
    <el-dialog
        :visible.sync="showSettingDialog"
        title="提示"
        width="30%">
      <span>您暂无此类订单哦～</span>
      <span>打开支持质检流程的开关，可以帮助您更好的管理分析您的到货，卖家也可以直接看到您的质检报告</span>
      <span class="dialog-footer" slot="footer">
        <el-button @click="showSettingDialog = false">取 消</el-button>
        <el-button @click="openSetting" type="primary">去打开</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from '../../components/page/recycleorderlist/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'
  import { offlineSell } from '@/assets/js/Api'
  import { selectSell } from '@/assets/js/Api'
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
        listApiName: 'partner/recycle/list',
        setPriceVisible: false,
        confirmRecycleVisible: false,
        changePriceVisible: false,
        payMoneyVisible: false,
        confirmSelectOrdersVisible: false,
        paySelectOrdersVisible: false,
        selectSellVisible: false,
        productId: '',
        tableShow: true,
        selectList: [],
        timer: '',
        exportModalShow: false,
        optData: '',
        tabChange: 0,
        showDialogStr: '',
        showSettingDialog: false
      }
      return data
    },
    computed: {
      buttonDisable () {
        return this.selectList.length ? false : true
      },
      selectOrderIds () {
        let orderIds = ''
        this.selectList.forEach(item => {
          orderIds = orderIds + item.orderId + '|'
        })
        return orderIds.substr(0, orderIds.length - 1)
      }
    },
    created () {
      window.clearInterval(this.timer)
      this.tabCode = this.$route.query['orderType'] || '0'
      this.selectTab(this.tabCode)
      this.getTabs()
    },
    methods: {
      selectFn (row) {
        return row.operations ? row.operations.includes('receipt')
          || row.operations.includes('offlineSell')
          || row.operations.includes('confirmBuying')
          || row.operations.includes('pay') : false
      },
      getSupportQc () {
        this.$http.get('/partner/common/qcSupport').then(res => {
          this.showSettingDialog = !res.data
        })
      },
      getTabs () {
        this.$http.get('/partner/recycle/tabs').then(res => {
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
        // 所有弹窗关闭
        Object.assign(this.$data, {
          showSettingDialog: false,
          setPriceVisible: false,
          confirmRecycleVisible: false,
          changePriceVisible: false,
          payMoneyVisible: false,
          exportModalShow: false,
          confirmSelectOrdersVisible: false,
          paySelectOrdersVisible: false,
          selectSellVisible: false
        })
      },
      offlineSellOrders () {
        this.offlineSellAct(this.selectList)
      },
      onlineSellOrders () {
        this.$confirm('确认在转转卖场售卖？', '确认信息', {
          confirmButxt: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          const orderIds = this.selectList.map(order => order.orderId).join('|')
          this.$http.post('/partner/recycle/onlinesell', {orderIds: orderIds}).then(resp => {
            const {code, data} = resp
            if (code == 0 && data.status == 0) {
              this.$message.success('成功')
              this.getList()
            }
          })
        })
      },
      uploadPrice (file) {
        console.log('uploadPrice: ', file)
      },
      uploadPriceSuccess (response, file, fileList) {
        console.log('uploadPriceSuccess: ', response, file, fileList)
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.refreshPage()
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
      setPriceClick (data) {
        this.optData = data
        this.setPriceVisible = true
      },
      exportList () {
        // 导出弹窗提示
        this.exportModalShow = true
      },
      sureExport () {
        this.exportModalShow = false
      },
      confirmList () {
        this.confirmSelectOrdersVisible = true
      },
      payMoneyList () {
        this.paySelectOrdersVisible = true
      },
      handleClickToDetail (data, {code}) {
        const {offlineSellAct} = this
        const _this = this
        const handlerMap = {
          'qcReceipt': () => {
            window.open('https://youpinoffice.zhuanzhuan.com/qc/receive')
          },
          'qcCheck': () => {
            window.open('https://youpinoffice.zhuanzhuan.com/qc/zj')
          },
          // 订单详情
          'orderDetail': () => {
            this.$router.push({
              name: 'recycleOrderDetail',
              query: {orderId: data['orderId']}
            })
          },
          // 第二次出价 就是 改价
          'secondOffer': () => {
            this.$router.push({
              name: 'recycleOrderDetail',
              query: {orderId: data['orderId']}
            })
          },
          // 首次报价
          'firstOffer': () => {
            this.optData = data
            this.setPriceVisible = true
          },
          // 打款
          'pay': () => {
            this.optData = data
            this.payMoneyVisible = true
          },
          // 确认购买
          'confirmBuying': () => {
            this.optData = data
            this.confirmRecycleVisible = true
          },
          // ---以下是新增---
          // 跳到退货管理页面
          'returnManage': () => {
            this.$router.push({
              name: 'recycleReturnManager',
              query: {orderId: data['orderId']}
            })
          },
          // 确认收货
          'receipt': () => {
            this.optData = data
            this.showDialogStr = 'receipt'
          },
          'receiptNotOne': () => {
            this.showDialogStr = 'receiptNotOne'
          },
          // 查看物流
          'getExpressInfo': () => {
            this.optData = data
            this.showDialogStr = 'getExpressInfo'
          },
          // 线下卖出
          offlineSell () {
            // this.offlineSellVisible = true
            offlineSellAct([data])
          },
          // 选择卖场
          selectSell: () => {
            this.$confirm('确认在转转卖场售卖？', '确认信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              selectSell({orderId: data.orderId}).then(resp => {
                const {code, data} = resp
                if (code == 0 && data.status == 0) {
                  this.$message({
                    message: '成功',
                    type: 'success'
                  })
                }
                this.getList()
              })
            })
          }
        }
        handlerMap[code] && handlerMap[code]()
      },
      offlineSellAct (list) {
        const msg = '选择线下卖出后将无法再重新选择转转卖场售卖，是否确定线下已卖出？'
        return this.$confirm(msg, '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          const orderIds = list.map(order => order.orderId).join('|')
          return offlineSell({orderIds})
        }).then(resp => {
          const {data, code} = resp
          if (code == 0 && data.status == 0) {
            this.refreshPage()
            this.getTabs()
            return this.$message({
              message: '确认成功',
              type: 'success'
            })
          }
        }).catch(() => {})
      },
      getList () {
        this.listData = []
        this.filter.pageNum = this.pageData.page
        this.filter.pageSize = this.pageData.size
        this.changeUrl()
        let a = this.listApiName
        this.isLoading = true
        this.$http.get(this.listApiName, this.filter).then(res => {
          if (a === this.listApiName) {
            // 这个判断需要优化
            this.listData = res.data
            this.total = res.rows
            this.isLoading = false
          } else {
            console.log('已经不是当前页面请求了')
          }
          if (this.tabCode == 60 && !this.listData.length) {
            this.getSupportQc()
          }
        })
      },
      openSetting () {
        this.showSettingDialog = false
        window.open('https://youpinoffice.zhuanzhuan.com/bm-manage/recycleSetting')
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
