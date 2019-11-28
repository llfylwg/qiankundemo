<template lang="html">
  <div class="buttons-wrap" v-if="showTab.indexOf(tabCode) > -1">

    <el-button size="mini" v-if="['1',1,3,'3'].indexOf(tabCode) > -1" @click.native="exportList">批量导出</el-button>

    <!-- <el-button size="mini" v-if="['2',2].indexOf(tabCode) > -1" @click.native="batchFreeShip" :disabled="buttonDisable">批量免运费</el-button> -->

    <el-button size="mini" v-if="['2',2].indexOf(tabCode) > -1" @click.native="cancelOrder" :disabled="buttonDisable">批量取消</el-button>

    <el-upload
      size="mini"
      class="upload-button"
      ref="upload"
      name="deliverFile"
      action="//ypwork.zhuanzhuan.com/ypee/wholesale/order/excelDeliver"
      :show-file-list="false"
      :on-success="success"
      :auto-upload="true"
      :with-credentials="true"
      v-if="['3',3].indexOf(tabCode) > -1"
      >
      <el-button size="mini" >批量发货</el-button>
    </el-upload>
    <el-button v-if="['3',3].indexOf(tabCode) > -1"
        size="mini" @click="face2face">批量面交</el-button>
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
        1,
        2,
        3,
        '1',
        '2',
        '3'
      ]
    }
  },
  methods: {
    face2face () {
      const orderIdArr = this.selectList.map(item => {
        return item.orderId
      })
      this.$confirm('面交发货后，无法再次填写物流，请确认已与买家协商一致当面交易，是否确认面交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/wholesale/order/deliverFaceToFace', {
          orderIds: orderIdArr.join('|')
        }).then(res => {
          this.$message({
            type: 'success',
            message: '面交发货成功'
          })
          this.$emit('getList')
        })
      })
    },
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
  margin: 0 10px;
}
</style>
