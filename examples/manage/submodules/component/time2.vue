<template>
  <el-date-picker
    v-model="value"
    type="daterange"
    :start-placeholder="timePlaceHolder['start']"
    :end-placeholder="timePlaceHolder['end']"
    value-format="yyyy-MM-dd HH:mm:ss"
    :default-time="['00:00:00', '23:59:59']"
    @change="change"
    :picker-options="pickerOptions"
  >
  </el-date-picker>
</template>
<script>
  export default {
    props: {
      select: [String, Array],
      pickerOptions: {
        type: Object,
        default: () => ({})
      },
      timePlaceHolder: {
        type: Object,
        default: () => {
          return {
            start: '开始日期',
            end: '结束日期'
          }
        }
      }
    },
    data () {
      return {
        value: []
      }
    },
    watch: {
      select (nVal, o) {
        this.value = nVal
      }
    },
    created () {
      if (this.select) {
        this.value = this.select
      }
    },
    methods: {
      change (data) {
        this.$emit('filter', {
          addTimeStart: data ? data[0] : '',
          addTimeEnd: data ? data[1] : ''
        })
      }
    }
  }
</script>
