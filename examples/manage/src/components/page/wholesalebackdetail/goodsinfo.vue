<template>
    <div class="goods-info-wrap">
      <p class="detail-title">退款详情</p>
      <el-card class="box-card" >
        <div class="detail-box" v-if="detailData['status'] == 6">
          <section class="item-box">
            <p>
              <span class="card-title">买家已发起退款申请</span>
              <span class="count-down">自动退款倒计时：<span class="count-time">{{ countdowntime }}</span></span>
            </p>
            <p class="desc-text">买家已发起退款申请，请您及时处理，若您已发货可拒绝买家的申请并填写发货物流单号，如规定时间内未处理，将自动给买家退款。</p>
            <p>
              <el-button size="mini" type="primary" @click="() => showModal('agreeRefundShow')">同意退款</el-button>
              <el-button size="mini" type="primary" @click="() => showModal('showSendShipModal')">我已发货</el-button>
            </p>
          </section>
        </div>
        <div class="detail-box" v-if="detailData['status'] == 11">
          <section class="item-box">
            <p>
              <span class="card-title">卖家已同意退款</span>
            </p>
          </section>
        </div>
        <div class="detail-box" v-if="detailData['status'] == 4">
          <section class="item-box">
            <p>
              <span class="card-title">卖家已发货</span>
            </p>
            <p class="desc-text">您拒绝了买家的退款申请，并已进行发货。</p>
          </section>
        </div>
      </el-card>

      <el-card class="box-card" >
        <div class="detail-box">
          <section class="item-box">
            <p class="apply-item-title">
              <span class="item-title">{{detailData['statusDesc']}}</span>
              <span class="count-down">{{detailData['refundTime']}}</span>
            </p>
            <ul class="items-box">
              <li class="item-desc">退款服务：{{detailData['refundType']}}</li>
              <li class="item-desc">退款金额：{{detailData['totalPrice']}} 元</li>
              <li class="item-desc">退款原因：{{detailData['reason']}}</li>
              <li class="item-desc">退款描述：{{detailData['desc']}}</li>
            </ul>
          </section>
        </div>
      </el-card>
      <!-- 同意退款 -->
      <agreeRefund v-if="agreeRefundShow" @modalClose="modalClose" :optData="detailData"></agreeRefund>
      <!-- 发货弹窗 -->
      <sendShip v-if="showSendShipModal" :orderId="detailData['orderId']" @modalClose="modalClose"></sendShip>
  </div>
</template>

<script>
  import Report from '../../report-v4'
  import { countTime } from '../../../assets/js/helper'
  import agreeRefund  from './agree'
  import sendShip from './sendship'
  export default {
    props: ['productId'],
    data () {
      return {
        detailData: '',
        countdowntime: '',
        timer: '',
        agreeRefundShow: false,
        showSendShipModal: false
      }
    },
    components: {
      Report,
      agreeRefund,
      sendShip
    },
    created () {
      this.$http.get('wholesale/order/refundDetail', {orderId: this.$route.query['orderId']}).then(res => {
        this.detailData = res['data']
        this.inter();
      })
    },
    methods: {
      showModal (name) {
        console.log(name);
        this[name] = true;
      },
      modalClose () {
        this.agreeRefundShow = false;
        this.showSendShipModal = false;
      },
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
      },
      inter () {
        // let time = this.detailData.countDown;
        // const inter = window.setInterval(() => {
        //   this.countTime = formatSeconds(time)
        //   time -= 1
        //   if (time < 0) {
        //     // this.$emit('refresh')
        //     return window.clearInterval(inter)
        //   }
        // }, 1000)

        window.clearInterval(this.timer)
        var t = this.detailData['countDown']
        console.log('t---', t);
        this.timer = window.setInterval(() => {
          if (t <= 0) {
            clearInterval(this.timer);
            this.countdowntime = '00天00时00分00秒'
          }
          this.countdowntime = countTime(t--);
        }, 1000);
      }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

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
  display: inline-block;
  padding: 15px 0 10px;
  font-size: 20px;
  color: #2E3135;
}
.desc-text{
  font-size: 14px;
  color: #6D6F73;
}
.item-title,.count-down{
  display: inline-block;
  padding: 15px 0 10px;
  font-size: 14px;
  color: #6D6F73;
}
.apply-item-title{
  border-bottom: 1px solid #E7E7E7;
}
.items-box{
  margin-top: 10px;
}
.item-desc{
  font-size: 14px;
  color: #6D6F73;
  line-height: 30px;
}
.count-down{
  float: right;
}
.count-time {
  color: #FF962F;
}
.item-box{
  padding: 0 20px 10px;
  line-height: 32px;
  font-size: 14px;
  color: #6D6F73;
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
