<template lang="html">
  <span>{{ time }}</span>
</template>

<script>
import { countTime } from '../../../assets/js/helper.js'
export default {
  props: ['optData'],
  data () {
    return {
      time: '',
      timer: ''
    }
  },
  created () {
    window.clearInterval(this.timer)
    var t = this.optData.refundCountDown;
    this.timer = window.setInterval(() => {
      if (t <= 0) {
        clearInterval(this.timer);
        this.time = '00天00时00分00秒'
      }
      this.time = countTime(t--);
    }, 1000);
  }
}
</script>

<style lang="css">
</style>
