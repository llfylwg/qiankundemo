<template lang="html">
  <div class=""  >

    <!-- 竞拍价 -->
    <template v-if="priceSlot == 'martAuctionPrice'">
      <section v-if="optData.auctionPriceEditable">
        <p class="edit" @click="priceChange('martAuctionPrice', optData.martAuctionPrice, optData.id)">{{optData.martAuctionPrice}}
          <span class="el-icon-edit"></span></p>
      </section>
      <span type="text" v-else>{{optData.martAuctionPrice}} </span>
    </template>

    <!-- 一口价 -->
    <template v-if="priceSlot == 'martInspectPrice'">
      <section v-if="optData.inspectPriceEditable">
        <p class="edit" @click="priceChange('martInspectPrice', optData.martInspectPrice, optData.id)">{{optData.martInspectPrice}}
          <span class="el-icon-edit"></span></p>
      </section>
      <span type="text" v-else>{{optData.martInspectPrice}} </span>
    </template>

    <!-- 保底价 -->
    <template v-if="priceSlot == 'martFlootPrice'">
      <section v-if="optData.floorPriceEditable">
        <p class="edit" @click="priceChange('martFlootPrice', optData.martFlootPrice, optData.id)">{{optData.martFlootPrice}}
          <span class="el-icon-edit"></span>
        </p>
        <p v-if="optData.bargainPrice">
          <el-button @click="priceChange('martFlootPrice', optData.martFlootPrice, optData.id)" type="text">浮动-{{optData.bargainPrice}}</el-button>
        </p>
      </section>
      <div type="text" v-else>
        <p>{{optData.martFlootPrice}}</p>
        <p v-if="optData.bargainPrice">浮动-{{optData.bargainPrice}}</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    priceSlot: {
      type: String,
      default: ''
    },
    optData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created () {
    console.log(123)
  },
  methods: {
    priceChange (...arg) {
      this.$emit('priceChange', ...arg)
    }
  }
}
</script>

<style lang="scss">
</style>
