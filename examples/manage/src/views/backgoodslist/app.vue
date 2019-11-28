<template lang="html">
  <div class="sendshiplist-wrap">
    <div class="head-box">
      <h-filter @search="setFilter"></h-filter>
    </div>
    <div class="table-box">
      <h-table
        :listData="listData"
        :listProps="listProps"
        :pageData="pageData"
        :total="total"
        :listOPs="listOPs"
        size="mini"
        @onSize="handleSizeChange"
        @onCurrent="handleCurrentChange">
        <template slot="operations" slot-scope="scope">
          <span class="edit" @click="handleClickToDetail(scope.rowData.returnPkgId)">退货详情</span>
        </template>
      </h-table>
    </div>
  </div>
</template>

<script>
  import hFilter from '../../components/page/backgoodslist/filter'
  import mixin from '../../components/tableMixin.js'
  import hTable from 'sub/component/Table'
  export default {
    components: {
      hTable,
      hFilter
    },
    mixins: [mixin],
    data () {
      return {
        listProps:  [
          {
            prop: 'expressNum',
            label: '退货物流单号'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'productCount',
            label: '数量'
          },
          {
            prop: 'statusDes',
            label: '退货状态'
          }
        ],
        listOPs: [
          {
            label: '操作',
            name: 'operations'
          }
        ],
        listApiName: 'bizReturnPkg/list'
      }
    },
    created () {
      // this.cancelOrder()
    },
    methods: {
      handleClickToDetail (id) {
        this.$router.push({
          name: 'backgoodsdetail',
          query: {id}
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.sendshiplist-wrap{
  width: 100%;
  box-sizing: border-box;
  background: #F8F8F8;
}
.head-box{
  padding: 20px 24px 0;
  box-sizing: border-box;
  background: #FFF;
}
.table-box{
  background: #FFF;
  margin: 16px 16px 0;
  padding: 24px 32px 18px;
  // height: 100vh;
}
  .split-line {
    line-height: 1px;
    height: 1px;
    margin: 10px 0;
    border-bottom:0.1rem solid rgba(221,221,221,0.8);
  }
  .link {
    color: #409EFF;
  }
</style>
