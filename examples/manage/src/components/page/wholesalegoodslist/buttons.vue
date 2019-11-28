<template lang="html">
  <div class="buttons-wrap" >
      <el-button size="mini"  @click="batchWithdrawFromMart" :disabled="buttonDisable">批量下架</el-button>

      <el-button size="mini"  @click="batchPutToMart" :disabled="buttonDisable">批量上架</el-button>
      <el-button size="mini" @click="toGenerateQuotation">生成报价单</el-button>
      <el-button size="mini" @click="exportPriceList">批量改价</el-button>
      <el-upload
        size="mini"
        class="upload-button"
        ref="upload"
        name="pricingFile"
        action="//ypwork.zhuanzhuan.com/ypee/wholesale/product/excelUpdatePrice"
        :show-file-list="false"
        :on-success="success"
        :auto-upload="true"
        :with-credentials="true"
        >
        <el-button size="mini" >批量上传</el-button>
      </el-upload>
      <span class="buttons-desc">（批量改价导出表格可进行批量修改价格和库存，修改完成后上传即可）</span>
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
      showTab: [
        '2',
        '3',
        '4',
        2,
        3,
        4,
        '',
        null
      ]
    }
  },
  methods: {
    batchPutToMart () {
      this.$emit('batchPutToMart')
    },
    batchWithdrawFromMart () {
      this.$emit('batchWithdrawFromMart')
    },
    toGenerateQuotation () {
      this.$emit('toGenerateQuotation')
    },
    success ({code, msg}) {
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('getList')
      } else {
        this.$message.error(msg)
      }
    },
    exportPriceList () {
      this.$emit('exportPriceList')
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
