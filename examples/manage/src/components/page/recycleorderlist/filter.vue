<template lang="html">
  <el-form :inline="true" :model="form" label-width="100px" ref="filterForm" size="medium">
    <el-form-item label="" prop="orderId">
      <el-input placeholder="订单编号" v-model="form['orderId']"></el-input>
    </el-form-item>
    <el-form-item label="" prop="storeName">
      <el-input placeholder="门店名称" v-model="form['storeName']"></el-input>
    </el-form-item>
    <el-form-item label="" prop="storeContract">
      <el-input placeholder="手机号码" v-model="form['storeContract']"></el-input>
    </el-form-item>
    <el-form-item label="" prop="storeContract">
      <el-input placeholder="质检码" v-model="form['qcCode']"></el-input>
    </el-form-item>
    <el-form-item>
      <el-select placeholder="选择对接人" v-model="form.agentUid">
        <el-option
                :key="item.agentUid"
                :label="item.agentName"
                :value="item.agentUid"
                v-for="item in effectAgents">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 选择类型 -->
    <el-form-item label="" prop="storeContract">
      <Select
          :clearable="false"
          :dataMap="categoryMap"
          :list="category || []"
          @input="(cateId) => getBrand(cateId)"
          placeholder="请选择类型"
          v-model="form.cate1Id"
      />
    </el-form-item>

    <!-- 选择品牌 -->
    <el-form-item label="" prop="storeContract">
      <Select
          :clearable="false"
          :dataMap="brandMap"
          :disabled="!form.cate1Id"
          :list="brand || []"
          @input="(brandId) => getModel(brandId)"
          placeholder="请选择品牌"
          v-model="form.cate2Id"
      />
    </el-form-item>

    <!-- 选择型号 -->
    <el-form-item label="" prop="storeContract">
      <Select
          :clearable="false"
          :dataMap="modelMap"
          :disabled="!form.cate2Id"
          :list="model || []"
          placeholder="请选择型号"
          v-model="form.cate3Id"
      />
    </el-form-item>

    <el-form-item label="" prop="startUpdateTime">
      <filter-time :select="getSelectTime" :timePlaceHolder="timePlaceHolder" @filter="changeOrderTime"></filter-time>
    </el-form-item>

    <el-form-item label="">
      <el-button @click="onSubmit" type="primary">查询</el-button>
      <el-button @click.native="reset">重置</el-button>
      <export-btn :filter="filter" pre_export="commonexport/exportpreypauth/cloudrecycle/orderexport"
                  v-if="tabCode === '0' || tabCode === 0"/>
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
          start: '最后更新时间',
          end: '最后更新时间'
        },
        statusList: [],
        form: {
          agentUid: '',
          orderId: '',
          qcCode: '',
          storeName: '',
          storeContract: '',
          cate1Id: '',
          cate2Id: '',
          cate3Id: '',
          startUpdateTime: '',
          endUpdateTime: '',
          orderType: '',
        },
        categoryMap: {label: 'label', value: 'value'},
        effectAgents:{},
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
      this.$http.get('partner/agent/agentUids').then(res => {
        this.effectAgents = res.data
      });
    },
    mounted () {
      Object.assign(this.form, this.$route.query)
      this.form.status = this.form.status ? Number(this.form.status) : ''
      this.numberIds.map(item => {
        this.form[item] = this.form[item] ? Number(this.form[item]) : ''
      })
      // this.onSubmit()
    },
    methods: {
      initCate () {
        // const { cate1Id } = this.form
        const {cate1Id, cate2Id, cate3Id} = this.$route.query
        console.log('cate1Id: ', cate1Id, cate2Id, cate3Id)
        if (cate1Id) {
          this.form.cate1Id = cate1Id
          this.getBrand(cate1Id).then(brand => {
            const {cate2Id, cate3Id} = this.$route.query
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
        return queryZZCate({cateId}).then(resp => {
          const {respCode, respData} = resp
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
      }
    }
  }
</script>
<style lang="scss">

</style>
