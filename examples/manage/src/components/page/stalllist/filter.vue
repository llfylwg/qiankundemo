<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="fuzzyStallName" label="" >
      <el-input v-model="form['fuzzyStallName']" placeholder="门店名称"></el-input>
    </el-form-item>

    <el-form-item prop="fuzzyManagerName" label="" >
      <el-input v-model="form['fuzzyManagerName']" placeholder="门店店长"></el-input>
    </el-form-item>

    <el-form-item prop="contactNumber" label="" >
      <el-input v-model="form['contactNumber']" placeholder="手机号码"></el-input>
    </el-form-item>

    <el-form-item prop="type" label="">
      <Select
        placeholder="门店类型"
        :list="stallTypes"
        v-model="form.type"
        :dataMap="typesMap"
      />
    </el-form-item>

    <el-form-item prop="contactNumber" label="" >
      <el-input v-model="form['agentName']" placeholder="对接人姓名"></el-input>
    </el-form-item>

    <el-form-item prop="label" label="">
      <Select
        placeholder="客户标签"
        :list="stallLabels"
        v-model="form.label"
        :dataMap="typesMap"
      />
    </el-form-item>

    <el-form-item label="" >
      <filter-time :select="getSelectTime" @filter="changeOrderTime" :timePlaceHolder="timePlaceHolder"></filter-time>
    </el-form-item>

    <el-form-item label="">
      <el-button type="primary"  @click="onSubmit">查询</el-button>
      <el-button type="primary" icon="el-icon-download" @click="exportFn">导出</el-button>
      <el-button @click.native="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { paramsObjToStr } from 'sub/lib/utils'
  import filterTime from 'sub/component/time2'
  import Select from 'sub/component/select2'
  export default {
    components: {
      Select,
      filterTime
    },
    data () {
      return {
        stallTypes: [],
        stallLabels: [],
        timePlaceHolder: {
          start: '开始时间',
          end: '结束时间'
        },
        form: {
          fuzzyStallName: '',
          fuzzyManagerName: '',
          contactNumber: '',
          type: '',
          agentName: '',
          createTimeStart: '',
          createTimeEnd: '',
          label: ''
        },
        typesMap: {
          value: 'code',
          label: 'desc'
        }
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
    watch: {
      tabCode (n) {
        // 监听顶部tab切换  然后拉取更新form拉新数据
        this.reset()
        this.onSubmit()
      }
    },
    created () {
      Object.assign(this.form, this.$route.query)
      this.onSubmit()
      this.getStallTypes()
      this.getStallLabels()
    },
    methods: {
      getStallTypes () {
        this.$http.get('partner/stall/types').then(resp => {
          if (resp.code == 0) {
            this.stallTypes = resp.data.map(item => {
              const code = item.code.toString()
              return Object.assign({}, item, { code })
            })

          }
        })
      },
      getStallLabels () {
        this.$http.get('partner/stall/labels').then(resp => {
          if (resp.code == 0) {
            this.stallLabels = resp.data.map(item => {
              const code = item.code.toString()
              return Object.assign({}, item, { code })
            })
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
      changeOrderTime (data) {
        this.form.createTimeEnd = data.addTimeEnd
        this.form.createTimeStart = data.addTimeStart
      },
      onSubmit () {
        this.$emit('search', this.form)
      },
      exportFn () {
        location.href = `https://ypwork.zhuanzhuan.com/ypee/partner/stall/exportdata?${paramsObjToStr(this.form)}`
      }
    }
  }
</script>
<style lang="scss">

</style>
