import Vue from 'vue';
import Router from 'vue-router';
import Layout from './components/Layout/index';
// 首页
import Index from './views/index/app';
// 普通-创建商品
import sendShip from './views/sendship/app';
// 普通-发货列表
import sendShipList from './views/sendshiplist/app';
// 普通-商品列表
import goodsList from './views/goodslist/app';
// 普通-商品详情
import goodsDetail from './views/goodsdetail/app';
// 普通-退货列表
import backGoodsList from './views/backgoodslist/app';
// 普通-退货详情
import backGoodsDetail from './views/backgoodsdetail/app';
// 批量发布（闪回收）
import batchPublish from './views/batchpublish/app';
// 批发-发布
import wholesalepublish from './views/wholesalepublish/app';
// 批发-商品列表
import wholesaleGoodsList from './views/wholesalegoodslist/app';
// 批发-订单列表
import wholesaleOrderList from './views/wholesaleorderlist/app';
// 批发-退货列表
import wholesaleBackList from './views/wholesalebacklist/app';
// 批发-商品详情
import wholesalegoodsdetail from './views/wholesalegoodsdetail/app';
// 批发-订单详情
import wholesaleorderdetail from './views/wholesaleorderdetail/app';
// 批发-退货详情
import wholesalebackdetail from './views/wholesalebackdetail/app';
// 批发-商品快照
import wholesalegoodssnapshot from './views/wholesalegoodssnapshot/app';

// 批发-商品生成报价单
import productPriceListImage from './views/productPriceListImage/app';
// 门店列表管理
import stallList from './views/stalllist/app';
// 门店数据展示
import stallReport from './views/stallreport/app';

//合伙人
import partner from './views/partner/app';
//合伙人申请
import partnerApply from './views/partnerApplyList/app';
//合伙人授权金管理
import account from './views/account/app';
//合伙人授权金管理
import accountBalanceDetail from './views/account/balanceDetail';

// 回收订单管理
import recycleOrderList from './views/recycleorderlist/app';
// 回收订单详情
import recycleOrderDetail from './views/recycleorderdetail/app';
// 回收报价单管理
import recyclePriceList from './views/recyclePriceListManagement/app.vue';
// 回收订单核心数据
import recycleCoreData from './views/recyclecoredata/app.vue';
// 回收退货管理
import recycleReturnManager from './views/recyclereturnmanager/app.vue';
import recycleSetting from './views/recyclesetting/app.vue';
import view_404 from './views/404/404';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/bm-manage',
  routes: [
    {
      path: '/',
      redirect: '/index',
      name: 'home',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'index',
          component: Index,
        },
        {
          path: 'sendShip',
          name: 'sendShip',
          component: sendShip,
        },
        {
          path: 'sendShipList',
          name: 'sendShipList',
          component: sendShipList,
        },
        {
          path: 'goodsList',
          name: 'goodsList',
          component: goodsList,
        },
        {
          path: 'goodsDetail',
          name: 'goodsDetail',
          component: goodsDetail,
        },
        {
          path: 'backgoodslist',
          name: 'backgoodslist',
          component: backGoodsList,
        },
        {
          path: 'backgoodsdetail',
          name: 'backgoodsdetail',
          component: backGoodsDetail,
        },
        {
          path: 'batchpublish',
          name: 'batchpublish',
          component: batchPublish,
        },
        {
          path: 'wholesalepublish',
          name: 'wholesalepublish',
          component: wholesalepublish,
        },
        {
          path: 'wholesalegoodslist',
          name: 'wholesalegoodslist',
          component: wholesaleGoodsList,
        },
        {
          path: 'wholesaleorderlist',
          name: 'wholesaleorderlist',
          component: wholesaleOrderList,
        },
        {
          path: 'wholesalebacklist',
          name: 'wholesalebacklist',
          component: wholesaleBackList,
        },
        {
          path: 'wholesalesamplepic',
          name: 'wholesalesamplepic',
          component: () => import('./views/wholesalesample/app'),
        },
        {
          path: 'wholesalegoodsdetail',
          name: 'wholesalegoodsdetail',
          component: wholesalegoodsdetail,
        },
        {
          path: 'wholesalegoodssnapshot',
          name: 'wholesalegoodssnapshot',
          component: wholesalegoodssnapshot,
        },
        {
          path: 'wholesaleorderdetail',
          name: 'wholesaleorderdetail',
          component: wholesaleorderdetail,
        },
        {
          path: 'wholesalebackdetail',
          name: 'wholesalebackdetail',
          component: wholesalebackdetail,
        },
        {
          path: 'productPriceListImage',
          name: 'productPriceListImage',
          component: productPriceListImage,
        },
        {
          path: 'stallList',
          name: 'stallList',
          component: stallList,
        },
        {
          path: 'stallReport',
          name: 'stallReport',
          component: stallReport,
        },
        {
          path: 'recycleOrderList',
          name: 'recycleOrderList',
          component: recycleOrderList,
        },
        {
          path: 'recycleOrderDetail',
          name: 'recycleOrderDetail',
          component: recycleOrderDetail,
        },
        {
          path: 'recyclePriceList',
          name: 'recyclePriceList',
          component: recyclePriceList,
        },
        {
          path: 'recycleCoreData',
          name: 'recycleCoreData',
          component: recycleCoreData,
        },
        {
          path: 'recycleReturnManager',
          name: 'recycleReturnManager',
          component: recycleReturnManager,
        },
        {
          path: 'recycleSetting',
          name: 'recycleSetting',
          component: recycleSetting,
        },
        {
          path: 'partner',
          name: 'partner',
          component: partner,
        },
        {
          path: 'partnerApply',
          name: 'partnerApply',
          component: partnerApply,
        },
        {
          path: 'account',
          name: 'account',
          component: account,
        },
        {
          path: 'accountBalanceDetail',
          name: 'accountBalanceDetail',
          component: accountBalanceDetail,
        },
      ],
    },
    {
      path: '/balance',
      name: 'balance',
      component: () => import('./views/balance/app'),
      children: [
        {
          path: 'detail',
          name: 'balance-detail',
          component: () => import('./views/balance/detail'),
        },
        {
          path: 'index',
          name: 'balance-index',
          component: () => import('./views/balance/index'),
        },
      ],
    },
    { path: '/404', component: view_404, hidden: true },
  ],
});
