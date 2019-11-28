<template>
  <div>
    <el-table
      v-loading.lock="loading"
      style="width: 100%"
      ref="table"
      :data="tableData"
      :border="border"
      @select="(selection, row) => emitEventHandler('select', selection, row)"
      @select-all="selection => emitEventHandler('selection-all', selection)"
      @seletion-change="selection => emitEventHandler('selection-change', selection)"
    >
      <slot name="prepend" />
      <el-table-column
        v-if="type != undefined"
        :type="type"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        :column-key="column.columnKey"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
        width="column.minWidth ? '-' : (column.width || 140)"
        :render-header="column.renderHeader"
      >
        <template slot-scope="scope">
          <slot v-if="column.soltName" :row="scope.row" :name="column.soltName"></slot>
          <span v-else-if="column.render">
            {{ column.render(scope.row) }}
          </span>
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="showPagination"
      style="margin-top: 10px;float: right;"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="total"
        :layout="paginationLayout"
        :page-sizes="paginationPageSizes"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
      ></el-pagination>
    </div>
  </div>
    
</template>
<script>
import props from './tableProps'
export default {
  name: 'zz-table',
  props,
  data () {
    const _this = this;
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: (() => {
          const { paginationPageSizes } = _this;
          if (paginationPageSizes.length > 0) {
            return paginationPageSizes[0]
          }
          return 10
        })()
      },
      total: 0,
      tableData: []
    }
  },
  created () {
    this.fetchHandler();
  },
  methods: {
    emitEventHandler (event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
      this.fetchData();
    },
    handleSizeChange (size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    fetchHandler () {
      let { apiName } = this; 
      if (apiName) {
        this.fetchData();
      } else {
        throw new Error('无请求的接口路径！');
      }
    },
    fetchData () {
      this.loading = true;
      let params = {};
      let { apiName, showPagination, pagination } = this; 
      const { currentPage, pageSize } = pagination;
      if (showPagination) {
        params = Object.assign({}, {
          pageNum: currentPage,
          pageSize
        });
      }
      this.$http.get(apiName, params).then(res => {
        const { code, msg, rows, data } = res;
        if (code == 0) {
            this.tableData = data;
            this.total = rows;
        } else {
          throw new Error(`接口请求出错：${msg}`);
        }
        this.loading = false;
      });
    }
  }
}
</script>
