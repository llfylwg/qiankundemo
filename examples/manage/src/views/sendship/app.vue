<template lang="html">
  <section class="ship-box">
    <div class="top-box">
      <p class="process-icon"></p>
      <p class="process-line"></p>
      <section class="tip-select">
        <saleGoods></saleGoods>
      </section>
    </div>
    <div class="tip-box">
      <p class="tip-title">温馨提示:</p>
      <ul class="tips-list">
        <li class="tips-item">1.请确保您发布的商品数量一个物流包裹可容纳，<strong>一个发货单无法进行多物流发货</strong>。</li>
        <li class="tips-item">2.发布商品后，请于<strong>24小时内</strong>在<strong>发货管理</strong>中进行发货，否则发货单会自动关闭。</li>
        <li class="tips-item">3.平台收到商品后，会对商品进行质检，质检完成后可在<strong>商品管理</strong>中选择卖场进行上架售卖。</li>
      </ul>
    </div>
  </section>
</template>

<script>
import saleGoods from '../../components/page/sendship/salegoods'
export default {
  components: {
    saleGoods: saleGoods
  }
}
</script>

<style lang="scss" scoped>
.ship-box{
  width: 100%;
  height: 100%;
  padding: 24px 24px 30px;
  box-sizing: border-box;
  background: #f0f2f5;
}
.top-box{
  background: #FFF;
  width: 100%;
  box-sizing: border-box;
  padding: 69px 0 20px;
  margin: 0 auto;
  border-radius: 5px;
}
.process-icon{
  background: url('../../assets/img/sendship.png') no-repeat center;
  width: 824px;
  height: 163px;
  margin: 0 auto;
  background-size: contain;
}
.process-line{
  width: 96%;
  height: 1px;
  background-color: #ebebeb;
  // margin: 0 auto;
  margin: 30px auto 0;
}
.tip-box{
  width: 100%;
  box-sizing: border-box;
  background: #FFF;
  margin-top: 24px;
  border-radius: 5px;
  padding: 31px 32px;
}
.tip-title{
  font-size: 14px;
  color: #222222;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebebeb;
}
.tips-list{
  padding-top: 20px;
}
.tips-item{
  font-size: 14px;
  color: #999999;
  line-height: 22px;
  strong{
    color: #101010;
    font-weight: bold;
  }
}
.tip-select{
  width: 535px;
  margin:0 auto;
  padding-top: 30px;
}
</style>
