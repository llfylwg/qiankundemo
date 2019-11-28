<template>
  <div class="balance">
    <div class="balance__header">
      <div class="box">
        <div class="left">
          <a @click="goIndex">保卖企业版</a>&nbsp; | &nbsp;<span>余额账户</span>
        </div>
        <a class="right" @click="goIndex">{{info.aliRealName}}</a>
      </div>
    </div>
    <div class="balance__detail">
      <div class="left">
        <div class="bg_white left-top">
          <p><span class="bold">账户余额（可用余额+冻结余额）</span> <a class="link" @click="toMoneyDetail">余额明细</a></p>
          <p>
            <span class="price bold">{{info.totalAmount / 100}}</span>元
          </p>
          <div>
            <el-button type="primary" @click="recharge">充值</el-button>
            <el-button @click="recharge">提现</el-button>
          </div>
        </div>

        <div class="items">
          <div class="item" v-for="item in items">
            <div class="icon" :style="{backgroundImage: `url(${item.pic})`}"></div>
            <div>
              <p class="desc">{{item.desc}}</p>
              <p>{{item.title}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right__item">
          <p class="desc">可用余额</p>
          <span class="price-grey">{{info.totalAmount / 100}}</span>元
        </div>
        <div class="right__item">
          <p class="desc">冻结余额</p>
          <span class="price-grey">{{info.freezeAmount / 100}}</span>元
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        info: {},
        items: [
          {
            pic: 'https://pic6.zhuanstatic.com/zhuanzh/n_v2ab0fc9af221f41588b503bbf8614c202.png',
            desc: '账户余额可以',
            title: '支付订单钱款'
          },
          {
            pic: 'https://pic3.zhuanstatic.com/zhuanzh/n_v2f9ca8c5a73e0433fb376e7c401339f95.png',
            desc: '账户余额可以',
            title: '随时提现，由充值原路返回'
          }
        ]
      }
    },
    created () {
      this.getData()
    },
    methods: {
      goIndex () {
        location.href = 'https://open.zhuanzhuan.com'
      },
      // 充值 提现
      recharge () {
        window.open('https://m.zhuanzhuan.com/ec/#/account')
      },
      // 余额明细
      toMoneyDetail () {
        window.open('https://m.zhuanzhuan.com/ec#/account/list')
      },
      getData () {
        this.$http.get('https://app.zhuanzhuan.com/zz/transfer/queryAccountInfo').then(res => {
          this.info = res.respData
        }).catch(e => {
          this.$router.push('/balance/index')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bg_white {
    background: white;
  }
  .bold {
    font-weight: bold;
  }
  .items {
    margin-top: 14px;
    display: flex;
  }
  .item {
    display: flex;
    justify-content: center;
    width: 396px;
    background: white;
    padding: 40px;
    &:nth-child(1) {
      margin-right: 14px;
    }
    .icon {
      width: 40px;
      height: 40px;
      margin-right: 19px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }
  .balance {
    .price {
      font-size: 48px;
      color: #FF5555;
    }
    .desc {
      font-size: 16px;
      color: #999999;
    }
    .price-grey {
      font-size: 32px;
    }
    &__header {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: #FFFFFF;
      box-shadow: 0 0 7px 0 rgba(19,32,46,0.08);
      font-size: 18px;
      color: #666666;
      .box {
        display: flex;
        justify-content: space-between;
        max-width: 1180px;
        margin: 0 auto;
      }
    }
    &__detail {
      max-width: 1200px;
      font-size: 16px;
      color: #2E3135;
      margin: 14px auto;
      display: flex;
      justify-content: space-between;

      .left {
        flex: 2;
      }
      .left-top {
        padding: 32px;
      }
      .right {
        padding: 26px;
        flex: 1;
        height: 195px;
        background: #F2F9FF;
        border-radius: 0 4px 4px 0;
        border-radius: 0px 4px 4px 0px;
        &__item {
          &:nth-child(1) {
            margin-bottom: 26px;
          }
        }
      }
    }
    .link {
      font-size: 14px;
      color: #4A90E2;
    }
  }
</style>
