<template>
  <el-select
    v-bind='$props'
    v-model='seleted'
    >
    <el-option
      v-for='item in options'
      :key='item.value'
      :label='item.label'
      :value='item.value'>
    </el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui'
  export default {
    name: 'select-remote',
    props: {
      ...Select.props, // 继承、并覆盖默认配置
      clearable: { type: Boolean, default: () => true },
      filterable: { type: Boolean, default: () => true },
      dataMap: { type: Object, default: () => {}},
      list: { type: Array, default: [] }
    },
    computed: {
      // 复用 v-model 的语法糖 :value + @input => $emit('input', $event.target.value), // 利用『计算属性 + 双向绑定』支持『默认值和数据向上传递』
      // 参考 https://cn.vuejs.org/v2/guide/components.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-v-model
      // 参考 https://vuex.vuejs.org/zh/guide/forms.html#%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A%E7%9A%84%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7
      seleted: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      options() {
        return this.mapData(this.list)
      }
    },
    methods: {
      mapData (data) {
        const { dataMap } = this
        return data.map(v => {
          let ret = v
          if (dataMap.label) ret.label = v[dataMap.label]
          if (dataMap.value) ret.value = v[dataMap.value]
          return ret
        })
      }
    }
  }
</script>
