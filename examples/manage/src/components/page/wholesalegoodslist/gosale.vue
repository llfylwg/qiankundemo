<template lang="html">
  <el-dialog title="上架提示" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <p>确定要上架吗？</p>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="sure" >确认上架</el-button>
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
          ids += item['productId'] + ','
        })
        this.$http.get('wholesale/product/up', {ids: ids}).then(({code, msg}) => {
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
        this.$http.get('wholesale/product/up', {ids: this.optData['productId']}).then(({code, msg}) => {
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
