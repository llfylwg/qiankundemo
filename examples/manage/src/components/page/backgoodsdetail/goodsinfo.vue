<template>
    <div class="goods-info-wrap">
      <p class="detail-title">退货详情</p>
      <el-card class="box-card" v-if="detailData">
        <div class="detail-box">
          <section class="item-box">
            <p class="card-title">发件人信息</p>
            <span v-for="(value, key) in sendInfo" :key="key" class="text item">
              {{value + detailData[key]}}
            </span>
          </section>
          <section class="item-box">
            <p class="card-title">收件人信息
            </p>
            <span v-for="(value, key) in receiveInfo" :key="key" class="text item">
              {{value + detailData[key]}}
            </span>
          </section>
          <section class="item-box">
            <p class="card-title">物流信息</p>
            <span v-for="(value, key) in expressInfo" :key="key" class="text item">
              {{value + detailData[key]}}
            </span>
          </section>
          <!-- 退货商品列表 -->
          <section class="item-box" >
            <p class="card-title">退货商品列表
              <el-button type="primary" class="sure-receive" size="mini" @click="sureReceiveGood" v-if="detailData['status'] != 2">确认收货</el-button>
            </p>
            <p class="text express-info">
              <hTable
              :listData="detailData['packageItems']"
              :listProps="listProps"
              :listOPs="listOPs"
              size="mini">
              <template slot="operations" slot-scope="scope">
                <span class="edit" @click="handleClick(scope.rowData)">退货反馈</span>
              </template>
              </hTable>
            </p>
          </section>
          <section class="item-box">
            <p class="card-title">温馨提示</p>
            <p v-for="(value, key) in tips" :key="key" class="text">
              {{value}}
            </p>
          </section>

          <section class="item-box" v-if="detailData['flowDetails'].length">
            <p class="card-title">物流详情</p>
            <p v-for="(value, key) in detailData['flowDetails']" :key="key" class="text express-info">
              {{value}}
            </p>
          </section>
        </div>
    </el-card>
    <sureReceive @getDetail="getDetail" v-if="receiveShow" @closeModal="closeModal"></sureReceive>
    <feedBack v-if="feedbackModal" @closeModal="closeModal" :info="feedbackData"></feedBack>
  </div>
</template>

<script>
  import hTable from 'sub/component/Table'
  import sureReceive from './surereceive'
  import feedBack from './feedBackModal'
  export default {
    components: {
      hTable,
      sureReceive,
      feedBack
    },
    props: ['productId'],
    data () {
      return {
        receiveShow: false,
        feedbackModal: false,
        feedbackData: {},
        listProps: [
          {
            prop: 'productId',
            label: '商品编号'
          },
          {
            prop: 'productTitle',
            label: '商品信息'
          },
          {
            prop: 'imei',
            label: 'imei'
          },
          {
            prop: 'qcCode',
            label: '质检码'
          },
          {
            prop: 'level',
            label: '等级'
          },
          {
            prop: 'statusDesc',
            label: '状态'
          }
        ],
        listOPs: [
          {
            label: '操作',
            name: 'operations'
          }
        ],
        sendInfo: {
          senderName: '发件人姓名：',
          senderPhone: '发件人电话：',
          senderAddr: '发件人地址：',
          productCount: '商品数量：'
        },
        receiveInfo: {
          receiveName: '收件人姓名：',
          receivePhone: '收件人电话：',
          receiveAddr: '收件人地址：'
        },
        expressInfo: {
          "expressNum": "物流单号：",
          "expressCompanyCn": "物流公司："
        },
        // detailData: '',
        detailData: {
          packageItems: [
            {
              productId: '1234444444',
              productTitle: 'iphone7 64G',
              imei: 'imei12333444',
              level: '九成新',
              statusDesc: '待收货'
            },
            {
              productId: '1234444444',
              productTitle: 'iphone7 64G',
              imei: 'imei12333444',
              level: '九成新',
              statusDesc: '待收货'
            },
            {
              productId: '1234444444',
              productTitle: 'iphone7 64G',
              imei: 'imei12333444',
              level: '九成新',
              statusDesc: '待收货'
            }
          ],
          "expressNum": "12222222",
          "expressCompanyCn": "顺丰",
          "senderName": "转转",
          "senderPhone": "120-22222",
          "saleTimes": "2019-12-24",
          "senderAddr": "北京市",
          "receiveName": "张三",
          "receivePhone": "1990303003",
          "receiveAddr": "辽宁省",
          productCount: '123',
          flowDetails: [
            '2018-12-30 未接诶耳机日俄人吉尔吉尔诶人家诶人机而近日耳机',
            '2018-12-30 未接诶耳机日俄人吉尔吉尔诶人耳机',
            '2018-12-30 未尔诶人家诶人机而近日耳机',
            '2018-12-30 未接诶耳机日俄人吉尔吉尔诶人家诶人机而近日耳机',
            '2018-12-30 未接诶近日耳机',
            '2018-12-30 未接诶耳人吉尔吉尔诶人家诶人机而近日耳机',
          ]
      },
      "tips": ['1.发货15天后系统将会默认收货，请及时核对退货商品明细', '2.确认收货后，该退货单中所有商品状态均默认退货已收货', '3.若退货包裹中，出现漏退、退错等情况，请进行出现问题商品的退货反馈']
      }
    },
    created () {
      this.getDetail()
    },
    methods: {
      handleClick (info) {
        this.feedbackModal = true
        this.feedbackData = info
      },
      sureReceiveGood () {
        this.receiveShow = true
      },
      closeModal () {
        this.receiveShow = false
        this.feedbackModal = false
      },
      getDetail () {
        this.$http.get('bizReturnPkg/detail', {returnPkgId: this.$route.query['id']}).then(res => {
          this.detailData = res['data']
          console.log(this.detailData)
        })
      },
      navBackDetail () {
        alert('跳到退货详情')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.text.item {
  display: inline-block;
  min-width: 30%;
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
    // margin-bottom: 20px;
  }
}
.see-report{
  float: right;
}
.express-info{
  font-size: 14px;
  color: #6D6F73;
}
.sure-receive{
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
