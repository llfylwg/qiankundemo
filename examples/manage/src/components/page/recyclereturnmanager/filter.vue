<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="orderId" label="" >
      <el-input v-model="form['orderId']" placeholder="回收单号"></el-input>
    </el-form-item>
    <el-form-item prop="expressNum" label="">
      <el-input v-model="form['expressNum']" placeholder="物流单号"></el-input>
    </el-form-item>

    <el-form-item label="" prop="createTimeStart" >
      <filter-time :select="getSelectTime" @filter="changeOrderTime" :timePlaceHolder="timePlaceHolder"></filter-time>
    </el-form-item>

    <el-form-item label="">
      <el-button type="primary"  @click="onSubmit">查询</el-button>
      <el-button @click.native="reset">重置</el-button>
      <!-- <el-button type="primary"  @click="onExport">导出</el-button> -->
      <export-btn :filter="filter" pre_export="commonexport/exportpreypauth/cloudrecycle/returnsExport" />
    </el-form-item>
  </el-form>
</template>
<script>
  import filterTime from 'sub/component/time2'
  import Select from 'sub/component/select2'
  import exportBtn from 'sub/component/export-btn'
  import { queryZZCate } from '@/assets/js/Api'
  export default {
    props: ['tabCode', 'filter'],
    components: {
      Select,
      exportBtn,
      filterTime
    },
    data () {
      return {
        timePlaceHolder: {
          start: '开始时间',
          end: '结束时间'
        },
        statusList: [],
        form: {
            orderId: '',
            expressNum: '',
            createTimeStart: '',
            createTimeEnd: '',
        },
        categoryMap: { label: 'label', value: 'value' },
        category: [{
            label: '手机',
            value: '101'
        }, {
            label: '平板电脑',
            value: '119'
        }],
        brand: [],
        brandMap: {
          value: 'id',
          label: 'name'
        },
        model: [],
        modelMap: {
            value: 'id',
            label: 'name'
        },
        numberIds: []
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
        this.form['status'] = Number(n)
        this.reset()
        this.onSubmit()
      }
    },
    created () {
      // this.initCate()
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      // this.form.status = Number(this.form.status);
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      // this.onSubmit()
    },
    methods: {
      initCate () {
        // const { cate1Id } = this.form
        const { cate1Id, cate2Id, cate3Id } = this.$route.query
        console.log('cate1Id: ', cate1Id, cate2Id, cate3Id)
        if (cate1Id) {
          this.form.cate1Id = cate1Id
          this.getBrand(cate1Id).then(brand => {
            const { cate2Id, cate3Id } = this.$route.query
            if (cate2Id) {
              this.form.cate2Id = cate2Id
              this.getModel(cate2Id)
            }
            if (cate3Id) {
              this.form.cate3Id = cate3Id
            }
          })
        }
        if (cate2Id) {
          this.form.cate2Id = cate2Id
          this.getModel(cate2Id)
        }
      },
      getBrand (cateId) {
        return queryZZCate({ cateId }).then(resp => {
          const { respCode, respData } = resp
          this.form.cate2Id = ''
          this.form.cate3Id = ''
          if (respCode == 0) {
            this.brand = respData.cate && respData.cate.children || []
          }
          return this.brand
        })
      },
      getModel (brandId) {
        console.log(brandId, this.brand)
        this.form.cate3Id = ''
        const brand = this.brand.filter(brand => {
          return brand.id == brandId
        })[0]
        this.model = brand && brand.children || []
      },
      reset () {
        this.selectCates = []
        this.$refs['filterForm'].resetFields()
        Object.keys(this.form).map(item => {
          if (item !== 'status') {
            this.form[item] = ''
          }
        })
      },
      changeOrderTime (data) {
        this.form.createTimeEnd = data.addTimeEnd
        this.form.createTimeStart = data.addTimeStart
        // console.log(this.form)
      },
      onSubmit () {
        this.$emit('search', this.form)
      },
      onExport () {
        this.$emit('exportList')
      }
    }
  }
</script>
<style lang="scss">

</style>
