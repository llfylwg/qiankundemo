<template lang="html">
  <p class="opt-box" >
    <span @click="handleClickToDetail(optData, i)" size="mini" class="edit"  v-for="(i, k) in opts" v-if="optData['operation'] && optData['operation'].indexOf(i['code']) > -1" :key="k">{{i['name']}}
    </span>
  </p>
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
          name: '物流信息',
          code: 'viewExpress'
        },
        {
          name: '发货',
          code: 'deliver'
        },
        {
          name: '取消订单',
          code: 'cancel'
        },
        {
          name: '订单改价',
          code: 'modifyPrice'
        },
        {
          name: '免运费',
          code: 'modifyFreight'
        },
        {
          name: '同意退款',
          code: 'agreeRefound'
        },
        {
          name: '我已发货',
          code: 'alreadyDeliver'
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
