<template lang="html">
  <el-dialog title="" :visible.sync="dialogFormVisible" width="30%" :modal="false" :show-close="false" :before-close="modalClose">
  <p>该商品平台正在为您拍照，拍照完成后会自动上架</p>
  <p>该商品等待进入下一场竞拍，竞拍开始时会自动加入竞拍</p>
</el-dialog>

</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: true,
    }
  },
  created () {
  },
  methods: {
    modalClose () {
      this.$emit('modalClose')
    },
    exportData () {
      // 导出
    }
  }
}
</script>

<style lang="scss">
</style>
