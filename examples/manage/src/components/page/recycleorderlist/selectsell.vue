<template lang="html">
  <el-dialog :before-close="modalClose" :visible.sync="dialogFormVisible" center custom-class="select-store"
             title="选择卖场" width="420px">
    <el-form :model="form" class="price-form" label-width="100px">
      <el-form-item label="卖场：" prop="storeContract">
        <Select
            :clearable="false"
            :dataMap="typeMap"
            :list="types || []"
            placeholder="请选择卖场"
            v-model="form.type"
        />
      </el-form-item>
      <el-form-item label="价格：">
        <el-input placeholder="价格" type="number" v-model="form.price"></el-input>
      </el-form-item>
      <div v-if="form.type == 2">
        <div class="price-float"
             v-if="form.price > 15">
          <div class="label">议价浮动:</div>
          <el-radio-group v-model="form.bargainPrice" size="medium">
            <el-radio-button v-for="(item, index) in curFloatPrice" :key="index" :label="item">
              - {{item}}
            </el-radio-button>
          </el-radio-group>
        </div>
        <el-form-item label="b2b等级：">
          <el-select v-model="form.b2bGradeId" placeholder="请选择" @change="$emit('change', value)">
            <el-option
                v-for="item in b2bGradesList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

    </el-form>
    <div class="select-sell-desc">特别说明：无法质检的商品不能选择进入已验机卖场</div>
    <div class="dialog-footer" slot="footer">
      <el-button @click="sure" type="primary">确定</el-button>
      <el-button @click="modalClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Select from 'sub/component/select2'
  import { selectSell } from '@/assets/js/Api'

  export default {
    props: ['optData'],
    components: {Select},
    data () {
      return {
        dialogFormVisible: true,
        typeMap: {label: 'label', value: 'value'},
        types: [
          {
            label: '已验机卖场',
            value: '0'
          },
          {
            label: '暗拍卖场',
            value: '2'
          }],
        b2bGradesList: [],
        form: {
          type: '',
          price: 0,
          bargainPrice: '',
          b2bGradeId: ''
        }
      }
    },
    computed: {
      curFloatPrice () {
        let p = this.form.price
        if( (p >= 1 && p <= 99) || !p) return [5, 10, 15]
        if(p >= 100 && p <= 499) return [10, 15, 20]
        if(p >= 500 && p <= 999) return [15, 30, 45]
        if(p >= 1000 && p <= 1999) return [20, 40, 60]
        if(p >= 2000 && p <= 3499) return [30, 60, 90]
        if(p >= 3500 && p <= 4999) return [40, 70, 100]
        if(p >= 5000) return [50, 100, 150]
      }
    },
    created () {
      this.getb2bGradeList()
    },
    methods: {
      getb2bGradeList () {
        this.$http.get('common/b2bGradeList').then(res => {
          if (res.code === 0) {
            this.b2bGradesList = res.data
          }
        })
      },
      modalClose () {
        this.$emit('modalClose')
      },
      validate () {
        let {price, type} = this.form
        if (!type) {
          this.$message.error('请选择卖场！')
          return false
        }
        if (!price) {
          this.$message.error('请输入报价价格！')
          return false
        }
        price = price * 100
        if (typeof price != 'number') {
          this.$message.error('请输入正确的价格！')
          return false
        }
        if (Math.floor(price) != price) {
          this.$message.error('价格最多两位小数哦~')
          return false
        }
        if (price >= 20000 * 100) { // 单位：分
          this.$message.error('报价不能超过2万元！')
          return false
        }
        if (price < 0) {
          this.$message.error('报价价格必须大于0！')
          return false
        }
        return true
      },
      sure () {
        if (!this.validate()) return
        const {orderId} = this.optData
        const price = this.form.price * 100
        selectSell({orderId, ...this.form, price}).then(resp => {
          const {code, data} = resp
          if (code == 0 && data.status == 0) {
            this.$message({
              message: '选择卖场成功',
              type: 'success'
            })
          }
          this.$emit('getList')
          this.$emit('getTabs')
          return this.modalClose()
        })
      }
    }
  }
</script>

<style lang="scss">
  .goodsInfo {
    text-align: center;
  }

  .select-store {
    margin-top: 20px;
    margin-bottom: -30px;
    text-align: center;

    .el-select .el-input, .el-input-number {
      width: 260px;
    }
  }

  .select-sell-desc {
    padding: 20px 0 0;
    text-align: center;
  }
</style>
