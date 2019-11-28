<template lang="html">
  <div class="pkgnum">
    <p v-for="(i, k) in info">{{i}}{{pkgNum[k] || '0'}}</p>
  </div>
</template>

<script>
export default {
  props: ['pkgNum'],
  data () {
    return {
      info: {
        publishCnt: '发货数量：',
        receiveCnt: '收货数量：',
        waitQcCnt: '待质检数量：',
        qcFinishCnt: '已质检数量：',
        returnCnt: '退回数量：'
      },
      // pkgNum: {
      //   publishCnt: '123',
      //   qcFinishCnt: '3333',
      //   receiveCnt: '2222',
      //   returnCnt: '33333'
      // },
      dialogVisible: true
    }
  }
}
</script>

<style lang="scss" scoped>
.pkgnum{
  position: fixed;
  // top: 200px;
  left: 34%;
  z-index: 100;
  background: #FFF;
  color: #909399;
  border-radius: 2px;
  border: 1px solid #E4E7ED;
  padding: 10px;
  font-size: 14px;
}
</style>
