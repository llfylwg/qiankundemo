<template lang="html">
  <div class="sendship-form-box">
    <el-form ref="filterForm" :model="form" size="small" :inline="true" label-width="90px" >
      <el-form-item prop="oldLevelId" label="商品分类：" size="large">
        <Select
          placeholder="请选择商品类型"
          :list="catelist"
          v-model="form.cate1Id"
          :dataMap="map"
        />
      </el-form-item>
      <el-form-item prop="count" label="商品数量：" size="large">
        <el-input v-model="form.count" :placeholder="`请输入数量，不可高于${maxNum}`"  type="number" @input="inputNum" :max="maxNum"></el-input>
      </el-form-item>
      <div class="">
        <el-form-item  label=" " size="large">
            <el-button type="primary" @click="onSubmit" :disabled="canSub">发布商品</el-button>
       </el-form-item>
      </div>
    </el-form>
  </div>
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
        catelist: [],
        maxNum: 50,
        form: {
          cate1Id: '',
          count: ''
        },
        map: {
          label: 'cateName',
          value: 'cateId'
        }
      }
    },
    created () {
      this.getcatelist()
    },
    computed: {
      canSub () {
        // 判断发布商品按钮是否可以点击操作
        const keys = Object.keys(this.form)
        let curSub = true
        keys.map(item => {
          if (!this.form[item]) curSub = false
        })
        return !curSub
      }
    },
    methods: {
      inputNum (val) {
        console.log(val, this.maxNum)
        if (Number(val) <= 0) {
          val = ''
        }
        if (Number(val) > this.maxNum) {
          val = this.maxNum
        }
        this.$nextTick(() => {
          Object.assign(this.form, {count: val})
        })
      },
      getcatelist () {
        this.$http.get('common/cateList').then(res => {
          this.catelist = res['data']
        })
      },
      onSubmit () {
        const num = this.form['count']
        this.form['count'] = ''
        this.$http.get('bizpkg/create', {cate1Id: this.form['cate1Id'], count: Number(num)}).then(res => {
          console.log(res)
          this.$router.push({
            path: 'sendShipList'
          })
        })
      }
    }
  }
</script>
<style lang="scss">
.sendship-form-box {
  .el-input__inner, .el-input__inner{
    width: 400px!important;
  }
}
</style>
