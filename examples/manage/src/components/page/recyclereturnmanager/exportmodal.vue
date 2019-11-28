<template lang="html">
  <el-dialog title="导出提示" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose">
    <p>默认导出筛选条件下的所有商品数据，若未进行条件筛选则导出全部商品，导出数据上限为2000条，建议根据条件筛选后再进行数据导出</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalClose">取消</el-button>
      <!--<el-button type="primary" @click="exportData" >确认导出</el-button>-->
      <export-btn :filter="filter" pre_export="commonexport/exportpreypauth/cloudrecycle/returnsExport" @handleExport="exportData" />
    </div>
  </el-dialog>
</template>

<script>
import exportBtn from 'sub/component/export-btn'
export default {
  props: ['filter'],
  data () {
    return {
      dialogFormVisible: true
    }
  },
  components: { exportBtn },
  created () {
    console.log(123)
  },
  methods: {
    modalClose () {
      this.$emit('modalClose')
    },
    exportData () {
      // 导出
      this.$emit('sureExport')
    }
  }
}
</script>

<style lang="scss">
</style>
