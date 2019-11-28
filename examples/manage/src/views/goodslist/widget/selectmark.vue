<template lang="html">
  <el-dialog title="选择卖场" :visible.sync="dialogFormVisible" width="486px" :before-close="modalClose">
  <div class="mark-list-box">
    <el-radio v-model="martId" v-for="(i,k) in martList" :label="i['code']" :key="k">{{i['desc']}}</el-radio>
  </div>

  <p class="mark-tip" v-if="!martId || awaysShowTip">特别提示：填写一口价后才可选择已验机卖场</p>
  <p class="mark-tip" v-if="!martId || awaysShowTip">填写保底价后才可选择暗拍卖场</p>

  <p class="into-mart" v-else-if="martId == 1 && rulePrice['martAuctionPrice']['price']">您的商品将以 <span class="martprice">{{rulePrice['martAuctionPrice']['price']}}元</span> 进入明拍卖场</p>

  <p class="into-mart" v-else-if="martId == 2 && rulePrice['martInspectPrice']['price']">您的商品将以 <span class="martprice">{{rulePrice['martInspectPrice']['price']}}元</span> 进入已验机卖场</p>

  <p class="into-mart" v-else-if="martId == 3 && rulePrice['martFlootPrice']['price']">
    您的商品将以
    <span class="martprice">
      {{rulePrice['martFlootPrice']['price']}}元
    </span>
    进入暗拍卖场
    <span v-if="optData.bargainPrice">议价下浮范围<span class="martprice">{{optData.bargainPrice}}</span>元</span>
  </p>

  <p class="into-mart" v-else-if="martId == 4"></p>

  <el-form ref="form" label-width="80px" v-else>
    <el-form-item label="请设置进入卖场价格：" class="label-text">
      <el-input v-model="martPrice" class="input-price"></el-input>
    </el-form-item>
  </el-form>

  <el-alert
      v-if="optData.statusDesc === '二次质检不通过'"
      style="margin-top: 10px"
      title="由于该商品二次质检结果不一致，将使用新质检报告来上架，请根据实际情况对商品进行调价。"
      type="info"
      :closable=false
      show-icon>
  </el-alert>

  <el-alert
      v-if="!martList.length"
      style="margin-top: 10px"
      title="您选择的商品上架操作不存在交集，无法批量上架，请单个操作。"
      type="info"
      :closable=false
      show-icon>
  </el-alert>

  <div class="price-float"
    v-if="(martId == 3 && !isPiliangShangjia)
      && !rulePrice['martFlootPrice']['price']
      && martPrice > 15
    ">
    <div class="label">议价浮动:</div>
    <el-radio-group v-model="bargainPrice" size="medium">
      <el-radio-button v-for="(item, index) in currentMap" :key="index" :label="item">
        - {{item}}
      </el-radio-button>
    </el-radio-group>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="sureChange" :disabled="canChange">确认上架</el-button>
    <el-button @click="modalClose" class="cancle">取消</el-button>
  </div>
</el-dialog>

</template>

<script>
export default {
  props: ['optData'],
  data () {
    return {
      isPiliangShangjia: false,
      selectMart: [],
      dialogFormVisible: true,
      martId: '',
      rulePrice: {
        martAuctionPrice: {
          code: 1,
          price: ''
        },
        martInspectPrice: {
          code: 2,
          price: ''
        },
        martFlootPrice: {
          code: 3,
          price: ''
        }
      },
      martPrice: '',
      awaysShowTip: false,
      canChange: true,
      martList: [],
      bargainPrice: null
    }
  },
  watch: {
    martId (n ,o) {
      this.martPrice = ''
      if (n === 1) {
        // 选择明拍卖场
        this.canChange = false
      } else if (n === 2) {
        // 选择已验机卖场
        if (this.optData instanceof Array) {
          this.canChange = false
          return
        }
        this.canChange = !this.rulePrice['martInspectPrice']['price'];
      } else if (n === 3) {
        // 选择暗拍卖场
        if (this.optData instanceof Array) {
          this.canChange = false
          return
        }
        this.canChange = !this.rulePrice['martFlootPrice']['price'];
      } else if (n === 4) {
        this.canChange = false
      } else {
        this.martPrice = ''
        this.canChange = true
      }
    },
    martPrice (n, o) {
      this.bargainPrice = null
      this.canChange = !([2, 3].indexOf(this.martId) > -1 && n);
    }
  },
  computed: {
    currentMap() {
      let p = this.martPrice
      if( (p >= 1 && p <= 99) || !p) return [5, 10, 15]
      if(p >= 100 && p <= 499) return [10, 15, 20]
      if(p >= 500 && p <= 999) return [15, 30, 45]
      if(p >= 1000 && p <= 1999) return [20, 40, 60]
      if(p >= 2000 && p <= 3499) return [30, 60, 90]
      if(p >= 3500 && p <= 4999) return [40, 70, 100]
      if(p >= 5000) return [50, 100, 150]
    }
  },
  created() {
    // 点击批量上架
    if (Array.isArray(this.optData)) {
      this.isPiliangShangjia = true;
      this.awaysShowTip = true;
      // this.$http.get('common/martList').then(res => {
      //   this.martList = res['data']
      // });

      // 计算批量上架支持卖场的交集
      const martList = [{"code": 1, "desc": "明拍卖场"}, {"code": 2, "desc": "已验机卖场"},
        {"code": 3, "desc": "暗拍卖场"}, {"code": 4, "desc": "线下卖场"}];
      let markBinMap = parseInt('1111', 2);
      this.canChange = !this.optData.every(e => {
        if (Array.isArray(e.allowableMartList) && e.allowableMartList.length < 4 && markBinMap > 0) {
          const currentBinMap = Array(4).fill(0);
          e.allowableMartList.forEach(e => currentBinMap[e.code - 1] = 1);
          markBinMap = markBinMap & parseInt(currentBinMap.join(''), 2)
        }
        return markBinMap;
      });

      markBinMap = parseInt(markBinMap).toString(2);
      this.martList = martList.filter((_, i) => Number(markBinMap[i - 4 + markBinMap.length]));
    } else {
      const {martAuctionPrice, martInspectPrice, martFlootPrice} = this.optData;
      this.rulePrice['martAuctionPrice']['price'] = martAuctionPrice;
      this.rulePrice['martInspectPrice']['price'] = martInspectPrice;
      this.rulePrice['martFlootPrice']['price'] = martFlootPrice;
      this.martList = this.optData['allowableMartList']
    }
  },
  methods: {
    modalClose () {
      this.$emit('modalClose')
    },
    async sureChange () {
      if (Array.isArray(this.optData)) {
        let ids = ''
        this.optData.map(item => {
          ids += item['id'] + '|'
        })
        this.$http.get('bizProduct/batchPutToMart', {
          martCode: this.martId,
          productIdList: ids
        }).then(({code, msg, data}) => {
          if (code === 0) {
            if (typeof(data) === 'boolean') {
              this.$message({
                message: msg,
                type: 'success'
              })
              this.$emit('getList')
              this.modalClose()
            } else if(this.optData.statusDesc !== '二次质检不通过') {
              this.$emit('showSecondQuality', data)
            }
          }
        }).catch(e => {
          this.modalClose()
        })
      } else {
        if (this.martPrice) {
            // 修改价格
            if (this.martId === 2) {
              await this.$http.get('bizProduct/setInspectPrice', {
                price: this.martPrice,
                productId: this['optData']['id']
              })
            } else if (this.martId === 3) {
              let param = {
                price: this.martPrice,
                productId: this['optData']['id']
              }
              if(!this.bargainPrice && this.martPrice > 15) {
                this.$message({
                  message: '请勾选议价浮动',
                  type: 'error'
                });
                return
              }
              param.bargainPrice = this.bargainPrice || 0
              await this.$http.get('bizProduct/setFloorPrice', param)
            }
        }
        this.$http.get('bizProduct/putToMart', {
          productId: this.optData['id'],
          martCode: this.martId
        }).then(({code, msg, data}) => {
          if (code === 0) {
            if (typeof(data) === 'boolean') {
              this.$message({
                message: msg,
                type: 'success'
              })
              this.$emit('getList')
              this.modalClose()
            } else if(this.optData.statusDesc !== '二次质检不通过') {
              // 二次质检不通过不展示弹窗
              this.$emit('showSecondQuality', data)
            }
          }
        }).catch(e => {
          this.modalClose()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-list-box{
  text-align: left;
  margin: 30px 0 20px;
}
.mark-tip{
  text-align: left;
  color: #C0C4CC;
}
.dialog-footer{
  text-align: center;
}
.cancle{
  width: 102px!important;
}
.into-mart{
  font-size: 14px;
  color: #6D6F73;
  .martprice{
    font-size: 16px;
    color: #ff5555;
  }
}
.input-price{
  width: 208px;
  height: 28px;
}

</style>
<style media="screen" lang="scss">
.label-text{
  font-size: 14px;
  color: #6D6F73;
  margin-bottom: 0!important;
  .el-form-item__label{
    width: auto!important;
  }
}
.price-float{
  margin-top: 12px;
  margin-bottom: 32px;
  .label{
    width: 85px;
    box-sizing: border-box;
    padding-right: 22px;
    display: inline-block;
    text-align: right;
  }
}
</style>
