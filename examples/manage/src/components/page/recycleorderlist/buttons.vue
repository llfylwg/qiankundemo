<template lang="html">
  <div class="buttons-wrap">
    <el-button
      size="mini"
      v-if="tabCode == 50"
      @click.native="receiptNotOne"
      :disabled="buttonDisable"
    >
      批量确认收货
    </el-button>

    <el-button size="mini" v-if="tabCode == 65" :disabled="buttonDisable" @click.native="confirmList">批量确认回收</el-button>

    <el-button size="mini" v-if="tabCode == 80" :disabled="buttonDisable" @click.native="payMoneyList">批量打款</el-button>

    <template v-if="tabCode == 83">
      <el-button size="mini" :disabled="buttonDisable" @click.native="offlineSellOrders">批量线下卖出</el-button>
      <el-button size="mini" :disabled="buttonDisable" @click.native="onlineSellOrders">批量线上售卖</el-button>
    </template>
  </div>
</template>

<script>
import exportButton from 'sub/component/export-btn-free'
import { eventMouse } from '@/assets/js/eventMouse'
import { upload } from './upload'
export default {
  components: {
    exportButton
  },
  props: ['tabCode', 'buttonDisable', 'selectList'],
  data () {
    return {
      uploadAction: `https://ypwork.zhuanzhuan.com/ypee/partner/recycle/uploadlist`
    }
  },
  methods: {
    receiptNotOne () {
      this.$emit('handleClickToDetail', {}, {code: 'receiptNotOne'})
    },
    onlineSellOrders () {
      this.$emit('onlineSellOrders')
    },
    confirmList () {
      this.$emit('confirmList')
    },
    payMoneyList () {
      this.$emit('payMoneyList')
    },
    offlineSellOrders () {
      this.$emit('offlineSellOrders')
    },
    uploadPrice (file) {
      console.log('uploadPrice: ', file)
      const isExcelReg = /(xlsx|xls)$/i
      const { type, name } = file
      if (type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || !isExcelReg.test(name)) {
        this.$message.error('文件格式不正确！')
        return false
      }
      this.$emit('uploadPrice', file)
    },
    handlePreview (file) {
      console.log('handlePreview: ', file)
    },
    onExceed (file, fileList) {
      console.log(file, fileList)
    },
    onSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      const { code, data } = response
      if (code == 0 && data) {
        eventMouse(data, (res) => {
          this.$emit('uploadPriceSuccess', res, file, fileList)
          this.$emit('getTabs')
        })
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
  vertical-align: top;
  margin: 0 10px;
}
.upload-tips{
  display: inline-block;
  vertical-align: middle;
  color: #6D6F73;
  font-size: 14px;
}
</style>
