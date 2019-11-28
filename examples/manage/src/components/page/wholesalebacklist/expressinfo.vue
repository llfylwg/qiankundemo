<template lang="html">
  <el-dialog
    title="物流信息"
    :visible.sync="dialogVisible"
    width="532px"
    :before-close="hideExpressModal"
    >
      <p class="expressinfo-box">
        <span>物流公司： {{deliverInfo['expressCompanyCn']}}</span>
        <span>物流单号：{{deliverInfo['expressNum']}}</span>
      </p>
      <div class="express-list">
        <template v-if="deliverInfo['flowDetails']">
          <p v-for="item in deliverInfo['flowDetails']" class="express-item">
            {{item}}
          </p>
        </template>
        <p v-else class="no-express-info">暂无物流信息</p>
      </div>
      <div class="send-modal">
        <section class="send-person">
          <p>商户名: {{deliverInfo['senderName']}}</p>
          <p>手机号码: {{deliverInfo['senderPhone']}}</p>
          <p>发货单号: {{bizPkgId}}</p>
          <p>发货数量: {{deliverInfo['publishCount']}}</p>
        </section>
        <section class="recveive-person">
          <p>收件人: {{deliverInfo['receiveName']}}</p>
          <p>手机号码: {{deliverInfo['receivePhone']}}</p>
          <p>收货地址: {{deliverInfo['receiveAddr']}}</p>
        </section>
      </div>
  </el-dialog>
</template>

<script>
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
      form: {
        company: '',
        name: ''
      }
    }
  },
  created () {
    this.$http.get('bizpkg/queryExpressInfo', {bizPkgId: this.bizPkgId}).then(res => {
      this.deliverInfo = res['data']
      // this.deliverInfo.flowDetails = [
      //   '到都我阿斯加德soin第三季第四点几是的his',
      //   '到都我阿斯加几是的his',
      //   '加德soin第三季第四点几是的his第四点几是的第四点几是的',
      //   '到都我阿斯加德soin第三季是的his',
      //   '到都我阿斯加德soin第三季第四点几是的第四点几是的第四点几是的his'
      // ]
    })
  },
  methods: {
    hideExpressModal () {
      this.$emit('hideExpressModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.send-modal{
  display: flex;
  justify-content: space-around;
  background: #F8F8F8;
}
.expressinfo-box {
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 15px;
}
.expressinfo-box span{
    display: inline-block;
    margin-right: 20px;
    text-align: left;
    font-size: 14px;
    color: #6D6F73;
    &::before{
      display: inline-block;
      vertical-align: middle;
      content: '';
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background: #D8D8D8;;
      margin-right: 6px;
    }
}
.send-person, .recveive-person{
  width: 215px;
  padding: 10px;
  line-height: 24px;
  font-size: 13px;
  color: #9B9B9B;
}
.express-list{
  padding-bottom: 34px;
  margin-left: 10px;
  .express-item{
    font-size: 13px;
    color: #9B9B9B;
    line-height: 17px;
    padding-bottom: 24px;
    border-left: 2px solid  #D8D8D8;
    padding-top: 0;
    padding-left: 25px;
    position: relative;
    &::before{
      position: absolute;
      left: -8px;
      top: 0;
      content: '';
      width: 14px;
      height: 14px;
      background: #D8D8D8;
      border-radius: 50%;
    }
    &:nth-last-child(1) {
      border: none;
      padding-bottom: none;
    }
    &:nth-child(1) {
      &::before{
        width: 20px;
        height: 20px;
        left: -11px;
        background: #4A90E2;
      }
    }
  }
}
.no-express-info{
  color: #909399;
}
.icon-list{

}
</style>
