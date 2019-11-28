export default {
  computed: {
    /**
     * 成交订单
     * @returns {boolean}
     */
    dealStatus() {
      return [80, 81].indexOf(this.code) > -1;
    },
    /**
     * 二次报价输入框等
     * @returns {boolean}
     */
    showSecondConfirmPriceBtn() {
      // return [65].indexOf(this.code) > -1
      return this.operations.indexOf('secondOffer') > -1;
    },
    showConfirmPriceBtn() {
      // firstOffer首次报价
      // return [10].indexOf(this.code) > -1
      return this.operations.indexOf('firstOffer') > -1;
    },
    showConfirmRecycleBtn() {
      //  确认购买
      // return this.code === 65 && this.orderSource === 4
      return this.operations.includes('confirmBuying');
    },
    options() {
      return {
        qcReceipt: {
          btnName: '去收货',
          handler: () => {
            window.open('https://youpinoffice.zhuanzhuan.com/qc/receive');
          },
        },
        qcCheck: {
          btnName: '去质检',
          handler: () => {
            window.open('https://youpinoffice.zhuanzhuan.com/qc/zj');
          },
        },
        pay: {
          btnName: '打款',
          handler: () => {
            this.showModal('payMoneyVisible');
          },
        },
        confirmBuying: {
          btnName: '确认回收',
          handler: () => {
            this.showModal('confirmRecycleVisible');
          },
        },
        receipt: {
          btnName: '确认收货',
          handler: () => {
            this.receiveGoods();
          },
        },
      };
    },
  },
};
