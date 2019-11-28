<template lang="html">
  <el-dialog
    title="取消订单"
    :visible.sync="dialogVisible"
    width="416px"
    :before-close="closeModal"
    >
    <span class="text-tip">已为您分配质检中心，是否确认取消？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelOrder" type="primary">取消订单</el-button>
      <el-button  @click="closeModal">考虑一下</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: true
    }
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    },
    cancelOrder () {
      this.$emit('cancleSend')
    }
  }
}
</script>

<style lang="scss" scoped>
.text-tip{
  margin-top: 25px;
  font-size: 14px;
  color: #6D6F73;
}

</style>
