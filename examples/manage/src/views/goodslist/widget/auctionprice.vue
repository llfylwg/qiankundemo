<template lang="html">
  <div >
    <!-- 卖场/价格 -->
    <div class="" v-if="optData.saleInfoList.length">
      <!-- 卖场价格可更改 -->
      <div v-if="optData.saleInfoList && optData.saleInfoList[0]['priceEditable']">
        <p>{{optData.saleInfoList[0]['desc']}}</p>
        <p class="edit" @click="priceChange('auctionPrice', optData.saleInfoList[0]['price'], optData.id)">{{optData.saleInfoList[0]['price']}}
          <span class="el-icon-edit"></span>
        </p>
      </div>

      <!-- 卖场价格不可更改 -->
      <div v-else>
        <p>{{optData.saleInfoList[0]['desc']}}</p>
        <p>{{optData.saleInfoList[0]['price']}}</p>
      </div>
    </div>
    <p v-else class="no-price">---</p>
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
    }
  },
  methods: {
    priceChange(...arg) {
      if (this.optData.updateTips) {
        this.$confirm(this.optData.updateTips || '', '活动提示', {
          confirmButtonText: '继续改价',
          cancelButtonText: '取消',
        }).then(() => {
          this.$emit('priceChange', ...arg)
        })
      } else {
        this.$emit('priceChange', ...arg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
