<template lang="html">
  <div>
    <span class="name">{{optData['buyerNickName']}}</span>
    <div class="icon" @click="goChatPage"></div>
    <div>{{optData.buyerUid}}</div>
  </div>
</template>

<script>
export default {
  props: {
    optData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    goChatPage () {
      const { buyerUid } = this.optData;
      const url = 'https://chat.zhuanzhuan.com/#/im/trade?contactUid=';
      window.open(`${url}${buyerUid}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.name {
  vertical-align: middle;
  margin-right: 6px;
}
.icon {
  vertical-align: middle;
  width: 18px;
  height: 15px;
  display: inline-block;
  background-image: url('../../../assets/img/message.png');
  background-size: cover;
}
</style>
