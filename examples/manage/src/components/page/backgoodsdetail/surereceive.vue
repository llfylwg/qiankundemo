<template lang="html">
  <el-dialog title="确认收货" :visible.sync="dialogFormVisible" width="30%" :before-close="closeModal">
  <div class="mark-list-box">
    请确保收到货品无误后再确认收货，是否确认收货？
  </div>
  <div slot="footer" >
    <el-button type="primary" @click="sure" >确认收货</el-button>
    <el-button @click="closeModal">取消</el-button>
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
    closeModal () {
      this.$emit('closeModal')
    },
    sure () {
      this.$http.get('bizReturnPkg/confirm', {
        bizReturnId: this.$route.query['id']
      }).then(({code, msg}) => {
        if (code === 0) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.$emit('getDetail')
        }
        this.$emit('closeModal')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-tip{
  text-align: center;
  color: #C0C4CC;
}
</style>
