<template lang="html">
  <el-dialog title="确认收货" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
    <p>面交发货后，无法再次填写物流，请确认已与买家协商一致当面交易，是否确认面交？</p>
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
      this.$emit('sureFaceReturn')
      this.$emit('modalClose')
    }
  }
}
</script>

<style lang="scss">
</style>
