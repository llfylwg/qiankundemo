<template lang="html">
  <span>{{time}}</span>
</template>

<script>
import { formatSeconds } from '../../../assets/js/helper.js'
export default {
  props: ['timeRemaining'],
  data () {
    return {
      time: '',
      timer: ''
    }
  },
  created () {
    // 议价列表是走秒的  需要走定时器  计算判断
    window.clearInterval(this.timer)
    var t = this.timeRemaining
    this.timer = window.setInterval(() => {
        t -= 1
        this.time = formatSeconds(t)
        if (t <= 0) {
          window.clearInterval(this.timer)
          return this.$emit('getList')
        }
    }, 1000)
  }
}
</script>

<style lang="css">
</style>
