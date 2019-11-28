<template lang="html">
  <div class="buttons-wrap" v-if="showTab.indexOf(tabCode) > -1">

    <el-button size="mini" v-if="['', '1'].indexOf(tabCode) > -1" @click.native="exportList">批量导出</el-button>

    <el-button size="mini" v-if="['0'].indexOf(tabCode) > -1" @click.native="batchFreeShip" :disabled="buttonDisable">批量免运费</el-button>

    <el-button size="mini" v-if="['0'].indexOf(tabCode) > -1" @click.native="cancelOrder" :disabled="buttonDisable">批量取消</el-button>

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
      v-if="['1'].indexOf(tabCode) > -1"
      >
      <el-button size="mini" >批量发货</el-button>
    </el-upload>

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
        '',
        '0',
        '1'
      ]
    }
  },
  methods: {
    cancelOrder () {
      this.$emit('cancelOrder')
    },
    exportList () {
      this.$emit('exportList')
    },
    batchFreeShip () {
      this.$emit('batchFreeShip')
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
</style>
