<template>
  <el-row :gutter="12">
    <el-col :span="12">
      <el-card :key="i" shadow="always" v-for="(e,i) in stateMessage">
        <div class="flex">
          <div>启用{{e.name}}</div>
          <div>
            <el-switch :value="!!state[i]" @change="switchConfig(i)" active-color="#13ce66"
                       inactive-color="#ff4949"></el-switch>
            <span class="title">{{state[i] ? '已开启' : '已关闭'}}</span>
          </div>
        </div>
        <div class="desc">{{e.describe[state[i]]}}</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  const STATE_MESSAGE = [
    {
      name: '质检服务',
      switchName: 'switchQcSupport',
      describe: ['关闭质检流程后，不在系统中完成货品管理及质检，回收单将不为卖家展示质检报告。', '启用质检流程后，需使用质检系统操作收货质检。']
    },
    {
      name: '黄牛招募',
      switchName: 'switchAgentSupport',
      describe: ['关闭后，专属m站/小程序不展示任何招募合作伙伴的内容。', '启用后，可在线招募黄牛合伙人。']
    },
    {
      name: '黄牛/BD极速结算',
      switchName: 'switchQuickPaySupport',
      describe: ['关闭后，公司BD或合作黄牛，将无权限为门店卖家开通极速结算服务。', '启用后，公司BD或合作黄牛，有权限为门店卖家开通极速结算服务。']
    },
    {
      name: '报价器',
      switchName: 'switchEvalSupport',
      describe: ['关闭后，将不展示在线报价入口', '启用后，在回收小程序展示在线报价入口，按照配置的报价器为门店卖家线上报价']
    }
  ]
  export default {
    data () {
      return {
        value: false,
        state: [0, 0, 0, 0],
        stateMessage: STATE_MESSAGE
      }
    },
    created () {
      Promise.all(['/partner/common/qcSupport', '/partner/common/agentSupport', '/partner/common/evalSupport']
        .map(e => this.$http.get(e))).then(res => {
        this.state = res.map(e => Number(Boolean(e.data)))
      })
    },
    methods: {
      switchConfig (i) {
        const modal = [this.qcModal, '', '', '']
        if (!this.state[i] || !modal[i]) return this.switchState(i)
        modal[i](i)
      },
      switchState (i) {
        const {switchName} = this.stateMessage[i]
        const nextState = Number(!this.state[i])
        this.$http.get(`/partner/common/${switchName}`, {
          switch: nextState
        }).then(res => {
          if (!res.data) return this.$message.error(res.msg || '切换失败')
          this.$set(this.state, i, nextState)
          this.$message.success((this.state[i] ? '已开启' : '已关闭') + this.stateMessage[i].name)
        }).catch(e => {
          console.log(e)
        })
      },
      qcModal (i) {
        this.$confirm('关闭后，不在系统中完成货品管理及质检，无法为卖家展示质检报告。', '关闭质检配置', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => this.switchState(i))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
  }

  .title {
    font-size: 16px;
    margin-bottom: 12px;
    color: #2E3135;
  }

  .el-row {
    display: flex;
    justify-content: center;
    margin-top: 100px;

    .el-card {
      margin-bottom: 20px;
    }
  }

  .desc {
    font-size: 12px;
    color: #909399;
  }
</style>
