<template>
  <div class="give-price">
    <el-card>
      <div>
        <!--二次报价的原因-->
        <div class="old-price" v-if="showConfirmRecycleBtn">
          <div class="change">
            <div class="change-title change-item">二次报价原因说明</div>
            <div class="change-tips change-item">说明：可自行上传影响价格产生扣费的内容佐证。</div>
            <div class="change-textarea change-item">
              <el-input
                  :rows="3"
                  placeholder="请输入说明"
                  type="textarea"
                  v-model="changeDesc">
              </el-input>
            </div>
            <div class="change-wrap change-item">
              <uploader @change="changeUpload" @magnifier="magnifier"/>
            </div>
          </div>
          <div v-if="showConfirmRecycleBtn">原报价： <span class="price">{{ orderInfo.firstPrice }}</span>元</div>
        </div>
        <!--每种状态的按钮-->
        <div class="new-price">
          <span v-if="showConfirmPriceBtn">报价：</span>
          <span v-if="showSecondConfirmPriceBtn">修改报价：</span>
          <span v-if="showConfirmPriceBtn || showSecondConfirmPriceBtn">
            <el-input class="input" placeholder="请输入价格" v-model="price"></el-input>元
          </span>
          <span v-if="orderInfo.qcEvalPrice" @click="price = orderInfo.qcEvalPrice">使用回收质检报价</span>
          <span v-if="dealStatus">最终报价：<span class="price">{{ orderInfo.dealPrice }}</span>元</span>
        </div>
        <el-button @click="showModal('changePriceVisible')" class="btn" type="primary" v-if="showSecondConfirmPriceBtn">
          修改价格
        </el-button>
        <el-button @click="saveForm" class="btn" type="primary" v-if="showConfirmRecycleBtn">保存</el-button>
        <el-button @click="showModal('setPriceVisible')" class="btn" type="primary" v-if="showConfirmPriceBtn">确认价格
        </el-button>
        <el-button v-for="optName in operations"
                   v-if="options[optName]"
                   :key="optName"
                   @click="options[optName].handler"
                   class="btn"
                   type="primary">
          {{options[optName].btnName}}
        </el-button>
      </div>
    </el-card>
    <!--确认价格 弹窗-->
    <setPrice :orderId="orderId" :orderInfo="orderInfo" :price="price" @goListPage="goListPage"
              @modalClose="modalClose" v-if="setPriceVisible"></setPrice>
    <!--修改价格后的确认弹窗-->
    <changePrice :desc="changeDesc" :media="pics.join('|')" :orderId="orderId" :orderInfo="orderInfo"
                 :price="price" @goListPage="goListPage" @modalClose="modalClose" v-if="changePriceVisible"/>
    <!--确认回收 弹窗-->
    <confirmRecycle :orderId="orderId" :orderInfo="orderInfo" :orderSource="orderSource"
                    :price="price" @goListPage="goListPage" @modalClose="modalClose" v-if="confirmRecycleVisible"/>
    <!--打款弹窗-->
    <payMoney :orderId="orderId" :orderInfo="orderInfo" :sellerInfo="sellerInfo" @goListPage="goListPage"
              @modalClose="modalClose" v-if="payMoneyVisible"/>
    <!-- 面交发货弹框 -->
    <face-return @modalClose="modalClose" @sureFaceReturn="sureFaceReturn" v-if="showDeliverFace"/>
    <!-- 发货弹框 -->
    <sendship :optData="optData" @modalClose="modalClose" @sureReturn="sureReturn" v-if="showDeliver"/>
    <el-dialog
        :visible.sync="magnifierVisible"
        @close="closeMagnifier"
        width="30%">
      <img :src="magnifierPic" class="picDialog" v-if="!isVideo(magnifierPic)"/>
      <video :src="magnifierPic" class="videoDialog" controls="controls" v-else>
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>
  </div>
</template>
<script>
  import statusMixin from './statusMixin'
  import faceReturn from '../../../components/page/recyclereturnmanager/facereturn'
  import sendship from '../../../components/page/recyclereturnmanager/sendship'
  import setPrice from './setprice'
  import changePrice from './changeprice'
  import confirmRecycle from './confirmrecycle'
  import payMoney from './paymoney'
  import uploader from './uploader'
  import { setLocalStorage, getLocalStorage } from '@/assets/js/helper'

  export default {
    props: ['code', 'orderInfo', 'sellerInfo', 'orderSource', 'returnsVO', 'operations'],
    mixins: [statusMixin],
    data () {
      return {
        price: '',
        secondPrice: '',
        orderId: this.$route.query.orderId,
        returnOrderId: this.$route.query.returnOrderId,
        payMoneyVisible: false,
        setPriceVisible: false,
        changePriceVisible: false,
        confirmRecycleVisible: false,
        changeDesc: '',
        pics: [],
        magnifierPic: '',
        showDeliverFace: false,
        showDeliver: false,
        magnifierVisible: false,
        optData: {}
      }
    },
    methods: {
      modalClose () {
        // 所有弹窗关闭
        Object.assign(this.$data, {
          setPriceVisible: false,
          showDeliverFace: false,
          showDeliver: false,
          confirmRecycleVisible: false,
          changePriceVisible: false,
          payMoneyVisible: false
        })
      },
      receiveGoods () {
        this.$confirm('确定收到货了吗？')
          .then(res => {
            this.sureReceipt()
          })
      },
      sureReceipt () {
        this.$http.get('/partner/recycle/receipt', {
          orderIds: this.orderId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '确认收货成功',
              type: 'success'
            })
            this.goListPage()
          }
        }).catch(e => {
          this.$message.error('网络异常，请稍后再试')
        })
      },
      isVideo (item) {
        const isVideoReg = /(mp4|avi|m3u8|rmvb)$/
        return isVideoReg.test(item.toLowerCase())
      },
      showModal (type) {
        this[type] = true
      },
      sureReturn (expressInfo) {
        if (expressInfo && expressInfo.expressCompany === '' || expressInfo.expressNum === '') {
          this.$message({
            message: '请填写快递物流公司和单号',
            type: 'error'
          })
          return
        }
        this.$http.get('/partner/recycle/returns/deliver', {
          returnOrderIds: this.returnOrderId,
          deliverType: 1,
          expressCompany: expressInfo.expressCompany,
          expressNum: expressInfo.expressNum
        }).then(res => {
          const {code, data, msg} = res
          if (code == 0) {
            this.$message.success(msg)
            this.goListPage()
          }
        })
      },
      sureFaceReturn () {
        this.$http.get('/partner/recycle/returns/deliver', {
          returnOrderIds: this.returnOrderId,
          deliverType: 2
        }).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg)
            this.goListPage()
          }
        })
      },
      goListPage () {
        window.history.go(-1)
      },
      magnifier (pic) {
        this.magnifierPic = pic
        this.magnifierVisible = true
      },
      closeMagnifier () {
        this.magnifierVisible = false
      },
      changeUpload (pics) {
        this.pics = pics
      },
      saveForm () {
        const orderId = this.$route.query.orderId || ''
        const {changeDesc, pics, price} = this
        const formObj = {
          desc: changeDesc,
          pics,
          price
        }
        setLocalStorage(orderId, formObj)
      },
      initData () {
        const orderId = this.$route.query.orderId || ''
        const formObj = getLocalStorage(orderId)
        this.changeDesc = formObj && formObj.desc || ''
        this.price = formObj && formObj.price || ''
      }
    },
    mounted () {
      this.initData()
      let returnAddressStr = ''
      if (this.returnsVO) {
        returnAddressStr = ` ${this.returnsVO['name']}
        ${this.returnsVO['mobile']}
        ${this.returnsVO['province']}
        ${this.returnsVO['city']}
        ${this.returnsVO['detail']}
      `
      }
      this.optData = {
        orderId: this.returnsVO && this.returnsVO.orderId,
        productTitle: this.orderInfo.title,
        returnAddress: returnAddressStr
      }
    },
    components: {
      payMoney,
      setPrice,
      sendship,
      faceReturn,
      changePrice,
      confirmRecycle,
      uploader
    }
  }
</script>
<style lang="scss" scoped>
  .give-price {
    text-align: center;

    .input {
      display: inline-block;
      width: 200px;
      margin: 0 10px;
    }

    .btn {
      width: 100px;
    }

    .old-price {
      margin-bottom: 14px;

      .change {
        margin: 0 auto;
        text-align: left;
        width: 530px;

        &-item {
          padding: 0 0 10px;
        }

        &-title {
        }

        &-tips {
          color: red;
          font-size: 12px;
        }

        &-textarea {
        }

        &-wrap {
        }
      }
    }

    .new-price {
      margin-bottom: 14px;
    }
  }

  .price {
    color: #409EFF;
    font-size: 28px;
  }

  .videoDialog {
    width: 100%;
    height: auto;
  }

  .picDialog {
    width: 100%;
    height: auto;
  }
</style>
