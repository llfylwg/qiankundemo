<template>
  <el-select v-model="value" filterable placeholder="请选择">
    <el-option label="全部" value=""></el-option>
    <el-option
      v-for="item in items"
      :key="item.cateId"
      :label="item.name"
      :value="item.cateId">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: ['items', 'cur', 'selectId'],
  watch: {
    selectId(nVal, oVal) {
      if (nVal != oVal) {
        this.value = nVal
      }
    },
    value(nVal, oVal) {
      if (nVal != oVal) {
        this.handleChange(nVal)
      }
    }
  },
  created() {
    this.value = this.selectId || ''
    this.value && this.handleChange(this.value)
  },
  data() {
    return {
      value: this.selectId
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('change', { cur: this.cur + 1, pId: val, cId: '' })
    }
  }
}
</script>
