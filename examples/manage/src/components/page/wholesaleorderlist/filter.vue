<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="orderId" label="" >
      <el-input v-model="form['orderId']" placeholder="订单编号"></el-input>
    </el-form-item>
    <el-form-item prop="buyerUid" label="">
      <el-input v-model="form['buyerUid']" placeholder="买家UID"></el-input>
    </el-form-item>

    <el-form-item prop="status" label="" v-if="tabCode == 1">
      <Select
        placeholder="订单状态"
        :list="statusList"
        v-model="form.status"
        :dataMap="map"
      />
    </el-form-item>


    <el-form-item label="" prop="lastOpTimeStart" >
      <filter-time :select="getSelectTime" @filter="changeOrderTime" :timePlaceHolder="timePlaceHolder"></filter-time>
    </el-form-item>

    <el-form-item label="">
      <el-button type="primary"  @click="onSubmit">查询</el-button>
      <el-button @click.native="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import filterTime from 'sub/component/time2'
  import Select from 'sub/component/select2'
  import exportBtn from 'sub/component/export-btn'
  export default {
    props: ['tabCode'],
    components: {
      Select,
      exportBtn,
      filterTime
    },
    data () {
      return {
        timePlaceHolder: {
          start: '最后更新时间',
          end: '最后更新时间'
        },
        statusList: [],
        form: {
          orderId: '',
          buyerUid: '',
          status: 1,
          lastOpTimeEnd: '',
          lastOpTimeStart: ''
        },
        map: {
          value: 'code',
          label: 'desc'
        },
        numberIds: []
      }
    },
    computed: {
      getSelectTime () {
        if (this.form.lastOpTimeStart && this.form.lastOpTimeEnd) {
          return [this.form.lastOpTimeStart, this.form.lastOpTimeEnd]
        } else {
          return []
        }
      }
    },
    watch: {
      tabCode (n) {
        // 监听顶部tab切换  然后拉取更新form拉新数据
        this.form['status'] = Number(n)
        this.reset()
        this.onSubmit()
      }
    },
    created () {
      this.getStatusList()
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      this.form.status = Number(this.form.status);
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      this.onSubmit()
    },
    methods: {
      getStatusList () {
        this.$http.get('wholesale/order/statusList').then(res => {
          if (res.code === 0) {
            this.statusList = res.data
          }
        })
      },
      reset () {
        this.selectCates = []
        this.$refs['filterForm'].resetFields()
        Object.keys(this.form).map(item => {
          this.form[item] = ''
          if (item == 'status') {
            this.form[item] = 1
          }
        })
      },
      changeOrderTime (data) {
        this.form.lastOpTimeEnd = data.addTimeEnd
        this.form.lastOpTimeStart = data.addTimeStart
        // console.log(this.form)
      },
      onSubmit () {
        if (this.tabCode != 1) {
          this.form.status = Number(this.tabCode)
        }
        // this.form['tabCode'] = this.tabCode
        this.$emit('search', this.form)
      }
    }
  }
</script>
<style lang="scss">

</style>
