<template>
  <div class="currentinfo-box">
    <el-card class="buyer-info">
      <ul class="buyer-box">
        <li class="buyer-item">
          <span>买家昵称：</span><i class="buyer-name">{{info['buyerNickName']}}</i><i class="icon-message" @click="goChatPage"></i>
        </li>
        <li class="buyer-item">
          <span>收件人：</span><i>{{info['consigneeName']}}</i>
        </li>
        <li class="buyer-item">
          <span>电话号码：</span><i>{{info['consigneePhone']}}</i>
        </li>
        <li class="buyer-item">
          <span>收件地址：</span><i>{{info['consigneeAddr']}}</i>
        </li>
      </ul>
    </el-card>

    <el-card class="currentState-info">
      <div class="currentState-box">
        <p class="state-title">
          <i class="el-icon-warning"></i>
          <span>{{info['statusDesc']}}</span>
        </p>
        <p class="buyer-item">
          <span>订单编号：</span><i>{{info['orderId']}}</i>
        </p>
        <div class="buyer-item express-box" v-if="info['status'] == 4 || info['status'] == 10">
          <p>
            <span>订单应付款：</span>
            <span class="countdown">
              {{info['totalPrice']}}元
              <span>(</span>
              <span>含{{ info['freight'] }}元运费</span>
              <span v-if="info['redPackMoney'] && info['redPackMoney'] > 0">&nbsp;已减{{info['redPackMoney']}}元红包</span>
              <span>)</span>
            </span>
          </p>
          <div>
            <p class="express-info" v-if="info['expressCompany']"><span>物流公司：</span><i>{{info['expressCompany']}}</i></p>
            <p class="express-info" v-if="info['expressNum']"><span >物流单号：</span><i>{{info['expressNum']}}</i></p>
          </div>
        </div>
        <!-- 待支付状态倒计时 -->
        <div class="buyer-item" v-if="info['status'] == 2">
          <span>付款倒计时：</span><i class="countdown">{{countdown}}</i>（买家超时未支付将自动关闭订单释放库存）
          <p><el-button size="mini"  type="danger" @click="buttonclick('cancel')">取消订单</el-button></p>
        </div>
        <!-- 待发货状态倒计时 -->
        <div class="buyer-item sendship-button" v-if="info['status'] == 3">
          <div>
            <p>
              <span>订单应付款：</span>
              <span class="countdown">
                {{info['totalPrice']}}元
                <span>(</span>
                <span>含{{ info['freight'] }}元运费</span>
                <span v-if="info['redPackMoney'] && info['redPackMoney'] > 0">&nbsp;已减{{info['redPackMoney']}}元红包</span>
                <span>)</span>
              </span>
            </p>
          </div>
          <!-- <div><span>发货倒计时：</span><i class="countdown">{{countdown}}</i>（卖家超时未发货将自动关闭订单）</div>  -->
          <el-button size="mini"  type="primary" @click="buttonclick('sendship')">发货</el-button>
        </div>
        <!-- 待收货状态倒计时 -->
        <div class="buyer-item" v-if="info['status'] == 4">
          <span>自动收货倒计时：</span><i class="countdown">{{countdown}}</i>
        </div>
        <!-- 退款倒计时 -->
        <div class="buyer-item" v-if="info['status'] == 6">
          <div><span>退款倒计时：</span><i class="countdown">{{countdown}}</i>（卖家超时未操作将自动退款给买家）</div>
          <div>
            <p>
              <span>订单应付款：</span>
              <span class="countdown">
                {{info['totalPrice']}}元
                <span>(</span>
                <span>含{{ info['freight'] }}元运费</span>
                <span v-if="info['redPackMoney'] && info['redPackMoney'] > 0">&nbsp;已减{{info['redPackMoney']}}元红包</span>
                <span>)</span>
              </span>
            </p>
          </div>
          <div><span>退款理由：</span><span>{{ info['refundReason'] }}</span></div>
          <p><el-button size="mini"  type="primary" @click="buttonclick('backdetail')">查看退款详情</el-button></p>
        </div>
        <div class="buyer-item" v-if="info['status'] == 10">
          <p>买家已于{{ info['confimReceiveTime'] }}确认收货</p>
        </div>
        <!-- 退款成功 -->
        <div class="buyer-item" v-if="info['status'] == 11">
          <p>
            <span>订单应付款：</span>
            <span class="countdown">
              {{info['totalPrice']}}元
              <span>(</span>
              <span>含{{ info['freight'] }}元运费</span>
              <span v-if="info['redPackMoney'] && info['redPackMoney'] > 0">&nbsp;已减{{info['redPackMoney']}}元红包</span>
              <span>)</span>
            </span>
          </p>
          <p>平台已退款给买家，该笔交易已关闭</p>
          <p><el-button size="mini"  type="primary" @click="buttonclick('backdetail')">查看退款详情</el-button></p>
        </div>
        <!-- 关闭订单 -->
        <div class="buyer-item" v-if="info['status'] == 12">
          <p>
            <span>订单应付款：</span>
            <span class="countdown">
              {{info['totalPrice']}}元
              <span>(</span>
              <span>含{{ info['freight'] }}元运费</span>
              <span v-if="info['redPackMoney'] && info['redPackMoney'] > 0">&nbsp;已减{{info['redPackMoney']}}元红包</span>
              <span>)</span>
            </span>
          </p>
          <p><span>关闭原因：</span>{{ info['cancelReason'] }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { countTime } from '../../../assets/js/helper'
export default {
  props: ['info'],
  data () {
    return {
      countdown: '',
      timer: ''
    }
  },
  watch: {
    info (n, o) {
        this.inter()
      }
  },
  created () {
    this.inter()
  },
  methods: {
    inter () {
      const { status } = this.info
      let time = ''
      if (status == '2') {
        // 支付倒计时
        time = this.info['payCountDown']
      } else if (status == '3') {
        // 发货倒计时
        // time = this.info['payCountDown']
      } else if (status == '4') {
        // 收货倒计时
        time = this.info['receiveCountDown']
      } else if (status == '6') {
        // 退款确认倒计时
        time = this.info['refundCountDown']
      }
      if (time) {
        console.log('---time', time);
        this.timer = window.setInterval(() => {
          if (time <= 0) {
            clearInterval(this.timer);
            this.countdown = '00天00时00分00秒'
          }
          this.countdown = countTime(time--);
        }, 1000);

        // const inter = window.setInterval(() => {
        //   this.countdown = formatSeconds(time)
        //   time -= 1
        //   if (time < 0) {
        //     // this.$emit('refresh')
        //     return window.clearInterval(inter)
        //   }
        // }, 1000)
      }
    },
    buttonclick (opt) {
      this.$emit('buttonclick', opt)
    },
    goChatPage () {
      const { buyerUid } = this.info;
      const url = 'https://chat.zhuanzhuan.com/#/im/trade?contactUid=';
      window.open(`${url}${buyerUid}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.currentinfo-box{
  width: 100%;
  display: flex;
  padding: 14px;
  justify-content: space-between;
  flex-grow: 1;
}
.buyer-info{
  width: 35%;
  min-height: 208px;
}
.buyer-box,.currentState-box{
  padding: 24px;
  line-height: 36px;
}
.currentState-info{
  width: 64%;
  min-height: 208px;
}
.buyer-item {
  font-size: 14px;
  span{
    color: #6D6F73;
  }
  i{
    color: #000017;
  }
  .countdown{
    color: #FF962F;
  }
}
.state-title{
  font-size: 20px;
  i {
    color: #FF962F;
  }
  span{
    // font-weight: bold;
    color: #2E3135;
    margin-left: 5px;
  }
}
.express-box{
  // display: flex;
}
.express-info{
  margin-right: 30px;
  display: inline-block;
  flex: 1;
}
.sendship-button{
  // margin-top: 40px;
}
.buyer-name {
  vertical-align: middle;
  margin-right: 6px;
}
.icon-message {
  vertical-align: middle;
  width: 18px;
  height: 15px;
  display: inline-block;
  background-image: url('../../../assets/img/message.png');
  background-size: cover;
}
</style>
