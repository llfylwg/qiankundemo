<template lang="html">
  <el-dialog
      :before-close="hideExpressModal"
      :visible.sync="dialogVisible"
      title="物流信息"
      width="932px"
  >
    <p class="expressinfo-box">
      <template>
        <span>物流公司： {{deliverInfo.expressCompanyName || '无'}}</span>
        <span>物流单号：{{deliverInfo.expressNum || '无'}}</span>
      </template>
      <span>发货类型：{{deliverInfo.deliverTypeDesc}}</span>
    </p>
    <div class="express-list">
      <template v-if="deliverInfo['flowDetails']">
        <p class="express-item" v-for="item in deliverInfo['flowDetails']">
          {{item}}
        </p>
      </template>
      <p class="no-express-info" v-else>暂无物流信息</p>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: ['orderId', 'isBackExpress', 'returnOrderId'],
    data () {
      return {
        dialogVisible: true,
        deliverInfo: {}
      }
    },
    created () {
      if(this.isBackExpress) {
        this.$http.get('/partner/recycle/returns/returnExpressInfo', {
          returnOrderId: this.returnOrderId
        }).then(res => {
          const {code, data} = res
          if (code == 0) {
            this.deliverInfo = data || {}
          }
        }).catch(e => {
          this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
          })
        })
      } else {
        this.$http.get('/partner/recycle/expressInfo', {
          orderId: this.orderId
        }).then(res => {
          const {code, data} = res
          if (code == 0) {
            this.deliverInfo = data || {}
          }
        }).catch(e => {
          this.$message({
            message: '网络异常，请稍后再试',
            type: 'error'
          })
        })
      }  
    },
    methods: {
      hideExpressModal () {
        this.$emit('modalClose')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .send-modal {
    display: flex;
    // justify-content: space-around;
    background: #F8F8F8;
  }

  .expressinfo-box {
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
    margin-bottom: 15px;
  }

  .expressinfo-box span {
    display: inline-block;
    margin-right: 20px;
    text-align: left;
    font-size: 14px;
    color: #6D6F73;

    &::before {
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

  .send-person, .recveive-person {
    // width: 215px;
    padding: 10px 50px;
    line-height: 24px;
    font-size: 13px;
    // color: #9B9B9B;
    p {
      display: inline-block;
      margin-right: 100px;
    }
  }

  .express-list {
    padding-bottom: 34px;
    margin-left: 10px;

    .express-item {
      font-size: 13px;
      color: #9B9B9B;
      line-height: 17px;
      padding-bottom: 24px;
      border-left: 2px solid #D8D8D8;
      padding-top: 0;
      padding-left: 25px;
      position: relative;

      &::before {
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
        &::before {
          width: 20px;
          height: 20px;
          left: -11px;
          background: #4A90E2;
        }
      }
    }
  }

  .no-express-info {
    color: #909399;
  }

  .icon-list {

  }
</style>
