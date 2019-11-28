<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="sellerName" label="" >
      <el-input v-model="form['sellerName']" placeholder="店长名称"></el-input>
    </el-form-item>
    <el-form-item prop="mobilePhone" label="">
      <el-input v-model="form['mobilePhone']" placeholder="店长手机号"></el-input>
    </el-form-item>

    <el-form-item label="" prop="startUpdateTime" >
      <filter-time :select="getSelectTime" @filter="changeOrderTime" :timePlaceHolder="timePlaceHolder"></filter-time>
    </el-form-item>

    <el-form-item label="">
      <el-button type="primary"  @click="onSubmit">查询</el-button>
      <el-button @click.native="reset">重置</el-button>
      <el-button type="primary"  @click="onExport">导出</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import filterTime from 'sub/component/time2'
  import Select from 'sub/component/select2'
  import exportBtn from 'sub/component/export-btn'
  import { queryZZCate } from '@/assets/js/Api'
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
          start: '开始日期',
          end: '结束日期'
        },
        statusList: [],
        form: {
            sellerName: '',
            mobilePhone: '',
            startUpdateTime: '',
            endUpdateTime: '',
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
        if (this.form.startUpdateTime && this.form.endUpdateTime) {
          return [this.form.startUpdateTime, this.form.endUpdateTime]
        } else {
          return []
        }
      }
    },
    watch: {
      tabCode (n) {
        // 监听顶部tab切换  然后拉取更新form拉新数据
        this.form['orderType'] = Number(n)
        this.reset()
        this.onSubmit()
      }
    },
    created () {
      this.initCate()
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      // this.form.status = Number(this.form.status);
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      this.onSubmit()
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
          this.form[item] = ''
          if (item == 'orderType') {
            this.form[item] = 0
          }
        })
      },
      changeOrderTime (data) {
        this.form.endUpdateTime = data.addTimeEnd
        this.form.startUpdateTime = data.addTimeStart
        // console.log(this.form)
      },
      onSubmit () {
        if (this.tabCode != 0) {
          this.form.orderType = Number(this.tabCode)
        }
        // this.form['tabCode'] = this.tabCode
        this.$emit('search', this.form)
      },
      onExport () {
        this.$emit('exportList', this.form)
      }
    }
  }
</script>
<style lang="scss">

</style>
