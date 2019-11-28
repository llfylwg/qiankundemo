<template lang="html">
  <div >
    <p class="edit">{{optData.stock}}
      <span class="el-icon-edit"  @click="inventoryChange"></span>
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
    }
  },
  methods: {
    inventoryChange () {
      this.$emit('inventoryChange', this.optData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
