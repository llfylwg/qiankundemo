<template>
  <el-card class="item-card" v-if="reportData">
    <div class="header-box" slot="header">
      <span>质检报告
      <span class="red" v-if="reportData.precheckType == 0">（无法质检）</span>
      <span class="red" v-if="reportData.precheckType == 3">（部分质检）</span>
      </span>
      <span>质检码：{{reportData.zjm}}</span>
      <span>质检师：{{reportData.zjOperator}}</span>
      <el-button v-if="!forbidUpdate" class="right" type="text" @click="goReport">修改质检报告</el-button>
    </div>
    <el-row>
      <el-col>
        <div class="text qc-item flex">
          <div class="qc-item-title">
            基本信息
          </div>
          <div class="qc-item-desc">
            <span>{{reportData.brand}} {{reportData.model}} <template v-if="reportData.subModel">(子型号：{{reportData.subModel}})</template></span>
            <template v-for="basic in reportData.basicInfo">
              {{basic}}
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="text qc-item flex">
          <div class="qc-item-title">
            IMEI
          </div>
          <div class="qc-item-desc">
            <span>{{reportData.imei}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="text qc-item flex">
          <div class="qc-item-title">
            工程师有话说
          </div>
          <div class="qc-item-desc">
            <span>{{reportData.zjStr}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-for="i in rowLen" :key="i">
      <el-col :span="8" v-for="item in getRowData(i)" :key="item.name">
        <div class="text qc-item flex">
          <div class="qc-item-title">
            {{item.name}}
          </div>
          <div class="qc-item-desc">
                <span :class="[desc.normal ? '' : 'red']" v-for="desc in item.subItem">
              {{desc.name}}
              </span>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'report',
    props: {
      zjId: String,
      forbidUpdate: Boolean
    },
    data () {
      return {
        reportData: {}
      }
    },
    computed: {
      tableData () {
        if (this.reportData && this.reportData.qcModules) {
          const { qcModules } = this.reportData
          let data = []
          qcModules.forEach(item => {
            data = data.concat(item.qcItems)
          })
          return data
        }
        return []
      },
      length () {
        return this.tableData ? this.tableData.length : 0
      },
      rowLen () {
        return this.length > 0 ? Math.ceil(this.length / 3) : 0
      }
    },
    created () {
      this.$http.get('https://app.zhuanzhuan.com/zzopen/ypdeal/report2', {
        id: this.zjId
      }).then(res => {
        this.reportData = res ? res.respData : {}
      })
    },
    methods: {
      goReport () {
        window.open(`http://youpinoffice.zhuanzhuan.com/qc/zj/record_new?id=${this.zjId}`)
      },
      getRowData (i) {
        const cha = 3
        const start = (i - 1) * 3
        return this.length > 0 ? this.tableData.slice(start, start + cha) : []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
  }

  .text {
    font-size: 14px;
    color: #6D6F73;
  }

  .qc-item {
    padding: 16px 0;

    &-title {
      width: 90px;
      color: #6D6F73;
    }

    &-desc {
      color: #303133;
      flex: 1;
    }
  }

  .el-row {
    border-bottom: 1px solid #EBEEF5;
  }

  .el-button--text {
    padding-top: 0;
    padding-bottom: 0;
  }

  .red {
    color: red;
  }

  .right {
    float: right;
  }

  .flex {
    display: flex;
  }
</style>
