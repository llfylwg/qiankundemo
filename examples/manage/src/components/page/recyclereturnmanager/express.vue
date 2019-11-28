<template lang="html">
  <el-dialog title="物流信息" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
    <p v-if="info">
      {{info}}
    </p>
  </el-dialog>
</template>

<script>
export default {
  props: ['filter', 'optData'],
  data () {
    return {
      dialogFormVisible: true,
      info: null
    }
  },
  created () {
    const { orderId } = this.optData
      this.$http.get('/partner/recycle/getExpressInfo', {
        orderId: orderId
      }).then(res => {
        const { code, data } = res
        if (code == 0 ) {
          this.info = data
        }
    }).catch(e => {
        this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
        })
    })
  },
  methods: {
    modalClose () {
      this.$emit('modalClose')
    }
  }
}
</script>

<style lang="scss">
</style>
