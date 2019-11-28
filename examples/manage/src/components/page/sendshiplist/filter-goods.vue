<template>
  <el-form ref="filterForm" :model="form" size="medium" :inline="true">
    <el-form-item prop="sendcode" label="">
      <el-input v-model="form['pkgId']" placeholder="请输入发货单号"></el-input>
    </el-form-item>
    <el-form-item prop="expressNum" label="">
      <el-input v-model="form['expressNum']" placeholder="请输入物流单号"></el-input>
    </el-form-item>

    <el-form-item prop="gradeId" label="">
      <Select
        placeholder="商品分类"
        :list="catelist"
        v-model="form.cateId"
        :dataMap="map.cateId"
      />
    </el-form-item>

    <el-form-item prop="gradeId" label="">
      <Select
        placeholder="发货状态"
        :list="bizPkgStatusList"
        v-model="form.status"
        :dataMap="map.bizStatus"
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
        catelist: [],
        bizPkgStatusList: [],
        form: {
          cateId: '',
          status: '',
          createTimeEnd: '',
          createTimeStart: '',
          expressNum: '',
          pkgId: '',
        },
        map: {
          cateId: {
            label: 'cateName',
            value: 'cateId'
          },
          bizStatus: {
            label: 'statusDes',
            value: 'status'
          }
        },
        numberIds: ['cateId', 'status']
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
      this.getcatelist()
      this.getbizPkgStatusList()
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
    },
    methods: {
      getcatelist () {
        this.$http.get('common/cateList').then(res => {
          this.catelist = res['data']
        })
      },
      getbizPkgStatusList () {
        this.$http.get('common/bizPkgStatusList').then(res => {
          this.bizPkgStatusList = res['data']
        })
      },
      changeOrderTime (data) {
        this.form.createTimeEnd = data.addTimeEnd
        this.form.createTimeStart = data.addTimeStart
      },
      reset () {
        this.selectCates = []
        this.$refs['filterForm'].resetFields()
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
      },
      onSubmit () {
        this.$emit('search', this.form)
      }
    }
  }
</script>
<style lang="scss">

</style>
