<template>
  <div>
    <el-table
            v-loading="isLoading"
            :data="listData"
            :border="true"
            :row-class-name="rowClassNameFn"
            @selection-change="handleSelectionChange"
            @expand-change="handleExpand"
            @cell-mouse-leave="mouseLeave"
            @cell-mouse-enter="mouseEnter"
            v-bind="$props">
      <slot name="expand"></slot>
      <el-table-column v-if="selection"
                       type="selection"
                       :selectable="selectFn"
                       width="55"></el-table-column>
      <template v-for="(item, i) of listProps">
        <!-- 存在 slot字段 那么未自定义表头区域 -->
        <el-table-column
           :fixed="item.fix || false"
           :key="item.prop"
           :prop="item.prop"
           :label="item.label"
           :width="item.width"
           :sortable="item.sortable"
           :formatter="item.formatter" v-if="item.slot">
         <template slot="header" slot-scope="scope">
            <slot :name="item.prop">
            </slot>
         </template>
       </el-table-column>
       <!-- 否则 未非自定义表头 -->
        <el-table-column
          :fixed="item.fix || false" 
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          :formatter="item.formatter"
          v-else>
        </el-table-column>
      </template>
      <el-table-column v-for="(item, i) of listOPs" :key="item.label + i" :label="item.label" :width="item.width">
        <template slot-scope="scope">
          <slot :name="item.name" :rowData="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
            v-if="pageData && total > 1"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageData.sizes"
            :page-size="pageData.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: [
    'listData',
    'listProps',
    'listOPs',
    'pageData',
    'total',
    'rowClassNameFn',
    'selection',
    'selectFn',
    'size',
    'isLoading'
  ],
  computed: {
    currentPage() {
      return this.pageData.page || 1
    }
  }, 
  methods: {
    handleSelectionChange(val) {
      this.$emit('onSelect', val)
    },
    handleSizeChange(size) {
      this.$emit('onSize', size)
    },
    handleCurrentChange(current) {
      this.$emit('onCurrent', current)
    },
    handleExpand() {
      this.$emit('onExpand', arguments)
    },
    mouseEnter () {
      this.$emit('mouseEnter', arguments)
    },
    mouseLeave () {
      this.$emit('mouseLeave', arguments)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.el-table .red-row {
  background: rgba(255, 86, 71, 0.25);
}
</style>
