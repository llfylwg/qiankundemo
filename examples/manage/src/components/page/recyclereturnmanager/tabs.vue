<template lang="html">
  <ul type="flex" class="row-tabs">
    <li v-for="(item, key) in tabs" :key="key" class="tab-item-box">
      <el-badge :value="item.cnt" class="box-badge" :hidden="item.cnt === 0">
        <div class="tab-item" :class="item['code'] == activeCode ? 'active' : ''" @click="selectItem(item['code'])">
          {{item['desc']}}
        </div>
      </el-badge>
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
var CancelToken = axios.CancelToken
var source = CancelToken.source()
export default {
  data () {
    return {
      activeCode: '0',
      statusList: []
      // tabs: []
    }
  },
  props: ['tabs', 'tabChange'],
  created () {
    this.activeCode = this.$route.query['orderType'] || '0'
    this.getTabList()
    // this.getStatusList()
  },
  watch: {
      tabChange () {
          // this.getStatusList()
      }
  },
  methods: {
    getTabList () {
      !this.tabs &&
      this.$http.get('wholesale/order/statusList', {}).then(res => {
        this.tabs = res['data']
        this.tabs.splice(this.tabs.length - 2, 2)
      })
    },
    // getStatusList () {
    //   this.$http.get('partner/recycle/getOrderCount').then(res => {
    //     if (res.code === 0) {
    //       this.statusList = res.data
    //     }
    //   })
    // },
    getBadge (item) {
      const status = this.statusList.filter(v => {
        return item.code == v.statusCode
      })[0] || {}
      return status.num || 0
    },
    selectItem (i) {
      this.activeCode = i
      // console.log(i)
      // this.statusList = this.statusList.map(item => {
      //   if (item.statusCode == i) {
      //     item.num = 0
      //     return item
      //   }
      //   return item
      // })
      this.$emit('selectTab', i)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-item-box{
  display: inline-block;
}
  .tab-item {
    border-radius: 3px;
    height: 40px;
    width: 172px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #2E3135;
    background: #F8F8F8;
    cursor: pointer;
    /*margin-right: 10px;*/
  }
  .active{
    background: #e9f1fb;
    font-size: 14px;
    color: #4A90E2;
  }
  .row-tabs{
    padding-bottom: 20px;
  }
  .box{
    &-badge{
      margin-right: 18px;
    }
  }
</style>
