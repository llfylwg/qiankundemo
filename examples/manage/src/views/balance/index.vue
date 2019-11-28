<template>
  <div>
    <div class="banner">
      <img class="banner__bg" src="https://pic2.zhuanstatic.com/zhuanzh/n_v2044cdb3b8df048e58e301a1e0cd26555.png" alt="">
      <div class="banner__header">
        <div class="box">
          <div class="left">
            <a @click="goIndex">保卖企业版</a>&nbsp; | &nbsp;<span>余额账户</span>
          </div>
          <a class="right" @click="goIndex">返回首页</a>
        </div>
      </div>
      <div class="banner__main">
        <div class="banner-box">
          <div class="banner-box__main">
            <p class="title">手机进货 找保卖</p>
            <p class="title">全国的好手机都在这里</p>
            <div class="tengxun">
              <span class="tengxun-icon"></span>
              <span>腾讯投资成员企业</span>
            </div>
            <p>行业伙伴的共同选择 值得信赖</p>
          </div>
          <div class="banner-box__code">
            <img :src="code" alt="">
            <p>微信扫码登录</p>
            <p>快速充值或提现</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer__item" v-for="item in items">
        <div class="icon" :style="{backgroundImage: `url(${item.pic})`}"></div>
        <p>{{item.name}}</p>
      </div>
    </div>
    <qr-code :event-hub="eventHub"
             :fail-callback="failCallback"
             :get-code="getCode"
             :success-callback="orderCallback"
             :text="msg"
             :timeout-callback="failCallback">
    </qr-code>

  </div>
</template>

<script>
  import QrCode from '@zz-vc/zzpcqr'
  import Vue from 'vue'

  export default {
    data () {
      return {
        msg: '请使用微信扫码登录',
        code: '',
        eventHub: new Vue(),
        items: [
          {
            name: '优质好货 价格更优',
            pic: 'https://pic1.zhuanstatic.com/zhuanzh/n_v2b6e4992905ef4a7d88c16b9a18cd33da.png'
          },
          {
            name: '在线交易 简单便捷',
            pic: 'https://pic6.zhuanstatic.com/zhuanzh/n_v288e016416f0049c39f5b0f36e77064e7.png'
          }
        ]
      }
    },
    components: {
      QrCode
    },
    mounted () {
      this.sendCode()
    },
    methods: {
      goIndex () {
        location.href = 'https://open.zhuanzhuan.com'
      },
      sendCode () {
        this.eventHub.$emit('getCode', {
          page: `pages/common/confirm-pc`,
          config: {
            source: 111,
            width: 400
          }
        })
      },
      getCode (code) {
        this.code = code
      },
      orderCallback () {
        this.$router.push({
          path: '/balance/detail'
        })
      },
      // 扫码失败回调
      failCallback () {
        // location.reload()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tengxun {
    display: flex;
    align-items: center;
    margin-top: 26px;
  }
  .tengxun-icon {
    width: 128px;
    height: 37px;
    background: url('~@/assets/img/balance/tengxun.png') no-repeat;
    background-size: contain;
    margin-right: 12px;
  }
  .footer {
    width: 1200px;
    display: flex;
    margin: 40px auto 0;
    &__item {
      background: white;
      flex: 1;
      margin-right: 6px;
      text-align: center;
      padding: 52px 0;
      .icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
  .banner {
    width: 100%;
    color: #fff;
    font-size: 25px;
    font-family: PingFangSC-Medium;
    &__bg {
      width: 100%;
      min-height: 520px;
    }
    &__header {
      position: absolute;
      top: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: rgba(35,42,64,0.15);
      font-size: 18px;
      color: #FFFFFF;
      .box {
        display: flex;
        justify-content: space-between;
        max-width: 1200px;
        min-width: 900px;
        padding: 0 100px;
        margin: 0 auto;
      }
    }
    &__main {
      position: absolute;
      top: 20%;
      width: 100%;
    }
  }
  .banner-box {
    max-width: 1200px;
    min-width: 900px;
    padding: 0 100px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    &__main {
      .title {
        font-size: 64px;
      }
    }

    &__code {
      border-radius: 4px;
      text-align: center;
      font-size: 16px;
      color: #3C3F43;
      background: white;
      padding: 20px;
      img {
        width: 190px;
        height: 190px;
        margin: 0 auto 14px;
      }
    }
  }
</style>
