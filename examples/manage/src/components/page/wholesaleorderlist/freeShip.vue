<template lang="html">
  <el-dialog title="免运费" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <p>免运费后默认卖家包邮，确认要免除本单的运费吗？</p>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="sure" >确定</el-button>
    <el-button @click="modalClose">取消</el-button>
  </div>
</el-dialog>

</template>

<script>
export default {
  props: ['optData'],
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
    sure () {
      if (this.optData instanceof Array) {
        let ids = ''
        this.optData.map(item => {
          ids += item['orderId'] + ','
        })
        this.$http.get('wholesale/order/freeShipping', {orderIds: ids}).then(({code, msg}) => {
          if (code === 0) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.$emit('getList')
          }
          this.modalClose()
        }).catch(e => {
          this.modalClose()
        })
      } else {
        this.$http.get('wholesale/order/freeShipping', {orderIds: this.optData['orderId']}).then(({code, msg}) => {
          if (code === 0) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.$emit('getList')
          }
          this.modalClose()
        }).catch(e => {
          this.modalClose()
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
