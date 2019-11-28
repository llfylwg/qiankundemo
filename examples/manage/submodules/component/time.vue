<template>
  <el-form-item :label="label">
    <el-col :span="11">
      <el-form-item>
        <el-date-picker value-format="yyyy-MM-dd"
                        @change="setBegData"
                        type="date" placeholder="选择开始日期"
                        v-model="form.addTimeStart" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="1">~</el-col>
    <el-col :span="11">
      <el-form-item>
        <el-date-picker value-format="yyyy-MM-dd"
                        @change="setEndData"
                        type="date" placeholder="选择结束日期"
                        v-model="form.addTimeEnd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-form-item>
</template>
<script>
  export default {
    // TODO: 使用 daterange
    props: {
      label: {
        default: '创建时间'
      },
      addTimeStart: String,
      addTimeEnd: String
    },
    data () {
      return {
        form: {
          addTimeStart: '',
          addTimeEnd: ''
        }
      }
    },
    watch: {
      addTimeStart (newVal) {
        this.form.addTimeStart = newVal
      },
      addTimeEnd (newVal) {
        this.form.addTimeEnd = newVal
      }
    },
    methods: {
      setBegData (data) {
        this.form.addTimeStart = data
        this.setDate('addTimeStart', '00:00:00')
        this.emit()
      },
      setEndData (data) {
        this.form.addTimeEnd = data
        this.setDate('addTimeEnd', '23:59:59')
        this.emit()
      },
      setDate (name, value) {
        const time = this.form[name]
        this.form[name] = time ? time +` ${value}` : ''
      },
      emit () {
        this.$emit('filter', this.form)
      }
    }
  }
</script>

