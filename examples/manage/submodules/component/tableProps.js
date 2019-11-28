let props = {
  type: String,
  border: {
    type: Boolean,
    default: true
  },
  columns: {
    type: Array,
    required: true
  },
  // tableData: {
  //   type: Array,
  //   required: true
  // },
  showPagination: {
    type: Boolean,
    default: true
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  paginationPageSizes: {
    type: Array,
    default: () => {
      return [10, 20, 30, 40, 50]
    }
  },
  apiName: String
}

export default props
