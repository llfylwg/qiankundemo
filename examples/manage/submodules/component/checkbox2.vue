<template>
  <el-checkbox-group v-model="itemValue" size="small" @change="update">
    <span v-for="item in list" :key="item.id">
      <el-checkbox
        border
        :label="String(item.id)">
        {{item.name}}
      </el-checkbox>
      <div
        v-if="showRemark(item)"
        class="page-zj-qc-items-remark">
        <el-input v-model="remark[item.id]" placeholder="请输入备注信息" @input="update"></el-input>
      </div>
    </span>
  </el-checkbox-group>
</template>
<script>
/**
 * 接口需要的数据格式提交和获取: { itemId: "1120101", result: [{ itemValue: "1120101001", remark: "" }] }
 * 
 * 
 */
export default {
  model: {
    prop: 'item',
    event: 'change'
  },
  props: ['list', 'item'],
  data: () => ({
    itemValue: [],
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
    showRemark (item) {
      return item.remarkType && this.itemValue.includes(item.id)
    },
    setDefault () {
      if (!this.item) return
      this.itemValue = this.item.map(cur => cur.itemValue)
      this.item.forEach(cur => {
        const { itemValue, remark } = cur
        this.remark[itemValue] = remark
      })
    },
    update () {
      const res = this.itemValue.map(cur => {
        return {
          itemValue: cur,
          remark: this.remark[cur] || ''
        }
      })
      this.$emit('change', res)
    }
  } 
}
</script>
