<template lang="html">
  <section class="ship-box">
    <div class="top-box">
      <section class="tip-select">
        <saleGoods></saleGoods>
      </section>
    </div>
  </section>
</template>

<script>
import saleGoods from '../../components/page/batchpublish/publish'
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
