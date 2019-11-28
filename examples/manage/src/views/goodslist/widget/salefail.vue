<template lang="html">
  <el-dialog title="失败提示" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <div class="mark-list-box">
    上架失败，选择已验机卖场前，请先填写一口价
  </div>
  <div slot="footer" >
    <el-button type="primary" @click="sureChange" :disabled="canChange">确认</el-button>
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
