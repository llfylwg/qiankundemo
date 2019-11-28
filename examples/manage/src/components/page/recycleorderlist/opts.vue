<template lang="html">
  <p class="opt-box" >
    <span
      @click="handleClickToDetail(data, item)"
      size="mini"
      class="edit"
      v-for="(item, k) in opts" v-if="data.operations && data.operations.indexOf(item['code']) > -1"
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
          name: '线下卖出',
          code: 'offlineSell'
        },
        {
          name: '线上售卖',
          code: 'selectSell'
        },
        {
          code: 'orderDetail',
          name: '订单详情'
        },
        {
          code: 'firstOffer',
          name: '首次报价'
        },
        {
          code: 'receipt',
          name: '确认收货'
        },
        {
          code: 'secondOffer',
          name: '二次报价'
        },
         {
          code: 'confirmBuying',
          name: '确认回收'
        },
        {
          code: 'getExpressInfo',
          name: '查看物流'
        },
        {
          code: 'pay',
          name: '打款'
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
          code: 'confirmSelling',
          name: '确认售卖'
        },
        {
          code: 'cancelOrder',
          name: '我不卖了'
        },
        {
          name: '立即发货',
          code: 'deliver'
        },
        {
          name: '去收货',
          code: 'qcReceipt'
        },
        {
          name: '去质检',
          code: 'qcCheck'
        },
        {
          name: '确认收货（退）',
          code: 'receiptReturns'
        },
        {
          name: '退货管理',
          code: 'returnManage'
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
