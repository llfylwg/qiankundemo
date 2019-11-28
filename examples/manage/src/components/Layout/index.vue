<template>
  <div :class="classObj" class="app-wrapper">
    <!--进度条显示-->
    <div class="progress-wrapper" v-if="progress.showProgressBar">
      {{progress.tipName}}
      <el-progress :text-inside="true" :stroke-width="18" :percentage="progress.progressPercentage" color="#8e71c7">正在下载</el-progress>
    </div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <SideBar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <el-alert v-if="balance < 50000 && routeName === 'recycleOrderList'"
        title="您的账户余额不足 50000 元，会影响您的回收结算，请您及时充值哦～"
        type="warning"
        :closable="false"
        center
        show-icon>
      </el-alert>
      <app-main/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import { Navbar, SideBar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    SideBar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      balance: state => state.app.balance,
      progress: state => state.app.progress
    }),
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/assets/css/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .progress-wrapper {
    position: fixed;
    right: 20px;
    bottom: 30px;
    width: 300px;
    z-index: 99;
    font-size: 14px;
    color: orange;
  }
</style>
