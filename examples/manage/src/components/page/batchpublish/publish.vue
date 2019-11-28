<template lang="html">
  <div class="sendship-form-box">
    <el-form ref="filterForm" :model="form" :inline="true">
      <el-form-item prop="count" >
        <el-input size="medium" v-model="form.expressCodeStr" placeholder="输入快递单号，最多50条，请用英文“,”相隔"  @input="inputNum" type="textarea" :autosize="{ minRows: 8}" ></el-input>
      </el-form-item>
    </el-form>
    <div class="button-wrap">
        <el-button type="primary" @click="onSubmit" :disabled="canSub">发布商品</el-button>
    </div>
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
        form: {
          expressCodeStr: ''
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
        this.$nextTick(() => {
          Object.assign(this.form, {expressCodeStr: val})
        })
      },
      onSubmit () {
        this.$http.get('bizpkg/batchCreate', this.form).then(({msg}) => {
          this.$alert(msg, '提示', {
           confirmButtonText: '确定',
           callback: () => {
             this.form['expressCodeStr'] = ''
           }
         })
       }).catch(({msg}) => {
         this.$alert(msg, '提示', {
          confirmButtonText: '确定'
        })
       })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .sendship-form-box .el-textarea {
    width: 535px;
  }
  .button-wrap{
    text-align: center;
  }
</style>
