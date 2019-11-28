<template>
    <div class="goods-info-wrap">
      <p class="detail-title">商品详情</p>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">商品信息</p>
            <span v-for="(value, key) in info" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
        </div>
      </el-card>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">商品规格</p>
            <span v-for="(value, key) in specifications" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
        </div>
      </el-card>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">商品类型</p>
            <span v-for="(value, key) in types" :key="key" class="text item" v-if="detailData[key]">
              {{value + detailData[key]}}
            </span>
          </section>
        </div>
      </el-card>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">图文详情</p>
            <p class="piclist-box">
              <span>
                商品图片：
              </span>
              <img v-for="i in imgs" :src="`https://pic1.zhuanstatic.com/zhuanzh/${i}`" alt="">
            </p>
            <p>卖家有话说： {{detailData['context']}}</p>
          </section>
        </div>
      </el-card>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">价格信息</p>
            <span v-for="(value, key) in priceInfo" :key="key" class="text item">
              {{value + detailData[key]}} 元
            </span>
          </section>
        </div>
      </el-card>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">商品库存</p>
            <span v-for="(value, key) in stockInfo" :key="key" class="text item">
              {{value + detailData[key]}}
            </span>
          </section>
        </div>
      </el-card>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">卖家承诺</p>
            <p>
              卖家承诺：<span class="promise-text"><i class="iconfont icon-xuanzhong promise-xuanzhong"></i>{{detailData['services']}}</span>
            </p>
            <p>
              特别说明：<span v-for="i in specialDesc" class="promise-text"><i class="iconfont icon-xuanzhong promise-xuanzhong"></i>{{i}}</span>
            </p>
          </section>
        </div>
      </el-card>
    <Report :zjId="detailData['qcId']" @closeReport="closeReport" v-if="showReport"></Report>
  </div>
</template>

<script>
  import Report from '../../report-v4'
  export default {
    data () {
      return {
        detailData: '',
        showReport: false,
        info: {
          productId: '商品编号：',
          productTitle: '商品信息：',
          statusDesc: '商品状态：'
        },
        specifications:{
          cate1Name: '商品分类：',
          levelDesc: '商品等级：',
          cate2Name: '商品品牌：',
          cate3Name: '商品型号：',
          memory: '运行内存：',
          capacity: '系统内存：',
          color: '商品颜色：',
          channel: '购买渠道：',
          warranty: '国内保修时长：',
          simLock: 'sim卡锁：'
        },
        types: {
          usedType: '商品类型：',
          accessories: '是否有配件：',
          trait: '商品特点：'
        },
        priceInfo: {
          price: '批发价：',
          freight: "运费："
        },
        stockInfo: {
          stock: '商品库存：',
          saleNum: '已售销量：'
        },
        specialDesc: [],
        imgs: []
      }
    },
    components: {
      Report
    },
    created () {
      this.$http.get('wholesale/product/detail', {productId: this.$route.query['productId']}).then(res => {
        this.detailData = res['data']
        this.imgs = res['data']['pics'].split('|')
        this.specialDesc = res['data']['specialDesc'].split('|')
      })
    },
    methods: {
      closeReport () {
        this.showReport = false
      },
      seeReport () {
        this.showReport = true
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
