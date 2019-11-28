<template>
  <div class="balance">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    created () {
      document.title = '账户余额'
    }
  }
</script>
<style lang="scss" scoped>
  .balance {
    width: 100%;
    min-height: 100%;
    background: #F9FAFA;
  }
</style>
