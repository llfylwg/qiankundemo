<template lang="html">
  <p class="opt-box" >
    <span
      @click="handleClickToDetail(data, item)"
      size="mini"
      class="edit"
      v-for="(item, k) in opts" v-if="data['operations'] && data['operations'].indexOf(item['code']) > -1"
      :key="k">{{item['name']}}
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
    orderType: {
      type: [Array],
      default: () => {
        return []
      }
    },
    tabCode: {
      type: [Number, String, null],
      default: null
    }
  },
  data () {
    return {
      data: {},
      opts: [
        {
          code: 'orderDetail',
          name: '订单详情'
        },
        {
          code: 'deliverReturns',
          name: '发货'
        },
        {
          code: 'deliverFaceToFaceReturns',
          name: '面交发货'
        },
        {
          name: '去发货',
          code: 'qcReturn'
        }
      ]
    }
  },
  methods: {
    handleClickToDetail (...arg) {
      this.$emit('handleClickToDetail', ...arg)
    },
    getType () {
      const { statusCode } = this.optData
      const type = this.orderType.filter(item => {
        return item.code == statusCode
      })[0]
      if (!type) {
        this.data = Object.assign({}, this.optData)
        return
      }
      this.data = Object.assign({}, this.optData)
      // if (!type) {
      //   this.data = Object.assign({}, this.optData, {
      //     operation: ['detail']
      //   })
      //   return
      // }
      // const { operation } = type
      // this.data = Object.assign({}, this.optData, { operation })
    }
  },
  mounted () {
    this.getType()
  }
}
</script>

<style lang="css">
</style>
