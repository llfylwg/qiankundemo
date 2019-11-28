<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="productId" label="" >
      <el-input v-model="form['productId']" placeholder="商品编号"></el-input>
    </el-form-item>

    <el-form-item prop="cate2Id" label="">
      <Select
        placeholder="品牌"
        :list="cate2List"
        v-model="form.cate2Id"
        @input="changeCate2Id"
        :dataMap="sku"
      />
    </el-form-item>

    <el-form-item prop="cate3Id" label="">
      <Select
        placeholder="型号"
        :list="cate3List"
        v-model="form.cate3Id"
        :dataMap="sku"
      />
    </el-form-item>


    <el-form-item prop="level" label="" >
      <Select
        placeholder="商品等级"
        :list="productGradeList"
        v-model="form.level"
        :dataMap="map"
      />
    </el-form-item>

    <el-form-item prop="status" label="">
      <Select
        placeholder="商品状态"
        :list="productStatusList"
        v-model="form.status"
        :dataMap="map"
      />
    </el-form-item>

    <el-form-item label="" >
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
    components: {
      Select,
      exportBtn,
      filterTime
    },
    data () {
      return {
        productGradeList: [],
        productStatusList: [],
        cate3List: [],
        cate2List: [],
        timePlaceHolder: {
          start: '更新时间',
          end: '更新时间'
        },
        form: {
          productId: '',
          cate2Id: '',
          cate3Id: '',
          level: '',
          status: '',
          updateTimeEnd: '',
          updateTimeStart: ''
        },
        map: {
          value: 'code',
          label: 'desc'
        },
        sku: {
          value: 'valueId',
          label: 'valueText'
        },
        numberIds: ['productId', 'cate2Id', 'cate3Id', 'level', 'status']
      }
    },
    computed: {
      getSelectTime () {
        if (this.form.updateTimeStart && this.form.updateTimeEnd) {
          return [this.form.updateTimeStart, this.form.updateTimeEnd]
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
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      this.onSubmit()
      this.getProductGradeList()
      this.getCate2List()
      this.getProductStatusList()
    },
    methods: {
      changeCate2Id (id) {
        this.form['cate3Id'] = ''
        this.getCate3List()
      },
      getCate2List () {
        this.$http.get('wholesale/product/getSkuItemValue', {valueId: '101', itemShotName: 'category2' }).then(res => {
          if (res.code === 0) {
            this.cate2List = res.data
          }
          if (this.form['cate2Id']) {
            this.getCate3List()
          }
        })
      },
      getCate3List () {
        this.$http.get('wholesale/product/getSkuItemValue', {valueId: this.form['cate2Id'], itemShotName: 'category3' }).then(res => {
          if (res.code === 0) {
            this.cate3List = res.data
          }
        })
      },
      getProductGradeList () {
        this.$http.get('wholesale/product/levelList').then(res => {
          if (res.code === 0) {
            this.productGradeList = res.data
          }
        })
      },
      getProductStatusList () {
        this.$http.get('wholesale/product/statusList').then(res => {
          if (res.code === 0) {
            this.productStatusList = res.data
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
        this.form.updateTimeEnd = data.addTimeEnd
        this.form.updateTimeStart = data.addTimeStart
        console.log(this.form)
      },
      onSubmit () {
        this.$emit('search', this.form)
      }
    }
  }
</script>
<style lang="scss">

</style>
