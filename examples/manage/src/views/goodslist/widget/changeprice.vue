<template lang="html">
  <el-dialog title="设置价格" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
  <el-form v-if="currentPrice">
    <el-form-item label="原始价格：" label-width="100px">
      <el-input v-model="currentPrice" autocomplete="off" placeholder="请填写合理的价格" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="改后价格：" label-width="100px">
      <el-input v-model="price" autocomplete="off" placeholder="请填写合理的价格" ></el-input>
    </el-form-item>
  </el-form>
  <el-form v-else>
    <el-form-item label="价格：" label-width="100px">
      <el-input v-model="price" autocomplete="off" placeholder="请填写合理的价格" ></el-input>
    </el-form-item>
  </el-form>
  <div class="price-float" v-if="showBargainPrice && currentMap && currentMap.length" >
     <div class="label">议价浮动:</div>
     <el-button @click="setBargainPrice(currentMap[0])">- {{currentMap[0]}}</el-button>
     <el-button @click="setBargainPrice(currentMap[1])">- {{currentMap[1]}}</el-button>
     <el-button @click="setBargainPrice(currentMap[2])">- {{currentMap[2]}}</el-button>
  </div>
  <div class="text">
    特别说明：当最高买家出价虽低于保底价，但在议价浮动范围内时，将自动成交，否则将自动流拍
  </div>
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
    setPriceType: {
      type: String,
      default: ''
    },
    productId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogFormVisible: true,
      price: '',
      bargainPrice: null
    }
  },
  watch: {
    price() {
      this.bargainPrice = null
    }
  },
  computed: {
    currentMap() {
      let tempPrice
      if(this.currentPrice){
        tempPrice = this.currentPrice.split(',').join('')
      } else {
        tempPrice = 0
      }
      let p = this.price || tempPrice

      if( (p >= 1 && p <= 99) || !p) return [5, 10, 15]
      if(p >= 100 && p <= 499) return [10, 15, 20]
      if(p >= 500 && p <= 999) return [15, 30, 45]
      if(p >= 1000 && p <= 1999) return [20, 40, 60]
      if(p >= 2000 && p <= 3499) return [30, 60, 90]
      if(p >= 3500 && p <= 4999) return [40, 70, 100]
      if(p >= 5000) return [50, 100, 150]
    },
    showBargainPrice () {
      let tempPrice
      if(this.currentPrice){
        tempPrice = this.currentPrice.split(',').join('')
      } else {
        tempPrice = 0
      }
      if (this.setPriceType !== 'martFlootPrice') {
        return false
      }
      // 刚打开弹框 还没操作时 当前已有价格 并且没有输入价格 显示议价浮动 以当前价格为基准返回议价浮动范围
      if (tempPrice > 15 && this.price === '') {
        return true
      }
      // 其余各种情况 都根据price 来判断 是否显示议价浮动
      if (this.price) {
        if (this.price > 15) {
          return true
        } else {
          return false
        }
      }
    },
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
    setBargainPrice (price){
      this.bargainPrice = price
    },
    modalClose () {
      this.$emit('modalClose')
    },
    sureChange () {
      // 修改价格
      const priceApiList = {
        martFlootPrice: 'bizProduct/setFloorPrice', // 暗拍价格修改
        martInspectPrice: 'bizProduct/setInspectPrice', // 明拍价格修改
        martAuctionPrice: 'bizProduct/setAuctionPrice', // 一口价格修改
        auctionPrice: 'bizProduct/setInspectPrice' // 卖场/价格  处修改
      }
      let param = {
        price: this.price,
        productId: this.productId
      }
      if (this.setPriceType == 'martFlootPrice') {
        if(!this.bargainPrice && this.price > 15) {
          this.$message({
            message: '请勾选议价浮动',
            type: 'error'
          });
          return
        }
        param.bargainPrice = this.bargainPrice || 0
      }
      this.$http.get(priceApiList[this.setPriceType], param).then(({code, msg}) => {
        if (code === 0) {
          this.$emit('getList')
          this.$message({
            message: msg,
            type: 'success'
          })
        }
        this.modalClose()
      }).catch(e => {
        if (this.setPriceType === 'auctionPrice') this.$emit('getList');
        this.modalClose()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.price-float{
  .label{
    width: 100px;
    box-sizing: border-box;
    padding-right: 22px;
    display: inline-block;
    text-align: right;
  }
}
</style>
