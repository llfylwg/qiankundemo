<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="orderId" label="" >
      <el-input v-model="form['orderId']" placeholder="订单编号"></el-input>
    </el-form-item>
    <el-form-item prop="buyerUid" label="">
      <el-input v-model="form['buyerUid']" placeholder="买家UID"></el-input>
    </el-form-item>


    <el-form-item label="" prop="startDealTime" >
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
        productGradeList: [],
        statusList: [],
        cate2IdList: [],
        cate3IdList: [],
        timePlaceHolder: {
          start: '退款发起时间',
          end: '退款发起时间'
        },
        martList: [],
        form: {
          orderId: '',
          buyerUid: '',
          statusCode: '',
          startOrderTime: '',
          endOrderTime: '',
          endDealTime: '',
          startDealTime: ''
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
        if (this.form.startDealTime && this.form.endDealTime) {
          return [this.form.startDealTime, this.form.endDealTime]
        } else {
          return []
        }
      }
    },
    watch: {
      tabCode (n) {
        // 监听顶部tab切换  然后拉取更新form拉新数据
        this.reset()
        this.onSubmit()
      }
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      this.onSubmit()
    },
    methods: {
      reset () {
        this.selectCates = []
        this.$refs['filterForm'].resetFields()
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
      },
      changeOrderTime (data) {
        this.form.endDealTime = data.addTimeEnd
        this.form.startDealTime = data.addTimeStart
        console.log(this.form)
      },
      onSubmit () {
        if (this.tabCode) {
          this.form['status'] = this.tabCode
        }
        this.form['tabCode'] = this.tabCode
        this.$emit('search', this.form)
      }
    }
  }
</script>
<style lang="scss">

</style>
