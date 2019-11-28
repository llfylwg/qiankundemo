<template lang="html">
  <el-dialog
    title="商品发货"
    :visible.sync="dialogVisible"
    width="532px"
    :before-close="hideSendShipModal"
    >
      <div class="send-modal">
        <section class="send-person">
          <p>发件人: {{deliverInfo['senderName']}}</p>
          <p>手机号码: {{deliverInfo['senderPhone']}}</p>
          <p>发货单号: {{deliverInfo['bizPkgId']}}</p>
          <p>发货数量: {{deliverInfo['publishCount']}}</p>
        </section>
        <p class="line-center"></p>
        <section class="recveive-person">
          <p>收件人: {{deliverInfo['receiveName']}}</p>
          <p>手机号码: {{deliverInfo['receivePhone']}}</p>
          <p>收货地址: {{deliverInfo['receiveAddr']}}</p>
        </section>
      </div>

      <div class="sendShip-express-box">
        <el-form ref="form" :model="form" :inline="true">
          <el-form-item label="物流：">
            <Select
              placeholder="选择物流公司"
              :list="expressInfo"
              v-model="form.expressCompany"
              :dataMap="map"
            />
          </el-form-item>
          <el-form-item label="单号：" >
           <el-input v-model="form.expressNum" placeholder="请输入物流单号"></el-input>
         </el-form-item>
        </el-form>
      </div>
      <p class="tip">特别提示：请确认邮寄的商品数量与发货数量保持一致，物流单号提交后无法修改</p>
      <div class="buttons-wrap">
        <el-row>
          <el-button  type="primary" :disabled="canDeliver" @click="sendShip" class="sure">确认发货</el-button>
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
        label: 'expressCnName',
        value: 'expressEnName'
      }
    }
  },
  computed: {
    canDeliver () {
      const values = Object.values(this.form)
      if (values.indexOf('') > -1) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.canDeliver = false
    this.$http.get('bizpkg/deliverInfo', {bizPkgId: this.bizPkgId}).then(res => {
      this.deliverInfo = res['data']['deliverInfo']
      this.expressInfo = res['data']['expressInfo']
    })
  },
  methods: {
    hideSendShipModal () {
      this.$emit('hideSendShipModal')
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
.send-modal{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.send-person, .recveive-person{
  display: inline-block;
  vertical-align: top;
  width: 215px;
  padding-left: 0;
  font-size: 14px;
  color: #6D6F73;
  line-height: 30px;
}
.line-center{
  display: inline-block;
  height: 120px;
  border-left: 1px dashed #e7e7e7;
  margin-left: 21px;
  margin-right: 21px;
  align-self: center;
}
.tip{
  text-align: left;
  font-size: 12px;
  color: #9B9B9B;
  margin-top: 10px;
}
.buttons-wrap{
  margin-top: 25px;
}
</style>

<style media="screen" lang="scss">
 .sendShip-express-box{
   margin-top: 25px;
 }
 .sendShip-express-box .sure, .sendShip-express-box .cancle{
   width: 102px!important;
 }
  .sendShip-express-box .el-form--inline{
    width: 100%;
    .el-form-item{
        margin-bottom: 10px;
        padding-bottom: 0;
        margin-top: 10px;
    }
    .el-input__inner{
      width: 400px!important;
    }
  }
  .sendshiplist-wrap .el-row{
    text-align: center;
    padding-top: 10px;
    button{
      display: inline-block;
      width: 102px!important;
    }
  }
</style>
