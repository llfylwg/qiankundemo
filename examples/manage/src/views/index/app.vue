<template lang="html">
  <section class="index-box">
    <img class="notice" @click="seeDoc" src='../../assets/img/index-banner.png'/>
    <section class="questions-box">
      <p class="questions-title">常见问题</p>
      <ul class="questions-list">
        <li class="questions-item" v-for="(item, k) in questions" :key="k" :class="activeQues.indexOf(k) > -1 ? 'active' : ''" >
          <p class="ques" @click="select(k)">{{item['ques']}}
            <i class="jiantou"></i>
          </p>
          <p v-for="i in item['answer']" class="answer" :class="activeQues.indexOf(k) > -1 ? 'answer-active' : ''">
            {{i}}
          </p>
        </li>
      </ul>
    </section>
    <section class="questions-box suggest-box">
      <p class="questions-title">意见反馈</p>
      <p class="questions-item suggest-desp">您可以输入使用过程中出现的问题或改进意见，我们会根据您的提议进行优化改进</p>
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="suggest">
      </el-input>
      <div class="suggets-button-box">
        <el-button type="primary" @click="sendInfo" :disabled="!suggest">提交</el-button>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data () {
    return {
      activeQues: [],
      suggest: '',
      questions: [
        {
          ques: '1.发布商品后，发货时有哪些限制？',
          answer: [
            '发布商品后请于24小时内进行发货，否则将自动取消发货关闭订单。'
          ]
        },
        {
          ques: '2.发货注意事项有哪些？',
          answer: [
            '发货时请注意物流包裹内商品数量与发布商品时填写的数量保持一致，避免收货分拣出现数量不对应的情况。发布商品后仅可填写一个物流信息，发货时请不要分开邮寄。'
          ]
        },
        {
          ques: '3.什么是已验机卖场？',
          answer: [
            '卖家可对质检完成的商品自定义一口价上架，上架后会在已验机卖场曝光，买家支付成功后，平台会在24小时内发货。已验机卖场可以更加灵活自由的进行定价，买家更多是c端用户，更加适合优质商品，但超出7天未售出的商品系统将会自动下架，请卖家合理定价。'
          ]
        },
        {
          ques: '4.什么是明拍卖场？',
          answer: [
            '商品质检完成后，系统会根据该商品的质检报告进行估价并给出竞拍价，卖家选择上架明拍卖场后，该商品将以竞拍价作为底价进行买家出价竞拍，竞拍时间为30分钟，30分钟内最高出价将作为该商品的成交价。明拍卖场可在短时间内售出商品，售出率高回款快，更适合尾货的处理，且商品上架明拍卖场后，卖家无法主动下架该商品，流拍后可再次选择上架。'
          ]
        },
        {
          ques: '5.哪些商品不能进入已验机卖场？',
          answer: [
            '无法质检的尸体机、明拍卖场流拍的商品均无法进入已验机卖场，请卖家慎重选择卖场。'
          ]
        },
        {
          ques: '6.哪些商品只能退回？',
          answer: [
            '山寨机、非手机/平板商品、无法进行估价的商品均无法上架卖场，请主动退回该类商品。'
          ]
        },
        {
          ques: '7.我的地址变更了，如何变更退货地址？',
          answer: [
            '请在首页的意见反馈中进行变更地址说明，或和与您对接的市场运营人员联系进行地址变更。'
          ]
        },
        {
          ques: '8.我的商品在已验机卖场上架后，提示在拍照是为什么？',
          answer: [
            '质检完成的商品在首次进入已验机卖场时，质检中心会对商品对外观进行多角度的拍照上传到商品详情页，方便更多买家了解到商品外观信息，拍照时间大致为2小时左右，拍照完成后您的商品将自动加入已验机卖场。'
          ]
        },
        {
          ques: '9.我的商品在明拍卖场上架后，提示等待进入竞拍是为什么？',
          answer: [
            '明拍卖场为30分钟一场的竞拍卖场，在您选择上架明拍卖场时，您的商品会处于一个等待加入竞拍的状态，在下一场竞拍开始时，您的商品将自动加入该场明拍竞拍。'
          ]
        },
        {
          ques: '10.商品售出后多长时间会结算打款？',
          answer: [
            '已验机卖场商品售出发货1个工作日后会进行打款。明拍卖场竞拍成功买家支付成功1个工作日内会进行打款。'
          ]
        }
      ]
    }
  },
  methods: {
    sendInfo () {
      this.$http.get('bizSuggestion/suggest', {
        content: this.suggest
      }).then(res => {
        this.suggest = ''
        this.$message({
         message: '感谢您的意见反馈，我们会根据您的提议进行优化改进',
         type: 'success'
       })
      }).catch(e => {
         // this.$message.error('提交失败')
      })
      this.suggest = ''
    },
    select (k) {
      console.log(k)
      if (this.activeQues.indexOf(k) > -1) {
        const ind = this.activeQues.indexOf(k)
        this.activeQues.splice(ind ,1)
      } else {
        this.activeQues.push(k)
      }
    },
    seeDoc () {
      window.open('https://zzwos.58cdn.com.cn/GlEdCbAZyGj/youpinfe001/yp_1d1v7r0ich6sh4r1ncv11uug7m0.pdf')
    }
  }
}
</script>

<style lang="scss" scoped>
.index-box{
  width: 100%;
  padding: 24px 24px 30px;
  box-sizing: border-box;
  background: #f0f2f5;
}
.notice{
  // height: 210px;
  width: 100%;
  min-height: 200px;
  margin: 0 auto;
  // background: url() no-repeat center;
  // background-size: cover;
}
.questions-box, .suggest-box{
  width: 100%;
  margin: 24px auto 0;
  padding: 24px 32px 0;
  background: #FFF;
  border-radius: 5px;
}
.suggest-box{
  padding-bottom: 20px;
  font-size: 14px;
}
.suggets-button-box{
  margin-top: 20px;
}
.questions-title{
  padding-bottom: 20px;
  border-bottom: 1px solid #e9e9e9;
  font-size: 14px;
  color: #222222;
  font-weight: bold;
}
.questions-list, .suggest-desp{
  margin-top: 20px;
}
.questions-item{
  padding-bottom: 24px;
}
.ques{
  font-size: 14px;
  color: #222222;
  line-height: 22px;
  position: relative;
  font-weight: 500;
}
.answer{
  font-size: 14px;
  margin-top: 14px;
  color: #666666;
  line-height: 22px;
  height: 0;
  overflow-y: hidden;
  opacity: 0;
  display: none;
}
.answer-active{
  display: block;
  transition: all 1s;
  opacity: 1;
  height: auto;
}
.jiantou{
  position: absolute;
  width: 11px;
  height: 11px;
  right: 0;
  top: 0;
  background: url('../../assets/img/jiantou.png') no-repeat center;
  background-size: cover;
  transform: rotate(-90deg);
  transition: all 0.2s;
}
.active .jiantou{
  transform: rotate(0deg);
}
</style>
