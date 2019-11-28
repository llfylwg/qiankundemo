<template lang="html">
  <el-dialog title="设置批发价格" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <el-form >
    <el-form-item label="原价格：" label-width="100px">
      <el-input v-model="currentPrice" autocomplete="off" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="价格改为：" label-width="100px">
      <el-input v-model="price" autocomplete="off" placeholder="请填写合理的价格" ></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="modalClose">取消</el-button>
    <el-button type="primary" @click="sureChange" :disabled="canChange">确认</el-button>
  </div>
</el-dialog>

</template>

<script>
export default {
  props: {
    currentPrice: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogFormVisible: true,
      price: ''
    }
  },
  computed: {
    canChange () {
      if (this.price) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.price = ''
  },
  methods: {
    modalClose () {
      this.$emit('modalClose')
    },
    sureChange () {
      this.$http.get('wholesale/product/updateProductPrice', {
        id: this.id,
        price: this.price
      }).then(() => {
        this.modalClose()
        this.$emit('getList')
      })
    }
  }
}
</script>

<style lang="scss">
</style>
