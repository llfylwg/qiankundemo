<template lang="html">
  <el-dialog title="设置b2b等级" :visible.sync="dialogFormVisible" width="70%" :before-close="modalClose">
    <el-form>
      <el-form-item label="设置b2b等级">
        <el-select v-model="value" placeholder="请选择" @change="$emit('change', value)">
          <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template v-if="curOpt">
      <div class="desc">
        {{curOpt.name}}级：{{curOpt.desc}}
      </div>
      <div class="pics">
        <div class="pic" v-for="pic in curOpt.imageUrl">
          <el-avatar shape="square" :size="160" fit="cover" :src="pic"></el-avatar>
        </div>
      </div>
    </template>
    <div class="tips text-red">特别说明：b2b等级设置后无法变更，请根据质检的实际情况选择对应等级，若因等级不符出现售后问题需进行无理由赔付</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modalClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['list', 'productId'],
  data () {
    return {
      dialogFormVisible: true,
      value: ''
    }
  },
  created () {
  },
  computed: {
    curOpt () {
      return this.list.find(item => item.id === this.value) || this.list[0]
    }
  },
  methods: {
    submit () {
      if (!this.value) {
        return this.$message.error('请选择一个等级')
      }
      this.$confirm('b2b等级设置后将无法变更，确认设置吗？')
        .then(() => {
          this.$http.post('bizProduct/b2bGrade', {
            b2bGradeId: this.value,
            productId: this.productId
          }).then(res => {
            this.$message.success('设置成功')
            this.$emit('getList')
            this.modalClose()
          })
        })
    },
    modalClose () {
      this.$emit('modalClose')
    }
  }
}
</script>

<style lang="scss" scoped>
  .desc {
    margin-bottom: 10px;
  }
  .text-red {
    color: #ff5555;
  }
  .pics {
    .pic {
      display: inline-block;
      margin-right: 24px;
    }
  }
</style>
