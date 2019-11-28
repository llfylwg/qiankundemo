<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">
      <!-- 筛选项 -->
      <h-filter @search="setFilter" ref="hfilter"></h-filter>
    </section>

    <div class="table-box">
      <buttons :buttonDisable="buttonDisable" :selectList="selectList"
               @batchPutToMart="batchPutToMart" @batchWithdrawFromMart="batchWithdrawFromMart"
               @exportPriceList="exportPriceList"
               @getList="getList"
               @toGenerateQuotation="toGenerateQuotation"
      ></buttons>

      <!-- 列表 -->
      <h-table
          :listData="listData"
          :listOPs="listOPs"
          :listProps="listProps"
          :pageData="pageData"
          :selection="true"
          :total="total"
          @onCurrent="handleCurrentChange"
          @onSelect="onSelect"
          @onSize="handleSizeChange"
          size="mini" v-if="tableShow">

        <template slot="levelDesc">
          <span>等级
            <i @click="seeGrade" class="iconfont icon-wenhao nav-icon"></i>
          </span>
        </template>


        <!-- 库存-->
        <template slot="stock" slot-scope="scope">
          <inventory :optData="scope.rowData" @inventoryChange="inventoryChange"></inventory>
        </template>

        <!-- 批量售价 -->
        <template slot="price" slot-scope="scope">
          <batchPrice :optData="scope.rowData" @changeBatchPrice="changeBatchPrice"></batchPrice>
        </template>


        <template slot="operations" slot-scope="scope">
          <!-- 操作 -->
          <opts :optData="scope.rowData" @handleClickToDetail="handleClickToDetail"></opts>
        </template>


      </h-table>
    </div>
    <changeInventory :currentInventory="currentOpt['stock']" :id="currentOpt['productId']" @getList="getList"
                     @modalClose="modalClose" v-if="changeInventoryShow"></changeInventory>

    <changeBatchprice :currentPrice="currentOpt['price']" :id="currentOpt['productId']" @getList="getList"
                      @modalClose="modalClose" v-if="changeBatchPriceShow"></changeBatchprice>

    <soldOut :optData="optData" @getList="getList" @modalClose="modalClose" v-if="soldOutShow"></soldOut>

    <goSale :optData="optData" @getList="getList" @modalClose="modalClose" v-if="goSaleShow"></goSale>
    <exportPriceModal @modalClose="modalClose" @sureExportPriceList="sureExportPriceList"
                      v-if="exportPriceModalShow"></exportPriceModal>
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from '../../components/page/wholesalegoodslist/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'

  export default {
    components: {
      hTable
    },
    mixins: [mixin, componentsMixins],
    data () {
      let data = {
        listProps: tabCofigData['allData'],
        listOPs: tabCofigData['allOpts'],
        listApiName: 'wholesale/product/list',
        tableShow: true,
        selectList: [],
        currentOpt: {},
        changeInventoryShow: false,
        changeBatchPriceShow: false,
        soldOutShow: false,
        goSaleShow: false,
        exportPriceModalShow: false
      }
      return data
    },
    computed: {
      buttonDisable () {
        return this.selectList.length ? false : true
      }
    },
    methods: {
      inventoryChange (...arg) {
        this.currentOpt = arg[0]
        this.changeInventoryShow = true
      },
      changeBatchPrice (...arg) {
        this.currentOpt = arg[0]
        this.changeBatchPriceShow = true
      },
      modalClose () {
        // 所有弹窗关闭
        Object.assign(this.$data, {
          changepriceModalShow: false,
          exportModalShow: false,
          soldOutShow: false,
          batchSaleShow: false,
          exportPriceModalShow: false,
          changeInventoryShow: false,
          changeBatchPriceShow: false,
          goSaleShow: false
        })
      },
      batchPutToMart () {
        //  批量上架
        this.goSaleShow = true
        this.optData = this.selectList
      },
      batchWithdrawFromMart () {
        // 批量下架弹窗展示
        this.optData = this.selectList
        this.soldOutShow = true
      },
      exportPriceList () {
        // 批量改价
        this.exportPriceModalShow = true
      },
      sureExportPriceList () {
        // 确认批量改价
        const keys = Object.keys(this.filter)
        let str = ''
        keys.map(item => {
          str += `${item}=${this.filter[item]}&`
        })
        this.exportPriceModalShow = false
        window.location.href = '//ypwork.zhuanzhuan.com/ypee/wholesale/product/export?' + str
      },
      handleClickToDetail (data, {code}) {
        // 操作区域选项点击
        this.optData = data
        if (code === 'detail') {
          return this.$router.push({
            name: 'wholesalegoodsdetail',
            query: {productId: data['productId']}
          })
        }
        if (code === 'up') {
          // 上架
          return this.goSaleShow = true
        }
        if (code === 'down') {
          // 下架
          console.log(this.optData, 123)
          return this.soldOutShow = true
        }
        if (code === 'edit') {
          // 编辑
          this.$router.push({
            name: 'wholesalepublish',
            query: {
              productId: this.optData['productId']
            }
          })
        }
      },
      seeGrade () {
        this.$alert('<div>全新：未激活的全新机</div>' +
          '<div>充新：功能完好，单机几乎没有任何使用和磨损痕迹</div>' +
          '<div>靓机：功能完好，屏幕无划痕整体成色非常新（屏幕无任何伤痕，外观可能有微伤痕）</div>' +
          '<div>小花：功能完好，外观8新及以上，屏幕有轻微划痕或外观有磕碰</div>',
          '等级说明',
          {
            dangerouslyUseHTMLString: true,
            showConfirmButton: false
          })
      },
      onSelect (n) {
        // 多选选中事件
        this.selectList = n
      },
      toGenerateQuotation () {
        this.$router.push({
          name: 'productPriceListImage'
        });
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
