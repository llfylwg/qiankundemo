export const allData = [
  {
    fix: 'left',
    prop: 'date',
    label: '日期',
  },
  {
    fix: 'left',
    prop: 'sellerName',
    label: '店长名称',
  },
  {
    fix: 'left',
    prop: 'shopName',
    label: '门店名称',
  },
  {
    prop: 'shortcutOrderCount',
    label: '快捷下单数',
  },
  {
    prop: 'allOrderCount',
    label: '下单数',
  },
  {
    prop: 'firstPriceCount',
    label: '一次报价数',
  },
  {
    prop: 'deliverCount',
    label: '发货数',
  },
  {
    prop: 'receiptCount',
    label: '收货数',
  },
  {
    prop: 'secondPriceCount',
    label: '二次报价数',
  },
  {
    prop: 'recycleDealOrderCount',
    label: '回收数',
  },
  {
    prop: 'refundOrderCount',
    label: '退货数',
  },
  {
    prop: 'recycleDealOrderGMV',
    label: '回收GMV',
  },
  {
    prop: 'recycleOrderUnitPrice',
    label: '回收单价',
  },
  {
    prop: 'secondPriceRate',
    label: '二次报价率',
    slot: true,
  },
  {
    prop: 'refundRate',
    label: '退货率',
    slot: true,
  },
];
export const allOpts = [
  // {
  //   label: '回收价格',
  //   name: 'price'
  // },
  // {
  //   label: '操作',
  //   name: 'opts'
  // }
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
