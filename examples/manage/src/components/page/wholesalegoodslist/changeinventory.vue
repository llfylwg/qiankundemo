<template lang="html">
  <el-dialog title="设置库存" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <el-form >
    <el-form-item label="原库存：" label-width="100px">
      <el-input v-model="currentInventory" autocomplete="off" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="增减库存：" label-width="100px">
      <el-button icon="el-icon-minus" :disabled="isMinusButtonDisable" circle size="mini" @click="minusInventory"></el-button>
      <el-input v-model="inventory" autocomplete="off" class="input-inventory"></el-input>
      <el-button icon="el-icon-plus" circle size="mini" @click="plusInventory"></el-button>
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
    currentInventory: {
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
      inventory: 0
    }
  },
  computed: {
    canChange () {
      if (this.inventory) {
        return false
      } else {
        return true
      }
    },
    isMinusButtonDisable () {
      return Number(this.currentInventory) + Number(this.inventory) <= 0
    }
  },
  created () {
    this.inventory = 0
  },
  methods: {
    minusInventory () {
      this.inventory = Number(this.inventory) - 1
    },
    plusInventory () {
      this.inventory = Number(this.inventory) + 1
    },
    modalClose () {
      this.$emit('modalClose')
    },
    sureChange () {
      this.$http.get('wholesale/product/increaseStocks', {id: this.id, count: this.inventory}).then(res => {
        this.modalClose()
        this.$emit('getList')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.input-inventory{
  display: inline-block;
  width: 60px;
  margin: 0 10px;
  text-align: center;
}
</style>
