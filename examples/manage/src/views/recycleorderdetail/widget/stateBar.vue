<template lang="html">
    <section class="state-box">
      <div class="state-icons-box flex-common">
        <template v-for="(i, k) in process" >
          <span v-if="k > 0" :class="i['state'] == 1 ? 'point-active point' : 'point'"></span>
          <img :src="getPic(i)" alt="">
        </template>
      </div>
      <div class="flex-common">
        <template v-for="(i, k) in process" >
          <span v-if="k > 0" class="point point-no-color"></span>
          <span class="item-desc state-desc">{{i['name']}}</span>
        </template>
      </div>
      <div class="flex-common">
        <template v-for="(i, k) in process">
          <span v-if="k > 0" class="point point-no-color"></span>
          <span class="item-desc done-time">{{i['date']}}</span>
        </template>
      </div>
    </section>
</template>

<script>
export default {
  props: {
    process: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getPic (i) {
      const pic = i['state'] == 1 ? i['iconActive'] : i['icon']
      return `https://pic3.zhuanstatic.com/zhuanzh/${pic}`
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.state-box{
  padding: 10px 0;
}
.flex-common {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 70px;
  text-align: center;
}
.state-icons-box{
  li{
    display: inline-block;
    width: 20%
  }
  img{
    display: inline-block;
    width: 80px;
    height: 80px;
  }
}
.point{
  display: inline-block;
  width: 100px;
  border-bottom: 1px dashed #D8D8D8;
  height: 0;
  vertical-align: middle;
  &.point-active{
    border-bottom: 1px dashed #FF962F;
  }
  &.point-no-color {
    border-color:transparent;
  }
}
.item-desc{
  font-size: 14px;
  color: #6D6F73;
}
.state-desc{
  padding: 8px 0;
}
.done-time {
  display: inline-block;
  min-width: 180px;
}
</style>
