<template lang="html">
  <el-dialog title="退回提示" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <div class="mark-list-box">
    商品会根据您的签约地址进行原路退回，确定要退回商品吗？
  </div>
  <div slot="footer" >
    <el-button type="primary" @click="sureChange" >确认</el-button>
    <el-button @click="modalClose">取消</el-button>
  </div>
 </el-dialog>

</template>

<script>
export default {
  props: ['optData'],
  data () {
    return {
      dialogFormVisible: true
    }
  },
  created () {
  },
  methods: {
    sureChange () {
      let ids = ''
      if (this.optData instanceof Array) {
        this.optData.map(item => {
          ids += item['id'] + ','
        })
      } else {
        ids = this.optData['id']
      }
      this.$http.get('bizReturnPkg/applyReturn', {
        productIdsStr: ids
      }).then(({code,msg}) => {
        if (code === 0) {
          this.$emit('getList')
          this.$message({
            message: msg,
            type: 'success'
          })
        }
        this.modalClose()
      }).catch(e => {
        this.modalClose()
      })
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
