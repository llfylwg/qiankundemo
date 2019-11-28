<template lang="html">
  <div >
      <p class="edit" @click="priceChange">{{optData.price}}
        <span class="el-icon-edit"></span>
      </p>
      <!-- <p>建议售价：{{optData.priceArea['suggestPrice']}}</p> -->
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
    priceChange () {
      this.$emit('changeBatchPrice', this.optData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
