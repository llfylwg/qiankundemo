<template lang="html">
  <el-dialog title="确认收货" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
    <p>请仔细核对物品，确认无误后再确认收货。</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalClose">取消</el-button>
      <el-button type="primary" @click="sure" >确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['filter'],
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
    },
    sure () {
      this.$emit('sureReceipt')
    }
  }
}
</script>

<style lang="scss">
</style>
