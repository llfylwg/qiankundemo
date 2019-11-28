<template lang="html">
  <ul type="flex" class="row-tabs">
    <li v-for="(item, key) in tabs" :key="key" class="tab-item-box">
      <div class="tab-item" :class="item['code'] == activeCode ? 'active' : ''" @click="selectItem(item['code'])">{{item['desc']}}
      </div>
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
      activeCode: null,
      tabs: []
    }
  },
  created () {
    this.activeCode = this.$route.query['tabCode'] || ''
    this.getTabList()
  },
  methods: {
    getTabList () {
      this.$http.get('batchOrder/statusTabList', {}).then(res => {
        this.tabs = res['data']
        console.log(this.tabs[0]['code'], this.activeCode, this.tabs[0]['code'] == this.activeCode, 111111)
      })
    },
    selectItem (i) {
      this.activeCode = i
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
    margin-right: 10px;
  }
  .active{
    background: #e9f1fb;
    font-size: 14px;
    color: #4A90E2;
  }
  .row-tabs{
    padding-bottom: 20px;
  }
</style>
