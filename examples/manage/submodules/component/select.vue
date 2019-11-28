<template>
  <el-select :value="currentValue" v-bind="$props" @change="handleChange">
    <el-option
      v-for="item in list"
      :key="item.name"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: [
    'disabled',
    'list',
    'value',
    'formKey',
    'placeholder',
    'reset',
    'defaultValue',
    'multiple'
  ],
  data: () => ({
    currentValue: ''
  }),
  watch: {
    // 联动清除后面下拉框数据
    reset() {
      this.setCurrentValue('')
      // this.currentValue = ''
    },
    // defaultValue: {
    //   handler (val) {
    //     this.currentValue = val
    //     this.handleChange(val)
    //   },
    //   immediate: true
    // },
    value: {
      handler(val) {
        this.setCurrentValue(val)
      },
      immediate: true
    }
  },
  methods: {
    handleChange(val) {
      const obj = {}
      obj[this.formKey] = val
      this.$emit('change', obj)
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return
      this.currentValue = value
      this.handleChange(value)
    }
  }
}
</script>
