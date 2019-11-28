<template lang="html">
  <div class="buttons-wrap" v-if="showTab.indexOf(tabCode) > -1">
    <template v-if="tabCode==2">
      <el-button size="mini" :disabled="buttonDisable" @click="applyReturn">批量退回</el-button>
      <el-button size="mini" :disabled="buttonDisable" @click="batchPutToMart">批量上架</el-button>

      <el-button size="mini" @click="exportPriceList">批量定价</el-button>
      <el-upload
        size="mini"
        class="upload-button"
        ref="upload"
        name="pricingFile"
        action="//ypwork.zhuanzhuan.com/ypee/bizProduct/upload/pricingList"
        :show-file-list="false"
        :on-success="success"
        :auto-upload="true"
        :with-credentials="true"
        >
        <el-button size="mini" >定价上传</el-button>
      </el-upload>
    </template>

    <el-button size="mini" v-if="tabCode== '' || tabCode == null" @click.native="exportList">导出数据</el-button>

    <el-button size="mini" v-if="tabCode == 3" :disabled="buttonDisable" @click="batchWithdrawFromMart">批量下架</el-button>

    <el-button size="mini" v-if="tabCode == 4" :disabled="buttonDisable" @click="batchAgree">批量同意</el-button>

    <el-button size="mini" v-if="tabCode == 4" :disabled="buttonDisable" @click="batchReject">批量拒绝</el-button>

    <span class="text"  v-if="tabCode==2">(注意：暗拍批量定价时，议价浮动默认选择该价格对应的最小议价浮动范围)</span>

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
    applyReturn () {
      this.$emit('applyReturn')
    },
    batchPutToMart () {
      this.$emit('batchPutToMart')
    },
    batchWithdrawFromMart () {
      this.$emit('batchWithdrawFromMart')
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
    },
    exportList () {
      this.$emit('exportData')
    },
    batchAgree () {
      this.$emit('batchAgree')
    },
    batchReject () {
      this.$emit('batchReject')
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
.text {
  margin-left: 12px;
  color: #909399;
}
</style>
