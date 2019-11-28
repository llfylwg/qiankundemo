<template lang="html">
  <ul class="rules-box">
    <i class="el-icon-warning icon-tip"></i>
    <li v-for="(i, k) in ruleList">{{i}}</li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      ruleList: [
        '温馨提示：1.议价倒计时为1小时，超出时间默认流拍',
        '2.同意议价则交易成功，以最高买家出价作为最终成交价',
        '3.拒绝议价则该商品本场流拍，请在【待上架】列表中重新上架'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.rules-box{
  padding-bottom: 17px;
  li{
    display: inline;
    font-size: 14px;
    color: #9B9B9B;
    padding-right: 32px;
  }
}
.icon-tip{
  color: #9B9B9B;
  margin-right: 5px;
}
</style>
