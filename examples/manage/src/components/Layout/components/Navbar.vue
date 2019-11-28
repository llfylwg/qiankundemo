<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <div class="avatar-container">
      <a @click="showDj" class="balance">等级说明</a>
      <div v-if="isPartner"  class="balance" @click="toMoneyDetail">
        账户余额：<el-button type="text">{{app.balance ? app.balance : 0}}</el-button>
      </div>
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <img src="https://youpinoffice.zhuanzhuan.com/favicon.ico" class="user-avatar" alt="">
          <span class="username-wrapper">{{username}}</span>
          <i class="el-icon-arrow-down"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
          <span style="display:block;" @click="logout">
            <i class="iconfont icon-tuichu"></i>
            退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog top="0px" width="360px" :visible.sync="showDialog" class="dengji-dialog">
      <iframe class="iframe" src="https://m.zhuanzhuan.com/u/bmshop/my/description/condition?showall=1" frameborder="0"></iframe>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import { setCookie, getCookie } from '@/assets/js/helper'
export default {
  components: {
    Hamburger
  },
  data () {
    return {
      showDialog: false,
      username: '',
      avatar: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    ...mapState(['app']),
    isPartner () {
      return getCookie('isPartner') == 1
    }
  },
  created () {
    this.$http.get('//ypauthapi.zhuanzhuan.com/user/getCurrentUser').then(({
      code,
      data
    }) => {
      this.isPartner && this.getBalance()
      this.username = data.realName || data.username
      setCookie('groupUid', data.zzGroupUid, 30*24)
      setCookie('uid', data.zzuid, 30*24)
    })
  },
  methods: {
    showDj () {
      this.showDialog = true
    },
    // 余额明细
    toMoneyDetail () {
      window.open('https://m.zhuanzhuan.com/ec#/account/list')
    },
    getBalance () {
      this.$http.get('/partner/common/balance').then(res => {
        res && this.$store.commit('SET_BALANCE', res.data)
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$http.get('//ypauthapi.zhuanzhuan.com/logout').then(res => {
        window.location.replace(`https://open.zhuanzhuan.com`)
      })
    }
  }
}
</script>
<style lang="scss">
  .dengji-dialog {
    .el-dialog__body {
      height: 100vh;
      padding: 0;
      margin-top: 0 !important;
    }
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__headerbtn {
      top: 0;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .iframe {
    width: 100%;
    height: 100%;
  }
.navbar {
  display: flex;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .balance {
    display: inline-block;
    margin-right: 32px;
    font-size: 14px;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      // margin-top: 5px;
      position: relative;
      // display: flex;
      .username-wrapper {
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
        color: #222222;
      }
      .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 10px;
        vertical-align: middle;
      }
      .el-icon-arrow-down {
        // position: absolute;
        // right: -20px;
        // top: 2px;
        margin-left: 8px;
        color: rgba(0,0,0,0.45);
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
      }
    }
  }
}
.user-dropdown{
  top: 30px!important;
}
</style>
