<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">

      <!-- 顶部tab -->
      <tabs :activeTab="tabCode" :outerChange="outerChange" @selectTab="selectTab"></tabs>

      <!-- 筛选项 -->
      <h-filter :b2bGradesList="b2bGradesList" :tabCode="tabCode" @search="setFilter" ref="hfilter"></h-filter>
    </section>

    <div class="table-box">
      <buttons :buttonDisable="buttonDisable" :selectList="selectList" :tabCode="tabCode"
               @applyReturn="applyReturn"
               @batchAgree="batchAgree" @batchPutToMart="batchPutToMart"
               @batchReject="batchReject"
               @batchWithdrawFromMart="batchWithdrawFromMart"
               @exportData="exportData"
               @exportPriceList="exportPriceList"
               @getList="getList"
      ></buttons>

      <!-- 议价列表提示 -->
      <rules v-if="tabCode == 4"/>

      <!-- 列表 -->
      <h-table
          :listData="listData"
          :listOPs="listOPs"
          :listProps="listProps"
          :pageData="pageData"
          :selection="selection"
          :total="total"
          @onCurrent="handleCurrentChange"
          @onSelect="onSelect"
          @onSize="handleSizeChange"
          size="mini" v-if="tableShow">

        <template slot="b2bGradeName" slot-scope="scope">
          <b2bGrade :opt-data="scope.rowData" @change="b2bGradeChange(scope.rowData.id)"></b2bGrade>
        </template>

        <!-- 竞拍价 一口价 保底价 三列 -->
        <template :slot="item" slot-scope="scope"
                  v-for="item in ['martAuctionPrice', 'martInspectPrice', 'martFlootPrice']">
          <pricesOpt :optData="scope.rowData" :priceSlot="item" @priceChange="priceChange"></pricesOpt>
        </template>

        <!-- 参加活动列-->
        <template slot="activity" slot-scope="scope">
          <take-part-in-activity :optData="scope.rowData"></take-part-in-activity>
        </template>

        <!-- 卖场/价格 列-->
        <template slot="auctionPrice" slot-scope="scope">
          <auctionPrice :optData="scope.rowData" @priceChange="priceChange"></auctionPrice>
        </template>

        <!-- 议价倒计时 -->
        <template slot="time" slot-scope="scope">
          <cutdown :timeRemaining="scope.rowData['timeRemaining']" @getList="getList"></cutdown>
        </template>

        <template slot="opts" slot-scope="scope">
          <!-- 操作 -->
          <opts :optData="scope.rowData" :tabCode="tabCode" @handleClickToDetail="handleClickToDetail"></opts>
        </template>


      </h-table>
    </div>
    <!-- 更改价格 -->
    <changePriceModal :currentPrice="currentPrice" :productId="productId" :setPriceType="setPriceType"
                      @getList="getList" @modalClose="modalClose"
                      v-if="changepriceModalShow"></changePriceModal>
    <!-- 导出弹窗 -->
    <exportModal @modalClose="modalClose" @sureExport="sureExport" v-if="exportModalShow"></exportModal>
    <!-- 批量定价导出 -->
    <exportPriceModal @modalClose="modalClose" @sureExportPriceList="sureExportPriceList"
                      v-if="exportPriceModalShow"></exportPriceModal>
    <!-- 下架提示 -->
    <soldOut :optData="optData" @getList="getList" @modalClose="modalClose" v-if="soldOutShow"></soldOut>
    <!-- 查看详情旁边的问号弹窗 -->
    <infoDetailModal @modalClose="modalClose" v-if="infoDetailModalShow"></infoDetailModal>
    <!--b2b等级弹窗-->
    <b2bGradeModal :productId="productId" :list="b2bGradesList" @getList="getList" @modalClose="modalClose" v-if="b2bGradeModalShow"></b2bGradeModal>
    <!-- 选择卖场弹窗 -->
    <selectMark :optData="optData" @getList="getList" @modalClose="modalClose" @showSecondQuality="showSecondQuality" v-if="selectMarkShow"></selectMark>
    <!-- 命中二次质检弹窗 -->
    <secondQuality :secondDatas="secondQualityDatas" @modalClose="modalClose" @changeTab="changeTab" v-if="secondQualityShow && secondQualityDatas"></secondQuality>
    <!-- 批量命中二次质检弹窗 -->
    <multiQuality :secondDatas="secondQualityDatas" @modalClose="modalClose" @changeTab="changeTab" v-if="multiQualityShow && secondQualityDatas"></multiQuality>

    <!-- 退回提示 -->
    <returnGood :optData="optData" @getList="getList" @modalClose="modalClose" v-if="returnGoodShow"></returnGood>
    <!-- 批量上架提示 -->
    <batchSale @getList="getList" @modalClose="modalClose" v-if="batchSaleShow"></batchSale>
    <!-- 上架失败提示 -->
    <salefail @modalClose="modalClose" v-if="salefailShow"></salefail>
    <!-- 待议价批量同意弹窗 -->
    <batchAgree :optData="optData" @getList="getList" @modalClose="modalClose" v-if="batchAgreeShow"/>
    <!-- 待议价批量拒绝弹窗 -->
    <batchReject :optData="optData" @getList="getList" @modalClose="modalClose" v-if="batchRejectShow"/>
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from './widget/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'
  import { getCookie } from '@/assets/js/helper'

  const props = [
    'allData',
    '',
    'waitShelf',
    'salling',
    'judgePrice',
    'saled',
    '',
    '',
    '',
    'allData'
  ]
  const opts = [
    'allOpts',
    '',
    'waitShelfOpts',
    'sallingOpts',
    'judgePriceOpts',
    'saledOpts',
    '',
    '',
    '',
    'allOpts'
  ]
  export default {
    components: {
      hTable
    },
    mixins: [mixin, componentsMixins],
    data () {
      let data = {
        b2bGradesList: [],
        tabCode: null, // 上部button选项
        listProps: tabCofigData['allData'],
        listOPs: tabCofigData['allOpts'],
        listApiName: 'bizProduct/list',
        productId: '',
        tableShow: true,
        selectList: [],
        timer: '',
        secondQualityDatas: null,
        outerChange: false,
        selection: true
      };
      // 弹窗的展示隐藏的控制，初始化均为false
      ['changepriceModalShow', 'exportModalShow', 'soldOutShow', 'infoDetailModalShow', 'selectMarkShow',
      'returnGoodShow', 'batchSaleShow', 'salefailShow', 'exportPriceModalShow', 'batchAgreeShow', 'batchRejectShow',
      'secondQualityShow', 'multiQualityShow', 'b2bGradeModalShow'].map(item => data[item] = false);
      return data
    },
    computed: {
      buttonDisable () {
        return this.selectList.length ? false : true
      },
      isB2bSeller () {
        return getCookie('isB2bSeller') == 1
      }
    },
    created () {
      window.clearInterval(this.timer)
      const tabCode = this.$route.query['tabCode'] || null
      this.selectTab(tabCode)
      this.initRecycleColumn()
      this.isB2bSeller && this.getb2bGradeList()
    },
    methods: {
      modalClose () {
        // 所有弹窗关闭
        Object.assign(this.$data, {
          changepriceModalShow: false,
          exportModalShow: false,
          soldOutShow: false,
          infoDetailModalShow: false,
          selectMarkShow: false,
          returnGoodShow: false,
          b2bGradeModalShow: false,
          batchSaleShow: false,
          salefailShow: false,
          exportPriceModalShow: false,
          batchAgreeShow: false,
          batchRejectShow: false,
          secondQualityShow: false,
          multiQualityShow: false
        })
      },
      getb2bGradeList () {
        this.$http.get('common/b2bGradeList').then(res => {
          if (res.code === 0) {
            this.b2bGradesList = res.data
          }
        })
      },
      b2bGradeChange (id) {
        this.b2bGradeModalShow = true
        this.productId = id
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
      showSecondQuality (data) {
        // 命中抽检，展示二次质检弹窗
        // this.modalClose()
        this.secondQualityDatas = data
        if (data instanceof Array) {
        // 批量命中
          this.multiQualityShow = true
        } else {
        // 单一命中
          this.secondQualityShow = true
        }
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
        this.optData = data;
        switch (code) {
          case 'detail':
            this.$router.push({
              name: 'goodsDetail',
              query: {id: data['id'] || data['productId']}
            });
            break;
          case 'return_apply':
            this.returnGoodShow = true;
            break;
          case 'choose_mart':
            this.selectMarkShow = true;
            break;
          case 'out_of_mart':
            this.soldOutShow = true;
            break;
          case 'return_pkg_info':
            this.$router.push({
              name: 'backgoodsdetail',
              query: {
                id: data['returnPkgId']
              }
            });
            break;
          case 'deliver':
            // 送检，跳转质检后台发货
            window.open('https://youpinoffice.zhuanzhuan.com/qc/stock-out/send-confirm');
            break;
          case 'print_qc_code':
            const {qcCode, drwPOId, saleInfoList} = data;
            const currentMartCode = saleInfoList && saleInfoList[0] && saleInfoList[0].code;
            window.open(`http://m.zhuanzhuan.com/u/c2c/printqccode.html?qcCode=${qcCode}&bmorderId=${drwPOId}&currentMartCode=${currentMartCode}`);
            break;
          case 'agreePrice':
            this.batchAgreeShow = true;
            break;
          case 'rejectPrice':
            this.batchRejectShow = true;
            break;
          case 'directly_sell':
            this.selectMarkShow = true;
            break;
        }
      },
      changeTab () {
        // tabs组件外部改变选中态
        this.outerChange = true
        this.selectTab(9)
      },
      selectTab (i) {
        if (this.tabCode === i) return
        if (i == 9) {
          this.selection = false
        } else {
          this.selection = true
        }
        this.tabCode = i
        this.listData = []
        window.clearInterval(this.timer)
        this.tableShow = false
        // props opts 用来控制每个状态下表格的title 和 可操作的地方， tabsTitle.js中有定义
        if ([4, '4'].indexOf(i) > -1) {
          this.listApiName = 'bizOrder/bargainingList'
        } else {
          this.listApiName = 'bizProduct/list'
        }
        this.$nextTick(() => {
          // 让表格重新渲染
          this.tableShow = true
          this.selectList = []
          this.listProps = tabCofigData[props[Number(i)]]
          this.listOPs = tabCofigData[opts[Number(i)]]
          this.initRecycleColumn()
        })
      },
      initRecycleColumn () {
        const isPartner = parseInt(getCookie('isPartner'), 10) || 0
        if (isPartner) {
          this.listProps = this.listProps.concat(tabCofigData.allRecycle)
        }
      },
      priceChange (type, price, productId) {
        // 点击修改价格事件
        this.currentPrice = price
        this.setPriceType = type
        this.changepriceModalShow = true;
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
