<template lang="html">
    <section class="state-box">
      <div class="state-icons-box flex-common">
        <template v-for="(i, k) in pro" >
          <span v-if="k > 0" :class="i['isDone'] ? 'point-active point' : 'point'"></span>
          <img :src="i['isDone'] ? i['finishSrc'] : i['src']" alt="">
        </template>
      </div>
      <div class="flex-common">
        <template v-for="(i, k) in pro" >
          <span v-if="k > 0" class="point point-no-color"></span>
          <span class="item-desc state-desc">{{i['name']}}</span>
        </template>
      </div>
      <div class="flex-common">
        <template v-for="(i, k) in pro" >
          <span v-if="k > 0" class="point point-no-color"></span>
          <span class="item-desc done-time">{{i['doneTime']}}</span>
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
  data () {
    return {
      icons: {
        createOrder: '2',
        pay: '3',
        sendGoods: '4',
        success: '10',
        backGoods: '6',
        backSuccess: '11',
        closed: '12',
      },
      statusList: {
        '1':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/createOrder-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/createOrder.png')
        },
        '2':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/pay-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/pay.png')
        },
        '3':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/sendGoods-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/sendGoods.png')
        },
        '4':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/backGoods-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/backGoods.png')
        },
        '5':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/success-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/success.png')
        },
        '12':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/close-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/close.png')
        },
        '7':{
          "finishSrc": require('../../../assets/img/wholesaleorderdetail/backSuccess-active.png'),
          "src": require('../../../assets/img/wholesaleorderdetail/backSuccess.png')
        }
      }
    }
  },
  computed: {
    pro () {
      let a = []
      this.process.map(item => {
        let cur = item
        const { code } = cur
        Object.assign(cur, this.statusList[code])
        a.push(cur)
      })
      return a
    }
  }
}
</script>

<style lang="scss" scoped>
.state-box{
  padding: 40px 0;
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
