<template>
  <el-radio-group v-model="itemValue" size="small" @change="update">
    <template v-for="item in list">
      <el-radio :label="String(item.id)" :key="item.id" border>
        {{item.name}}
      </el-radio>
      <div
        v-if="showRemark(item)"
        class="qc-items-remark"
        :key="'remark'+ item.id">
        <el-input v-model="remark[item.id]" placeholder="请输入备注信息" @input="update"></el-input>
      </div>
    </template>
  </el-radio-group>
</template>
<script>
/**
 * 接口需要的数据格式提交和获取: { itemId: "1120101", result: [{ itemValue: "1120101001", remark: "" }] }
 * 
 */
export default {
  model: {
    prop: 'item',
    event: 'change'
  },
  props: ['list', 'item'],
  data: () => ({
    itemValue: '',
    remark: {}
  }),
  watch: {
    item: {
      handler (val) {
        this.setDefault()
      },
      immediate: true
    }
  },
  methods: {
    noop(e) {
      console.log('noop', e)
    },
    showRemark (item) {
      return item.remarkType && this.itemValue === item.id
    },
    setDefault () {
      if (!this.item) return
      this.itemValue = this.item.map(cur => cur.itemValue).join('')
      this.item.forEach(cur => {
        const { itemValue, remark } = cur
        this.remark[itemValue] = remark
      })
    },
    update () {
      const res = []
      res.push({
        itemValue: this.itemValue,
        remark: this.remark[this.itemValue] || ''
      })
      this.$emit('change', res)
    }
  } 
}
</script>
