<template>
  <div class="recycle-order-detail">
    <div class="reject-cause"></div>
    <div class="detail-title">
      <el-page-header @back="backPage" content="回收单详情"/>
    </div>
    <div class="state-bar item-card">
      <el-card>
        <state-bar :process="process"/>
        <div class="state-bar-cancelText" v-show="cancelReason"><i class="el-icon-warning-outline"/> 卖家取消原因：
          {{cancelReason}}
        </div>
      </el-card>
    </div>
    <el-card class="item-card">
      <div class="header-box" slot="header">
        <span>下单信息</span>
        <span>订单号：{{orderId}} </span>
        <div v-if="orderInfo.expressNum && orderInfo.deliverType == 1">
          <span class="mgl20" >发货物流单号：{{orderInfo.expressNum}}</span>
          <el-button @click="showExpressDialog = true" class="mgl20" type="text">查看物流</el-button>
        </div>
        <div v-if="orderInfo.deliverType == 2">{{orderInfo.deliverTypeDesc}}</div>
        <el-button v-if="zjId" @click="showReport" class="right" type="text">查看卖家视角质检报告</el-button>
      </div>
      <div class="flex">
        <order-info :info="orderInfo" :change-media="changeMedia" :change-desc="changeDesc" :orderSource="orderSource" :orderSourceDesc="orderSourceDesc"/>
        <div class="seller-info">
          <div class="seller-info-item"><b>卖家名称：</b>{{ sellerInfo.name }}</div>
          <div class="seller-info-item"><b>门店名称：</b>{{ sellerInfo.name }}</div>
          <div class="seller-info-item" v-show="sellerInfo.phone"><b>收件电话：</b>{{ sellerInfo.phone }}</div>
          <div class="seller-info-item" v-show="sellerInfo.address"><b>收货地址：</b>{{ sellerInfo.address }}</div>
          <div class="seller-info-item" v-show="agentName"><b>对接人：</b>{{ agentName }}</div>
        </div>
      </div>
    </el-card>

    <report :forbid-update="+statusCode >= 70" v-if="zjId" :zjId="zjId"></report>

    <el-card class="item-card" v-if="returnsVO">
      <div class="header-box" slot="header">
        <div>
          退货单号：{{returnsVO && returnsVO.returnOrderId}}
        </div>
        <template v-if="returnsVO.expressNum && returnsVO.deliverType == 1">
          <span>退货物流单号：{{returnsVO.expressNum}}</span>
          <el-button @click="showBackExpressDialog = true" style="float: right; padding: 3px 0" type="text">查看物流</el-button>
        </template>
        <template v-if="returnsVO.deliverType == 2">
          <span>{{returnsVO.deliverTypeDesc}}</span>
        </template>
      </div>
      <div class="back-info">
        退货信息：{{ returnsVO.name }} {{ returnsVO.mobile }} {{ returnsVO.province }} {{returnsVO.city}}
        {{returnsVO.detail}}
      </div>
    </el-card>
    <div class="give-price item-card" v-if="operations.length > 1 && !operations.includes('returnManage')">
      <give-price
          :code="statusCode"
          :operations="operations"
          :orderId="orderId"
          :orderInfo="orderInfo"
          :orderSource="orderSource"
          :returnsVO="returnsVO"
          :sellerInfo="sellerInfo">
      </give-price>
    </div>
    <express
        :isBackExpress="showBackExpressDialog"
        :orderId="orderId"
        :returnOrderId="returnsVO && returnsVO.returnOrderId"
        @modalClose="closeExpressModal"
        v-if="showExpressDialog || showBackExpressDialog"
    />
    <el-dialog
        :visible.sync="showReportVisible"
        center
        title="卖家视角质检报告"
        width="500px">
      <qc-report :zjId="zjId"></qc-report>
    </el-dialog>
  </div>
</template>
<script>
  import express from '../../components/page/recycleorderlist/express'
  import QcReport from '@zz-common/zz-ui/lib/qc-report'
  import '@zz-common/zz-ui/lib/qc-report/index.css'
  import stateBar from './widget/stateBar'
  import orderInfo from './widget/orderInfo'
  import givePrice from './widget/givePrice'
  import report from './widget/report'

  export default {
    data () {
      return {
        process: [],
        cancelReason: '',
        orderInfo: {},
        sellerInfo: {},
        returnsVO: null,
        statusCode: '',
        changeDesc: '',
        changeMedia: '',
        orderId: this.$route.query.orderId,
        agentName: '',
        orderSource: '',
        orderSourceDesc: '',
        operations: [],
        showReportVisible: false,
        showBackExpressDialog: false,
        showExpressDialog: false
      }
    },
    computed: {
      zjId () {
        return this.orderInfo.qcId
      }
    },
    created () {
      this.fetchDetail()
    },
    methods: {
      showReport () {
        this.showReportVisible = true
      },
      closeExpressModal () {
        this.showBackExpressDialog = false
        this.showExpressDialog = false
      },
      fetchDetail () {
        const orderId = this.orderId
        this.$http.get('partner/recycle/getorder', {orderId}).then(resp => {
          const {code, data, msg} = resp
          if (code == 0) {
            Object.assign(this, data)
            this.operations = data.operations || []
            if (this.returnsVO) {
              this.returnsVO = {
                ...this.returnsVO,
                ...this.returnAddress
              }
            }
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
      },
      backPage () {
        return window.history.go(-1)
      }
    },
    components: {
      stateBar,
      orderInfo,
      givePrice,
      report,
      express,
      QcReport
    }
  }
</script>
<style lang="scss" scoped>
  .flex {
    display: flex;
    justify-content: space-between;
  }

  .right {
    float: right;
  }

  .mgl20 {
    margin-left: 20px;
  }

  .state-bar {
    &-cancelText {
      margin-top: 20px;
      padding: 16px 0 0;
      color: red;
      border-top: 1px solid #EBEEF5;
    }
  }

  .header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
  }

  .recycle-order-detail {
    .detail-title {
      font-weight: bold;
      width: 100%;
      background: #FFF;
      padding: 28px 32px 30px;
      font-size: 16px;
      color: #2E3135;

      .reject-cause {
        background: #FFF;
      }
    }

    .back-info {
      font-size: 14px;
    }

    .seller-info {
      font-size: 14px;
      width: 40%;

      &-item {
        margin-bottom: 20px;
      }

      &-item:last-child {
        margin-bottom: 0px;
      }

      b {
        color: #6D6F73;
      }
    }
  }

  .el-button {
    padding-top: 0;
    padding-bottom: 0;
  }

  .item-card {
    margin: 16px 16px 20px;
  }
</style>
