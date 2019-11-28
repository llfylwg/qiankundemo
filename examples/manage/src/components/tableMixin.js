import { paramsObjToStr } from 'sub/lib/utils';
export default {
  data() {
    return {
      listApiName: '',
      listData: [],
      total: 0,
      isLoading: false,
      filter: {
        pageNum: 1,
        pageSize: 10,
      },
      pageData: {
        size: 10,
        page: 1,
      },
    };
  },
  mounted() {
    // console.log('---------mounted', this.filter);
    Object.assign(this.filter, this.$route.query);
    this.pageData.size = +this.filter.pageSize;
    this.pageData.page = +this.filter.pageNum;
    this.getList();
  },
  methods: {
    setFilter(data) {
      // console.log('---------setFilter', this.filter);
      this.pageData.page = 1;
      Object.assign(this.filter, data);
      this.getList();
    },
    handleSizeChange(size) {
      this.pageData.size = size;
      this.getList();
    },
    handleCurrentChange(page) {
      this.pageData.page = page;
      this.getList();
    },
    changeUrl() {
      window.history.replaceState(null, null, `${location.origin}${location.pathname}?${paramsObjToStr(this.filter)}`);
    },
    getList() {
      this.listData = [];
      this.filter.pageNum = this.pageData.page;
      this.filter.pageSize = this.pageData.size;
      this.changeUrl();
      let a = this.listApiName;
      this.isLoading = true;
      this.$http.get(this.listApiName, this.filter).then(res => {
        if (a === this.listApiName) {
          // 这个判断需要优化
          this.listData = res.data;
          this.total = res.rows;
          this.isLoading = false;
        } else {
          console.log('已经不是当前页面请求了');
        }
      });
    },
  },
};
