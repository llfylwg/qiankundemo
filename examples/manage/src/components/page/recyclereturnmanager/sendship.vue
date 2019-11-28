<template lang="html">
  <el-dialog
      :before-close="hideSendShipModal"
      :visible.sync="dialogVisible"
      title="商品发货"
      width="602px"
      custom-class="dialogg"
  >
    <div class="send-modal">
      <div class="receive">收件人信息 :</div>
      <div class="send-person" v-if="isPiLiangFahuo">
        {{selectList[0].returnAddress}}
      </div>
      <div class="send-person" v-else>
        {{optData && optData.returnAddress}}
      </div>
    </div>
    <div class="sendShip-express-box">
      <el-form :inline="true" :model="form" ref="form">
        <el-form-item label="物流：">
          <Select
              :dataMap="map"
              :list="expressInfo"
              placeholder="选择物流公司"
              v-model="form.expressCompany"
          />
        </el-form-item>
        <el-form-item label="单号：">
          <el-input placeholder="请输入物流单号" v-model="form.expressNum"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <p class="tip">特别提示：请确认邮寄的商品数量与发货数量保持一致，物流单号提交后无法修改</p>
    
    <template v-if="optData || selectList">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="orderId"
          label="回收单号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="productTitle"
          label="商品信息"
          >
        </el-table-column>
      </el-table>
    </template>

    <div class="buttons-wrap">
      <el-row>
        <el-button :disabled="false" @click="sure" class="sure" type="primary">确认发货</el-button>
        <el-button @click="hideSendShipModal" class="cancle">取消</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import Select from 'sub/component/select2'

  export default {
    props: {
      bizPkgId: {
        type: String,
        default: null
      },
      optData: {
        type: Object,
        default: null
      },
      selectList: {
        type: Array,
        default: null
      },
      isPiLiangFahuo: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dialogVisible: true,
        deliverInfo: {},
        expressInfo: [],
        form: {
          expressCompany: '',
          expressNum: ''
        },
        map: {
          label: 'n',
          value: 'c'
        }
      }
    },
    computed: {
      // canDeliver () {
      //   const values = Object.values(this.form)
      //   if (values.indexOf('') > -1) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }
      tableData () {
        let result = []
        if (this.isPiLiangFahuo ){
          this.selectList.forEach(item => {
            result.push({
              orderId: item.orderId,
              productTitle: item.productTitle
            })
          })
        } else {
          result.push(
            {
              orderId: this.optData.orderId,
              productTitle: this.optData.productTitle
            }
          )
        }
        return result
      }
    },
    created () {
      // this.canDeliver = false
      this.$http.get('https://app.zhuanzhuan.com/zzx/transfer/getKuaiDiCompany').then(res => {
        // this.deliverInfo = res['data']['deliverInfo']
        this.expressInfo = res['respData']['common']
        // debugger
        console.log(res)
      })
    },
    methods: {
      sure () {
        console.log(this.form)
        this.$emit('sureReturn', this.form)
        this.$emit('hideSendShipModal')
        this.$emit('modalClose')
      },
      hideSendShipModal () {
        this.$emit('hideSendShipModal')
        this.$emit('modalClose')
      },
      sendShip () {
        this.$http.get('bizpkg/deliver', {...this.form, bizPkgId: this.bizPkgId}).then(res => {
          this.hideSendShipModal()
          this.$emit('refreshList')
        }).catch(e => {
          this.$emit('refreshList')
        })
      }
    },
    components: {
      Select
    }
  }
</script>

<style lang="scss" scoped>
  .send-modal {
    .receive {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 14px;
      text-align: left;
    }
  }
  .info {
    margin-top: 20px;

    .title {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;

      .left {
        width: 40%;
        padding-left: 40px;
      }

      .right {
        width: 60%;
        text-align: center;
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      line-height: 30px;

      .left {
        width: 40%;
        text-align: left;
      }

      .right {
        width: 60%;
        text-align: left;
      }
    }
  }

  .send-person {
    vertical-align: top;
    padding-left: 0;
    font-size: 14px;
    color: #6D6F73;
    line-height: 30px;
  }

  .line-center {
    display: inline-block;
    height: 120px;
    border-left: 1px dashed #e7e7e7;
    margin-left: 21px;
    margin-right: 21px;
    align-self: center;
  }

  .tip {
    text-align: left;
    font-size: 12px;
    color: #9B9B9B;
    margin-top: 10px;
    margin-bottom: 32px;
  }

  .buttons-wrap {
    margin-top: 25px;
    text-align: center;
  }
</style>

<style media="screen" lang="scss">
  .sendShip-express-box {
    margin-top: 0;
  }

  .sendShip-express-box .sure, .sendShip-express-box .cancle {
    width: 102px !important;
  }

  .sendShip-express-box .el-form--inline {
    width: 100%;

    .el-form-item {
      margin-bottom: 10px;
      padding-bottom: 0;
      margin-top: 10px;
    }

    .el-input__inner {
      width: 452px !important;
    }
  }

  .sendshiplist-wrap .el-row {
    text-align: center;
    padding-top: 10px;

    button {
      display: inline-block;
      width: 102px !important;
    }
  }
  .dialogg {
    .el-dialog__header {
      text-align: left;
    }
    .el-dialog__body {
      padding: 0 40px 30px !important;
    }
  }
</style>
