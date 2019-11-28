<template lang="html">
  <div class="buttons-wrap" >
      <el-button size="mini"  @click="downloadCode">下载二维码</el-button>
      <span class="buttons-desc">（点击下载可将邀请二维码保存至本地）</span>
  </div>
</template>

<script>
import exportButton from 'sub/component/export-btn-free'
export default {
  components: {
    exportButton
  },
  props: ['tabCode', 'buttonDisable', 'selectList'],
  data () {
    return {
    }
  },
  methods: {
    downloadCode () {
      this.$emit('downloadQrCode')
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons-wrap{
  padding-bottom: 20px;
}
.upload-button{
  display: inline-block;
  margin-left: 10px;
}
.buttons-desc{
  font-size: 14px;
  color: #9B9B9B;
}
</style>
