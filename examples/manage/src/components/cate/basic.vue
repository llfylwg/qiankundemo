<template>
  <div class="basic-cate">
    <div class="basic-cate-box" v-for="(opt, cur) in options" :key="cur">
      <el-select v-if="opt"
        filterable placeholder="请选择"
        v-model="selects[cur]"
        @change="changeCate({cur: cur + 1, pId: selects[cur]})">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in opt"
          :key="item.cateId"
          :label="item.name"
          :value="item.cateId">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['selectCates'],
    data () {
      return {
        selects: [],
        options: []
      }
    },
    watch: {
      selectCates (n, o) {
        if (!n || !n.length) {
          this.selects = []
          this.options = this.options.splice(0, 1)
        }
        n.forEach((value, index) => {
          this.selects[index] = value.cateId
          this.getCate({cur: index + 1, pId: value.cateId})
        })
      }
    },
    mounted () {
      this.getCate({cur: 0, pId: '0'})
      if (this.selectCates && this.selectCates.length) {
        this.selectCates.forEach((value, index) => {
          if (value.cateId) {
            this.selects[index] = value.cateId
            this.getCate({cur: index + 1, pId: value.cateId})
          }
        })
      }
    },
    methods: {
      getBasicCateAction (pId) {
        return this.$http.get('/api/option/list/ypgoods/getCate', {parentCateId: pId}).then(res => {
          return res.data
        })
      },
      changeCate ({cur, pId}) {
        if (!pId) {
          // 选择全部的时候
          this.options = this.sliceItem(this.options, cur)
          this.selects = this.sliceItem(this.selects, cur)
          this.change()
        } else {
          this.getCate({cur, pId})
        }
      },
      getCate ({cur, pId}) {
        let { options } = this
        const len = options.length
        if (cur < len - 1) {
          options = this.sliceItem(options, cur)
          this.selects = this.sliceItem(this.selects, cur)
        }
        this.getBasicCateAction(pId).then(({ cateList }) => {
          if (cateList && cateList.length) { // $set 因有并发异步问题
            this.$set(options, cur, cateList)
            this.options = options
            this.change()
          } else {
            this.options = options
            this.change(true)
          }
        })
      },
      sliceItem (item, cur) {
        return item.slice(0, cur)
      },
      change (isLast) { // 过滤空数据
        this.$emit('filter', this.selects.filter(s => s), isLast)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .basic-cate {
    display: flex;
    &-box {
      margin-right: 20px;
    }
  }
</style>
