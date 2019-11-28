<template lang="html">
  <ul type="flex" class="row-tabs">
    <li v-for="(item, key) in tabs" :key="key" class="tab-item-box">
      <div class="tab-item" :class="((item['code'] == activeCode && !outerChange) || item['code'] ==  activeTab) ? 'active' : ''" @click="selectItem(item['code'])">{{item['desc']}}
      </div>
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
var CancelToken = axios.CancelToken
var source = CancelToken.source()
export default {
  props: {
    activeTab: {
      type: Number | String,
      default: ''
    },
    outerChange: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeCode: null,
      tabs: []
    }
  },
  created () {
    this.activeCode = this.$route.query['tabCode'] || null
    this.getTabList()
    // this.$emit('selectTab', this.activeCode)
  },
  methods: {
    async getTabList () {
      const num = await this.waitCount()
      this.$http.get('bizProduct/statusTabList', {}).then(res => {
        this.tabs = res['data']
        // this.tabs.splice(3, 0, {
        //   amount: num['data'],
        //   code: 4,
        //   desc: '待议价'
        // })
      })
    },
    async waitCount () {
      return await this.$http.get('bizOrder/waitBargainingCnt')
    },
    selectItem (i) {
      axios.get('', {
       cancelToken: source.token
      }).catch(function(thrown) {
       if (axios.isCancel(thrown)) {
       console.log('Request canceled', thrown.message);
       } else {
       // 处理错误
       }
      })
      source.cancel('Operation canceled by the user.')
      this.activeCode = ''
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
