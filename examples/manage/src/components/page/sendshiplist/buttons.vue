<template lang="html">
  <div class="buttons-wrap" >
    <el-button size="mini" @click.native="exportList">导出数据</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    exportList () {
      this.$emit('exportData')
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons-wrap{
  padding-bottom: 20px;
}
.upload-button{
  display: inline-block;
  margin-left: 10px;
}
</style>
