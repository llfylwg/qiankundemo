<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="productId" label="">
      <el-input v-model="form['productId']" placeholder="请输入商品编号"></el-input>
    </el-form-item>
    <el-form-item prop="qcCode" label="">
      <el-input v-model="form['qcCode']" placeholder="请输入质检码"></el-input>
    </el-form-item>
    <el-form-item prop="imei" label="">
      <el-input v-model="form['imei']" placeholder="请输入IMEI码"></el-input>
    </el-form-item>
    <el-form-item prop="expressNum" label="">
      <el-input v-model="form['expressNum']" placeholder="请输入退货物流单号"></el-input>
    </el-form-item>

    <el-form-item prop="status" label="">
      <Select
        placeholder="退货状态"
        :list="bizReturnPkgStatusList"
        v-model="form.status"
        :dataMap="map"
      />
    </el-form-item>

    <el-form-item label="" prop="goodsCreateTimeBegin">
      <filter-time :select="getSelectTime" @filter="changeOrderTime"></filter-time>
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
  import basicCate from '../../cate/basic'
  export default {
    components: {
      Select,
      exportBtn,
      filterTime,
      basicCate
    },
    data () {
      return {
        bizReturnPkgStatusList: [],
        form: {
          status: '',
          qcCode: '',
          productId: '',
          imei: '',
          expressNum: '',
          createTimeEnd: '',
          createTimeStart: ''
        },
        map: {
          value: 'status',
          label: 'statusDes'
        },
        numberIds: ['status']
      }
    },
    computed: {
      getSelectTime () {
        if (this.form.createTimeStart && this.form.createTimeEnd) {
          return [this.form.createTimeStart, this.form.createTimeEnd]
        } else {
          return []
        }
      }
    },
    created () {
      this.getBizReturnPkgStatusList()
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number( this.form[item]) : ''
      })
    },
    methods: {
      changeOrderTime (data) {
        this.form.createTimeEnd = data.addTimeEnd
        this.form.createTimeStart = data.addTimeStart
      },
      getBizReturnPkgStatusList () {
        this.$http.get('common/bizReturnPkgStatusList').then(res => {
          if (res.code === 0) {
            this.bizReturnPkgStatusList = res.data
          }
        })
      },
      reset () {
        this.selectCates = []
        this.$refs['filterForm'].resetFields()
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
      },
      onSubmit () {
        // this.inputItems.map(item => {
        //   this.form[item.id] = this.form[item.id].trim()
        // })
        this.$emit('search', this.form)
      }
    }
  }
</script>
<style lang="scss">

</style>
