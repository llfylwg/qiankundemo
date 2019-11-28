<template>
  <div>
    <iframe :src="radio" allow="autoplay; fullscreen" hidden/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="icon-title">
        <span class="icon-title-zz"></span>
        <span class="icon-name">转转</span>
        <i class="baomai-title">保卖企业版</i>
      </div>
      <el-menu :collapse="isCollapse"
               :default-active="defaultActive"
               active-text-color="#409EFF"
               background-color="#304156"
               class="el-menu-vertical-demo"
               text-color="#bfcbd9">
        <template v-for="(i , k) in navData">
          <el-submenu :index="`${k}`" v-if="i['subFunctionResources'] && i['subFunctionResources'].length">
            <template slot="title">
              <i :class="['iconfont','icon-' + i['resourceCode'], 'icon-size']"></i>
              <span>{{i['resourceName']}}</span>
            </template>
            <el-menu-item-group :key='key' @click.native="pushTo(item)"
                                v-for="(item, key) in i['subFunctionResources']">
              <el-menu-item :index="`${k}-${key}`">
                {{item['resourceName']}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item :index="`${k}`" @click="pushTo(i)" v-else>
            <i :class="['iconfont','icon-' + i['resourceCode'], 'icon-size']"></i>
            <span slot="title">
              {{i['resourceName']}}
              <i class="circle-point" v-if="showCircleRedPoint(i)"></i>
              <i class="count-point" v-if="showCountPoint(i)">{{unreadCount}}</i>
            </span>
          </el-menu-item>
        </template>

        <!-- 结算管理目前未接入此系统  需要单独href跳转 -->
        <el-submenu @click.native="settlementAct" class="jiesuan-box" index="100">
          <template slot="title">
            <i class="iconfont icon-jiesuan icon-size"></i>
            <span slot="title">结算管理</span>
          </template>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>

</template>

<script>
  import { get } from '@/assets/js/axios'
  import { getCookie } from '@/assets/js/helper'

  export default {
    props: ['isCollapse'],
    data () {
      return {
        defaultActive: '',
        barginNum: 1,
        navData: [],
        groupUid: '',
        radio: '',
        hasUnreadMsg: false,
        unreadCount: 0,
        timer: null
      }
    },
    created () {
      get('http://ypauthapi.zhuanzhuan.com/function/listMenuTree?sysCode=YPEE').then(res => {
        this.navData = res.data
        // 特殊判断商品管理的权限，如果有商品管理权限，才会调用waitBargainingCnt的接口
        const menus = this.navData.filter(item => {
          return item.funcPath == 'goodsList'
        })
        if (menus.length > 0) {
          this.getWaitBargin()
        }
        this.getDefaultActive()
        this.setTitle()
        this.setChat()
      })
    },
    watch: {
      '$route.path' (n) {
        this.getDefaultActive()
      }
    },
    methods: {
      setChat () {
        const hasChat = this.navData.some(item => item['resourceCode'] == 'YPEE_WHOLESALE_CHAT')
        if (hasChat) {
          this.getIMNewMessage()
          this.timer = setInterval(() => {
            this.radio = ''
            this.getIMNewMessage()
          }, 15000)
        }
      },
      setRadio () {
        this.radio = 'https://img1.zhuanstatic.com/common/u/media/71816.mp3'
      },
      getIMNewMessage () {
        this.$http.get('/partner/common/getUnReadMsgCount').then(res => {
          const count = Number(res.data.count)
          if (count > 0) {
            if (this.unreadCount < count) {
              this.setRadio()
            }
          }
          this.unreadCount = count > 99 ? '99+' : (count || 0)
        }).catch(e => {
          clearInterval(this.timer)
        })
      },
      navHref (url) {
        window.open(url)
      },
      settlementAct () {
        if (getCookie('groupUid') == getCookie('uid')) {
          return this.navHref('https://m.zhuanzhuan.com/ec/#/Statement')
        }
        this.$message.error('对不起，暂时不能跳转！')
      },
      getWaitBargin () {
        get('bizOrder/waitBargainingCnt').then(res => {
          this.barginNum = res['data']
        })
      },
      getDefaultActive () {
        const name = this.$route.name
        // console.log(path)
        this.navData.map((item, key) => {
          if (`${item['funcPath']}` === name) {
            console.log(key, 'key')
            this.defaultActive = String(key)
            return
          } else if (item['subFunctionResources']) {
            item['subFunctionResources'].map((i, k) => {
              if (`${i['funcPath']}` === name) {
                this.defaultActive = `${key}-${k}`
                return
              }
            })
          }
        })
      },
      setTitle (name) {
        if (name) {
          document.title = '多媒体后台-' + name
        } else {
          this.navData.map(item => {
            item.children && item.children.length && item.children.map(child => {
              if (child.url === this.$route.path && this.canShow(child)) {
                document.title = '多媒体后台-' + child.name
              }
            })
          })
        }
      },
      canShow (item) {
        return item.isEnabled && item.type === 6
      },
      handleCollapse () {
        this.isCollapse = !this.isCollapse
      },
      pushTo (item) {
        if (item.funcPath) {
          const reg = /^((http(s)):)\/\/./
          if (reg.test(item.funcPath)) {
            return this.navHref(item.funcPath)
          }
          if (item['funcPath'] === 'goodsList' && this.barginNum) {
            this.barginNum = ''
            this.$router.push({
              path: item.funcPath,
              query: {
                tabCode: 4
              }
            })
          } else {
            this.$router.push({path: item.funcPath})
          }
        }
      },
      // 是否展示红点提示
      showCircleRedPoint (item) {
        return item['funcPath'] == 'goodsList' && this.barginNum
      },
      showCountPoint (item) {
        return item['resourceCode'] == 'YPEE_WHOLESALE_CHAT' && this.unreadCount > 0
      }
    }
  }
</script>
<style lang="scss" scoped>
  .count-point {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: #ff5555;
    color: white;
    font-size: 10px;
    text-align: center;
    border-radius: 100%;
    margin-left: -6px;
    margin-top: -12px;
  }
  .circle-point {
    display: inline-block;
    width: 7px;
    height: 7px;
    background: #ff5555;
    border-radius: 50%;
    margin-left: 3px;
    margin-bottom: 3px;
  }
</style>
<style lang="scss">
  // copy的css  待优化
  #app {
    // 主体区域
    .icon-title {
      height: 88px;
      border-bottom: 1px solid #121728;
      background-color: rgb(48, 65, 86);
    }

    .icon-title-zz {
      background: url('../../../assets/img/logo.png') no-repeat center;
      background-size: contain;
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-left: 10px;
      margin-top: 20px;
    }

    .icon-name {
      margin-left: 8px;
      vertical-align: top;
      margin-top: 32px;
      font-size: 18px;
      color: #FFF;
      display: inline-block;
      font-weight: bold;
    }

    .baomai-title {
      display: inline-block;
      font-size: 4px;
      color: #FFF;
      vertical-align: top;
      margin-top: 40px;
      margin-left: 3px;
    }

    .jiesuan-box .el-icon-arrow-down {
      display: none;
    }

    .icon-size {
      font-size: 10px;
      padding-right: 10px;
      font-weight: bold;
    }

    .main-container {
      min-height: 100%;
      transition: margin-left .28s;
      margin-left: 180px;
      position: relative;
    }

    // 侧边栏
    .sidebar-container {
      transition: width 0.28s;
      user-select: none;
      width: 180px !important;
      height: 100%;
      position: fixed;
      font-size: 0px;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
      //reset element-ui css
      .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
      }

      .el-scrollbar {
        height: 100%;
      }

      .el-scrollbar__bar.is-vertical {
        right: 0px;
      }

      .scrollbar-wrapper {
        overflow-x: hidden !important;

        .el-scrollbar__view {
          height: 100%;
        }
      }

      .is-horizontal {
        display: none;
      }

      a {
        display: inline-block;
        width: 100%;
        overflow: hidden;
      }

      .svg-icon {
        margin-right: 16px;
      }

      .el-menu {
        border: none;
        height: 100%;
        width: 100% !important;
      }
    }

    .el-menu-item.is-active {
      background-color: #121728 !important;
      color: #FFF !important;
      box-sizing: border-box;
      border-left: 5px solid #22A8FF;
    }

    .hideSidebar {
      .icon-name {
        opacity: 0;
      }

      .baomai-title {
        opacity: 0;
      }

      .sidebar-container {
        width: 60px !important;
      }

      .main-container {
        margin-left: 60px;
      }

      .submenu-title-noDropdown {
        padding-left: 10px !important;
        position: relative;

        .el-tooltip {
          padding: 0 10px !important;
        }
      }

      .el-menu-item-group {
        display: none;
      }

      .jiesuan-box {
        .el-submenu__title span {
          display: none;
        }
      }

      .el-submenu {
        overflow: hidden;

        & > .el-submenu__title {
          .el-submenu__icon-arrow {
            display: none;
          }
        }
      }

      .el-menu-item span {
        opacity: 0;
      }

      .el-submenu__title span {
        display: none;
      }

      .el-menu--collapse {
        .el-submenu {
          & > .el-submenu__title {
            & > span {
              height: 0;
              width: 0;
              overflow: hidden;
              visibility: hidden;
              display: inline-block;
            }
          }
        }
      }
    }

    .sidebar-container .nest-menu .el-submenu > .el-submenu__title,
    .sidebar-container .el-submenu .el-menu-item {
      min-width: 180px !important;
      background-color: #304156 !important;

      &:hover {
        background-color: #001528 !important;
      }
    }

    .el-menu--collapse .el-menu .el-submenu {
      min-width: 180px !important;
    }

    //适配移动端
    .mobile {
      .main-container {
        margin-left: 0px;
      }

      .sidebar-container {
        transition: transform .28s;
        width: 180px !important;
      }

      &.hideSidebar {
        .sidebar-container {
          transition-duration: 0.3s;
          transform: translate3d(-180px, 0, 0);
        }
      }
    }

    .withoutAnimation {
      .main-container,
      .sidebar-container {
        transition: none;
      }
    }
  }
</style>
