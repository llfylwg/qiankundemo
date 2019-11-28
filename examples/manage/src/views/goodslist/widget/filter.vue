<template lang="html">
  <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="100px">
    <el-form-item prop="bizPkgId" label="" v-if="tabCode != 4">
      <el-input v-model="form['bizPkgId']" placeholder="请输入发货单号"></el-input>
    </el-form-item>
    <el-form-item prop="productId" label="">
      <el-input v-model="form['productId']" placeholder="请输入商品编号"></el-input>
    </el-form-item>
    <el-form-item prop="qcCode" label="">
      <el-input v-model="form['qcCode']" placeholder="请输入质检码"></el-input>
    </el-form-item>
    <el-form-item prop="deviceCode" label="">
      <el-input v-model="form['deviceCode']" placeholder="请输入IMEI码"></el-input>
    </el-form-item>

    <el-form-item prop="gradeId" label="" v-if="tabCode != 4">
      <Select
        placeholder="商品等级"
        :list="productGradeList"
        v-model="form.gradeId"
        :dataMap="map"
      />
    </el-form-item>

    <el-form-item v-if="isB2bSeller" prop="b2bGradeId" label="">
      <Select
        placeholder="b2b等级"
        :list="getb2bGradesList"
        v-model="form.b2bGradeId"
        :dataMap="idmap"
      />
    </el-form-item>

    <el-form-item prop="finenessId" label="" v-if="tabCode != 4">
      <Select
        placeholder="请选择商品成色"
        :list="productFinenessList"
        v-model="form.finenessId"
        :dataMap="map"
      />
    </el-form-item>
    <el-form-item prop="status" label="" v-if="tabCode == null">
      <Select
        placeholder="请选择商品状态"
        :list="productStatusList"
        v-model="form.status"
        :dataMap="map"
      />
    </el-form-item>

    <el-form-item prop="martId" label="" v-if="tabCode == 5 || tabCode == 3">
      <Select
        placeholder="销售卖场"
        :list="martList"
        v-model="form.martId"
        :dataMap="map"
      />
    </el-form-item>

    <el-form-item label="" prop="goodsCreateTimeBegin" v-if="!tabCode|| tabCode == 1">
      <filter-time :select="getSelectTime" @filter="changeOrderTime" :timePlaceHolder="timePlaceHolder"></filter-time>
    </el-form-item>

    <el-form-item prop="recycleId" label="" v-show="isPartner">
      <el-input v-model="form.recycleId" placeholder="请输入回收单ID"></el-input>
    </el-form-item>

    <el-form-item prop="goodsType" label="" v-show="isPartner">
      <Select
        placeholder="商品类型"
        :list="goodTypeList"
        v-model="form.goodsType"
        :dataMap="map"
      />
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
  import basicCate from '@/components/cate/basic'
  import { getCookie } from '@/assets/js/helper'
  export default {
    props: ['tabCode', 'b2bGradesList'],
    components: {
      Select,
      exportBtn,
      filterTime,
      basicCate
    },
    data () {
      return {
        productGradeList: [],
        productFinenessList: [],
        productStatusList: [],
        timePlaceHolder: {
          start: '成交时间',
          end: '成交时间'
        },
        martList: [],
        goodTypeList: [{
          code: '0',
          desc: '全部'
        }, {
          code: '1',
          desc: '普通商品'
        }, {
          code: '2',
          desc: '回收商品'
        }],
        form: {
          gradeId: '',
          finenessId: '',
          status: '',
          qcCode: '',
          deviceCode: '',
          bizPkgId: '',
          cate1Id: '',
          cate2Id: '',
          cate3Id: '',
          productId: '',
          martId: '',
          goodsType: '0',
          recycleId: '',
          b2bGradeId: '',
          dealSuccessTimeEnd: '',
          dealSuccessTimeStart: ''
        },
        map: {
          value: 'code',
          label: 'desc'
        },
        idmap: {
          value: 'id',
          label: 'name'
        },
        numberIds: ['gradeId', 'b2bGradeId', 'finenessId', 'cate1Id', 'cate3Id', 'cate3Id', 'martId', 'status']
      }
    },
    computed: {
      isB2bSeller () {
        return getCookie('isB2bSeller') == '1'
      },
      isPartner () {
        const isPartner = parseInt(getCookie('isPartner'), 10) || 0
        return isPartner
      },
      getSelectTime () {
        if (this.form.dealSuccessTimeStart && this.form.dealSuccessTimeEnd) {
          return [this.form.dealSuccessTimeStart, this.form.dealSuccessTimeEnd]
        } else {
          return []
        }
      },
      getb2bGradesList () {
        return this.b2bGradesList ? [
          {
            id: -1,
            name: '未设置等级'
          },
          ...this.b2bGradesList
        ] : []
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
      this.getProductGradeList()
      this.getProductStatusList()
      this.getProductFinenessList()
      this.getMartList()
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      this.onSubmit()
    },
    methods: {
      getProductGradeList () {
        this.$http.get('common/productGradeList').then(res => {
          if (res.code === 0) {
            this.productGradeList = res.data
          }
        })
      },
      getProductFinenessList () {
        this.$http.get('common/productFinenessList').then(res => {
          if (res.code === 0) {
            this.productFinenessList = res.data
          }
        })
      },
      getProductStatusList () {
        this.$http.get('common/productStatusList').then(res => {
          if (res.code === 0) {
            this.productStatusList = res.data
          }
        })
      },
      getMartList () {
        this.$http.get('common/martList').then(res => {
          if (res.code === 0) {
            this.martList = res.data
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
        this.form.dealSuccessTimeEnd = data.addTimeEnd
        this.form.dealSuccessTimeStart = data.addTimeStart
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
