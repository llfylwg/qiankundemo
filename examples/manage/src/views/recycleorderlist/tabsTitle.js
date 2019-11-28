export const allData = [
  {
    prop: 'orderId',
    label: '回收单ID',
  },
  {
    prop: 'qcCode',
    label: '质检码',
  },
  {
    prop: 'category',
    label: '分类',
  },
  {
    prop: 'brand',
    label: '品牌',
  },
  {
    prop: 'goodsInfo',
    label: '商品信息',
  },
  {
    prop: 'statusDesc',
    label: '状态',
  },
  {
    prop: 'sellerName',
    label: '店长名称',
  },
  {
    prop: 'storeName',
    label: '门店名称',
  },
  {
    prop: 'agentName',
    label: '对接人',
  },
  {
    prop: 'createTime',
    label: '回收单创建时间',
  },
];
export const allOpts = [
  {
    label: '回收价格',
    name: 'price',
  },
  {
    label: '操作',
    name: 'opts',
  },
];
export const orderType = [
  {
    code: 0,
    desc: '全部',
    operation: ['detail'],
  },
  {
    code: 1,
    desc: '待报价',
    operation: ['setprice', 'detail'],
  },
  {
    code: 2,
    desc: '待门店确认',
    operation: ['detail'],
  },
  {
    code: 3,
    desc: '待确认',
    operation: ['confirm', 'changeprice', 'detail'],
  },
  {
    code: 4,
    desc: '待门店二次确认',
    operation: ['detail'],
  },
  {
    code: 5,
    desc: '待付款',
    operation: ['paymoney', 'detail'],
  },
];
