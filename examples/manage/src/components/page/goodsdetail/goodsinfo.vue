<template>
    <div class="goods-info-wrap">
      <p class="detail-title">商品详情</p>
      <el-card class="box-card" v-if="detailData">
        <!-- <div slot="header" class="clearfix">
          <span class="detail-title">商品详情</span>
        </div> -->
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">商品状态</p>
            <span v-for="(value, key) in status" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
          <section class="item-box">
            <p class="card-title">商品来源</p>
            <span v-for="(value, key) in origin" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
          <section class="item-box">
            <p class="card-title">质检信息
              <el-button type="text" class="see-report" @click="seeReport" v-if="detailData['qcId']">查看质检报告</el-button>
            </p>
            <span v-for="(value, key) in qcInfo" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
          <section class="item-box" v-if="detailData.saleInfoList && detailData.saleInfoList.length">
            <p class="card-title">售卖情况</p>
            <span v-for="(value, key) in saleInfo" :key="key" class="text item">
              {{value + detailData['saleInfoList'][0][key]}}
            </span>
            <span  class="text item" v-if="detailData['dealPrice']">
              成交价（元）：{{detailData['dealPrice']}}
            </span>
            <span  class="text item" v-if="detailData['saleTimes']">
              售卖次数：{{detailData['saleTimes']}}
            </span>
          </section>
          <section class="item-box" v-if="detailData['returnCreateTime']">
            <p class="card-title">退货情况
              <el-button type="text" class="see-report" @click="navBackDetail" v-if="detailData['returnPkgId']">查看退货详情</el-button>
            </p>
            <span v-for="(value, key) in returninfo" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
        </div>
    </el-card>
    <Report :zjId="detailData['qcId']" @closeReport="closeReport" v-if="showReport"></Report>
    <Report5 :zjId="detailData['qcId']" @closeReport="closeReport" v-if="showReportV5"></Report5>
  </div>
</template>

<script>
  import Report from '../../report-v4'
  import Report5 from '../../report-v5'
  export default {
    props: ['productId'],
    data () {
      return {
        showReport: false,
        showReportV5: false,
        status: {
          statusDesc: '商品状态：',
          inStockDuration: '在库时间：',
          updateTime: '最后更新时间：'
        },
        origin: {
          bizPkgId: '发货单号：'
        },
        qcInfo: {
          id: '商品编号：',
          qcCode: '质检码：',
          deviceCode: 'IMEI：',
          goodsTitle: '商品信息：',
          cate1Name: '商品分类：',
          gradeName: '商品等级：',
          finenessName: '商品成色：',
          cate2Name: '商品品牌：',
          cate3Name: '商品型号：',
          capacityName: '系统内存：',
          versionName: '购买渠道：'
        },
        saleInfo: {
          desc: '售卖卖场：',
          price: '卖场价格（元）：'
        },
        returninfo: {
          returnPkgDetailId: '退货单号：',
          returnCreateTime: '退货发起时间：',
          returnExpressNum: '退货物流单号：'
        },
        detailData: ''
      }
    },
    components: {
      Report,
      Report5
    },
    created () {
      this.$http.get('bizProduct/detail', {productId: this.productId}).then(res => {
        this.detailData = res['data']
        console.log(this.detailData)
      })
    },
    methods: {
      closeReport () {
        this.showReport = false
        this.showReportV5 = false
      },
      seeReport () {
        if (this.detailData.cate1Id === '101' || this.detailData.cate1Id === 101) {
          this.showReportV5 = true
        } else {
          this.showReport = true
        }
        
      },
      navBackDetail () {
        this.$router.push({
          path: 'backgoodsdetail',
          query: {
            id: this.detailData['returnPkgId']
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.text.item {
  display: inline-block;
  width: 30%;
  text-align: left;
  font-size: 14px;
}
.box-card{
  margin: 20px;
  margin-bottom: 100px;
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
