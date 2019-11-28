<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">

      <!-- 筛选项 -->
      <h-filter @search="setFilter" @exportList="sureExport" :tabCode="tabCode" ref="hfilter"></h-filter>
    </section>
    <div class="tip">
      所有数据统计到前一日，统计维度为订单数而非商品数量。(如2019年6月13号查询，可查询的截止时间为6月12号前完整周期内的订单数据。)
    </div>
    <div class="table-box">
      <!-- 列表 -->
      <h-table
              :isLoading="isLoading"
              :listData="listData"
              :listProps="listProps"
              :pageData="pageData"
              :total="total"
              :listOPs="listOPs"
              size="mini"
              :selection="false"
              @onSize="handleSizeChange"
              @onSelect="onSelect"
              @onCurrent="handleCurrentChange" v-if="tableShow">

        <template slot="secondPriceRate">
          <span>二次报价率
            <el-tooltip content="统计周期内，二次报价数/回收数，即卖家产生的订单在您确认收货后二次报价的占比" placement="bottom" effect="light">
              <i class="iconfont icon-wenhao nav-icon"></i>
            </el-tooltip>
            </el-popover>
          </span>
        </template>

        <template slot="refundRate">
          <span>退货率
            <el-tooltip content="统计周期内，退货数/到货数，即卖家产生的订单在您确认收货后产生退货的占比" placement="bottom" effect="light">
              <i class="iconfont icon-wenhao nav-icon"></i>
            </el-tooltip>
          </span>
        </template>

        <!-- 回收价格 -->
        <!-- <template slot="price" slot-scope="scope"> -->
          <!-- <price :optData="scope.rowData" :orderType="tabs" @setPriceClick="setPriceClick"></price> -->
        <!-- </template> -->
        <!-- 操作 -->
        <!-- <template slot="opts" slot-scope="scope"> -->
          <!-- <opts :optData="scope.rowData" :orderType="tabs" @handleClickToDetail="handleClickToDetail" :tabCode="tabCode"></opts> -->
        <!-- </template> -->
      </h-table>
    </div>
    

    <!-- 导出弹窗 -->
    <exportModal v-if="exportModalShow" :filter="filter" @modalClose="modalClose" @sureExport="sureExport" />

    </div>
</template>

<script>
    import hTable from './Table'
    import componentsMixins from '../../components/page/recyclecoredata/componentsMixins.js'
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
                tabCode: '0', // 上部button选项
                count: [],
                listProps: tabCofigData['allData'],
                listOPs: tabCofigData['allOpts'],
                listApiName: 'partner/report/recycle-stats/list',
                confirmRecycleVisible: false,
                changePriceVisible: false,
                payMoneyVisible: false,
                productId: '',
                tableShow: true,
                selectList: [],
                timer: '',
                exportModalShow: false,
                optData: '',
                form: {}
            }
            return data
        },
        created () {
            window.clearInterval(this.timer)
        },
        methods: {
            modalClose () {
                // 所有弹窗关闭
                Object.assign(this.$data, {
                    exportModalShow: false,
                })
            },
            exportList (form) {
                // 导出弹窗提示
                console.log(form)
                this.form = form
                this.exportModalShow = true
            },
             exportValidate () {
               const { startUpdateTime, endUpdateTime } = this.form
              if (!startUpdateTime || !endUpdateTime) {
                  this.$message.error('开始时间或结束时间不能为空！')
                  return false
              }
              const createTimeStartStmp = new Date(startUpdateTime).getTime()
              const createTimeEndStmp = new Date(endUpdateTime).getTime()
              const year = new Date().getFullYear()
              const month = new Date().getMonth() + 1
              const date = new Date().getDate()
              const dateInterval = 60 * 24 * 60 * 60 * 1000
              const EndValue = new Date(`${year}-${month}-${date}`).getTime()
              if (createTimeEndStmp >= EndValue) {
                  this.$message.error('结束时间应该在今天之前！')
                  return false
              }
              if (createTimeStartStmp + dateInterval <= createTimeEndStmp) {
                  this.$message.error('开始时间到结束时间应该在60天以内！')
                  return false
              }
              return true
            },
            sureExport (form) {
              this.form = form
              if (!this.exportValidate()) return
              const { startUpdateTime, endUpdateTime } = this.form
              const startDate = startUpdateTime
              const endDate = endUpdateTime
              location.href = `https://ypwork.zhuanzhuan.com/ypee/partner/report/recycle-stats/export?startUpdateTime=${startDate}&endUpdateTime=${endDate}&sellerName=${this.form.sellerName}&mobilePhone=${this.form.mobilePhone}`
              this.exportModalShow = false
            },
            // handleClickToDetail (data, {code}) {
            //     // 操作区域选项点击
            //     // 详情 或 改价（改价状态直接跳转详情修改价格）
            //     if (code === 'detail' || code === 'changeprice') {
            //         return this.$router.push({
            //             name: 'recycleOrderDetail',
            //             query: {orderId: data['orderId']}
            //         })
            //     }
            //     this.optData = data
            //     // 确认回收
            //     if (code === 'confirm') {
            //         this.confirmRecycleVisible = true
            //     }
            //     // 改价
            //     // if (code === 'changeprice') {
            //     //     this.changePriceVisible = true
            //     // }
            //     // 打款
            //     if (code === 'paymoney') {
            //         this.payMoneyVisible = true
            //     }
            // },
            onSelect (n) {
                // 多选选中事件
                console.log('onSelect: ', n)
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
    i {
      font-size: 16px;
    }
  }
  .tip{
    padding-left: 16px;
    line-height: 48px;
    color: #6D6F73;
    font-size: 14px;
  }
</style>
<style lang="scss">
  .el-tooltip__popper.is-light{
    border-color: #909399!important;
  }
</style>
