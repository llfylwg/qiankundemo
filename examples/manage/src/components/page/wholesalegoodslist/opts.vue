<template lang="html">
  <div class="">
    <p class="opt-box" >
      <span @click="handleClickToDetail(optData, i)" size="mini" class="edit"  v-for="(i, k) in opts" v-if="optData['operations'] && optData['operations'].indexOf(i['code']) > -1" :key="k">{{i['name']}}
      </span>
    </p>
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
    },
    tabCode: {
      type: [Number, String, null],
      default: null
    }
  },
  data () {
    return {
      opts: [
        {
          code: 'detail',
          name: '详情'
        },
        {
          name: '下架',
          code: 'down'
        },
        {
          name: '上架',
          code: 'up'
        },
        {
          name: '编辑商品',
          code: 'edit'
        }
      ]
    }
  },
  methods: {
    handleClickToDetail (...arg) {
      this.$emit('handleClickToDetail', ...arg)
    }
  }
}
</script>

<style lang="css">
</style>
