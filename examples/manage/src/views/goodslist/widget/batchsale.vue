<template lang="html">
  <el-dialog title="批量上架" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <div class="mark-list-box">
    确定要批量上架所选商品吗？
  </div>
  <div slot="footer" >
    <el-button type="primary" @click="sureChange" :disabled="canChange">确认</el-button>
    <el-button @click="modalClose">取消</el-button>
  </div>
</el-dialog>

</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: true
    }
  },
  created () {
  },
  methods: {
    sureChange () {
      // 确认批量上架
      
    },
    modalClose () {
      this.$emit('modalClose')
    }
  }
}
</script>

<style lang="scss" scoped>
// .mark-list-box{
//   text-align: center;
// }
.mark-tip{
  text-align: center;
  color: #C0C4CC;
}
</style>
