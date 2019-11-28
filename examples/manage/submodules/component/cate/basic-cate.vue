<template>
  <div class="basic-cate">
    <div class="basic-cate-box" v-for="(opt,num) in options" :key="num">
      <cate :items="opt && opt.items" :selectId="opt && opt.selectId" :cur="num" @change="getCates"></cate>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import cate from './cate.vue'
export default {
  props: ['selectCates'],
  data() {
    return {
      options: []
    }
  },
  watch: {
    selectCates(n, o) {
      let flag = false
      let items = JSON.parse(JSON.stringify(this.options))
      items = items.filter(item => item.selectId)
      flag =
        !items.length ||
        items.some((p, i) => {
          return n[i].cateId != p.selectId
        })
      if (flag && JSON.stringify(n) !== JSON.stringify(o)) {
        this.getCates({ cur: 0, pId: '0', cId: '' })
      }
    }
  },
  mounted() {
    this.selectCates && this.selectCates.length
      ? this.getCates({ cur: 0, pId: '0', cId: '' })
      : this.getCate('0')
  },
  methods: {
    getCid(cur, pId) {
      const selectPid =
        (this.selectCates &&
          this.selectCates[cur] &&
          this.selectCates[cur].parentId) ||
        ''
      const selectCid =
        (this.selectCates &&
          this.selectCates[cur] &&
          this.selectCates[cur].cateId) ||
        ''
      return pId === selectPid ? selectCid : ''
    },
    getCate(pId) {
      this.$store.dispatch('getBasicCateAction', pId).then(res => {
        Vue.set(this.options, 0, { items: res.cateList, selectId: '' })
      })
    },
    getCates({ cur, pId, cId }) {
      const last = cur > 0 ? cur - 1 : 0
      this.options && this.options[last] && (this.options[last].selectId = pId)
      if (!pId) {
        // 选择全部的时候
        const len = this.options.length
        this.options.splice(cur, len - cur + 1)
        this.change()
        return
      }
      if (this.options[cur] && this.options[cur].items && cur == 0) {
        this.setOptions(this.options[cur].items, { cur, pId, cId })
      } else {
        this.$store.dispatch('getBasicCateAction', pId).then(res => {
          this.setOptions(res.cateList, { cur, pId, cId })
        })
      }
    },
    setOptions(cateList, { cur, pId, cId }) {
      if (cateList && cateList.length) {
        cId = this.getCid(cur, pId)
        Vue.set(this.options, cur, { items: cateList, selectId: cId })
        this.options[cur].selectId = cId
        const len = this.options.length
        this.options.splice(cur + 1, len - cur - 1)
      } else {
        const len = this.options.length
        this.options.splice(cur, len - cur + 1)
      }
      this.change()
    },
    getSelectIds() {
      let arr = []
      this.options.map(p => {
        p.selectId && arr.push(p.selectId)
      })
      return arr
    },
    change() {
      const selectIds = this.getSelectIds()
      this.$emit('filter', selectIds)
    }
  },
  components: {
    cate
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.basic-cate {
  display: flex;
  &-box {
    margin-right: 20px;
  }
}
</style>
