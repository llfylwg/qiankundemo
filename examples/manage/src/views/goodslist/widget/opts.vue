<template lang="html">
  <div class="">
    <span>{{optData['time']}}</span>
    <div v-if="tabCode == 4">
      <p class="edit" @click="handleClickToDetail(optData, {code: 'detail'})">详情</p>
      <p class="edit" @click="handleClickToDetail(optData, {code: 'agreePrice'})">同意</p>
      <p class="edit" @click="handleClickToDetail(optData, {code: 'rejectPrice'})">拒绝</p>
    </div>
    <p class="opt-box" v-else>
      <span @click="handleClickToDetail(optData, i)" size="mini" class="edit"  v-for="(i, k) in opts" v-if="optData['operations'] && optData['operations'].indexOf(i['code']) > -1" :key="k">{{i['name']}}
        <el-tooltip :content="optData['tips']" placement="left-start" effect="light" :offset="30" v-if="optData['tips'] && i['code'] == 'detail'">
          <i class="iconfont icon-wenhao detail-icon"></i>
        </el-tooltip>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    optData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tabCode: {
      type: [Number, String, null],
      default: null
    }
  },
  data () {
    return {
      opts: [
        {
          code: 'detail',
          name: '详情'
        },
        {
          name: '退回',
          code: 'return_apply'
        },
        {
          name: '选择卖场',
          code: 'choose_mart'
        },
        {
          name: '下架',
          code: 'out_of_mart'
        },
        {
          name: '查看物流',
          code: 'return_pkg_info'
        },
        {
          name: '打印二维码',
          code: 'print_qc_code'
        },
        {
          name: '送检',
          code: 'deliver'
        },
        {
          name: '直接卖',
          code: 'directly_sell'
        }
      ]
    }
  },
  methods: {
    handleClickToDetail (...arg) {
      this.$emit('handleClickToDetail', ...arg)
    }
  }
}
</script>

<style lang="css">
</style>
