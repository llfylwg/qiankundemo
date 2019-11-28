import { get } from './axios';
import axiosClass from 'axios';
const axios = axiosClass.create();
axios.defaults.withCredentials = true;
const post = axios.post;

const domain = 'https://ypwork.zhuanzhuan.com';
const appDomain = 'https://app.zhuanzhuan.com';
const uapiDomain = 'https://uapi.zhuanzhuan.com';
const feConfDomain = '//feconf.zhuanzhuan.com';
const Api = {
  WHOLESALE_PRODUCT_INIT: `${domain}/ypee/wholesale/product/init`,
  WHOLESALE_PRODUCT_GETOTHERPARAMS: `${domain}/ypee/wholesale/product/getOtherParams`,
  WHOLESALE_PRODUCT_GETSKUITEMVALUE: `${domain}/ypee/wholesale/product/getSkuItemValue`,
  WHOLESALE_PRODUCT_SAVE: `${domain}/ypee/wholesale/product/save`,
  WHOLESALE_PRODUCT_PRICE_IMAGE: `${domain}/ypee/wholesale/product/genQuotation`,
  WHOLESALE_PRODUCT_PRICE_IMAGE_SAVE: `${domain}/ypee/wholesale/product/saveQuotationConfig`,
  PARTNER_STALL_UPDATE: `${domain}/ypee/partner/stall/update`,
  PARTNER_STALL_REPORT_LIST: `${domain}/ypee/partner/report/list`,
  PARTNER_STALL_REPORT_EXPORT: `${domain}/ypee/partner/report/export`,
  PARTNER_RECYCLE_CONFIRM_PRICE: `${domain}/ypee/partner/recycle/confirmprice`,
  PARTNER_RECYCLE_PAY_MONEY: `${domain}/ypee/partner/recycle/paymoney`,
  SCREEN_SHOTS: `${uapiDomain}/v1.0/shots`,
  ZZOPEN_YPCSTORE_QUERYZZCATE: `${appDomain}/zzopen/ypcstore/queryZZCate`,
  SAVE_OFFER_SHEET_IMAGE: `${domain}/ypee/partner/offerSheet/uploadPriceImg`,
  GET_WOS_TOKEN: `${appDomain}/zz/transfer/getwostoken`,
  OFFLINE_SELL: `${domain}/ypee/partner/recycle/offlinesell`,
  SELECT_SELL: `${domain}/ypee/partner/recycle/selectStore`,
  GET_FECONF: `${feConfDomain}/feconf/u`,
};

/**
 * @description 批发发布 - 获取页面初始化信息接口
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.productId - 选填项, 编辑时传商品Id，新建时不传
 * @return {Promise}
 * */
export const wholesaleProductInit = (params = {}) => {
  return get(Api.WHOLESALE_PRODUCT_INIT, params);
};

/**
 * @description 批发发布 - 获取其他参数接口
 * @return {Promise}
 * */
export const wholesaleGetOtherParams = (params = {}) => {
  return get(Api.WHOLESALE_PRODUCT_GETOTHERPARAMS, params);
};

/**
 * @description 批发发布 - 拉取SKU项值接口
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.itemShotName - 必填项, 所要获取的sku项的shotname
 * @param {String} params.valueId - 必填项, 联动上级的值ID
 * @return {Promise}
 * */
export const wholesaleGetSkuItemValue = (params = {}) => {
  return get(Api.WHOLESALE_PRODUCT_GETSKUITEMVALUE, params);
};

/**
 * @description 批发发布 - 拉取SKU项值接口
 * @param {Object} params -必填项，以json形式传参
 * @param {Number} params.productId - 选填项, 商品Id（编辑时穿，新建空）
 * @param {Number} params.price - 必填项, 价格
 * @param {Number} params.stock - 必填项, 库存数
 * @param {Number} params.freight - 必填项, 运费
 * @param {String} params.pics - 必填项, 图片（竖线分割）
 * @param {String} params.context - 必填项, 卖家有话说
 * @param {Number} params.service - 必填项, 售后服务
 * @param {Number} params.specialDesc - 必填项, 特别说明
 * @param {Array} params.items - 必填项, sku项
 * @param {String} params.items[{shotName}] - 必填项, 项名缩写
 * @param {Number} params.items[{selectedValueId}] - 必填项, 选定的值
 * @return {Promise}
 * */
export const wholesaleSave = (params = {}) => {
  return post(Api.WHOLESALE_PRODUCT_SAVE, params).then(res => {
    return res.data;
  });
};

/**
 * @description 批发生成报价单获取数据
 */
export const wholesaleProductPriceList = (params = {}) => {
  return get(Api.WHOLESALE_PRODUCT_PRICE_IMAGE, params);
};
export const wholesaleProductPriceListSave = (params = {}) => {
  return post(Api.WHOLESALE_PRODUCT_PRICE_IMAGE_SAVE, params).then(res => {
    return res.data;
  });
};
/**
 * @description 门店管理 - 修改门店信息接口
 * @param {Object} params -必填项，以json形式传参
 * @param {Number} params.stallName - 选填项, 门店名称
 * @param {Number} params.managerName - 必填项, 店长
 * @param {Number} params.contactNumber - 必填项, 手机号码
 * @param {Number} params.address - 必填项, 地址
 * @param {String} params.stallId - 必填项, 门店ID
 * @return {Promise}
 * */
export const stallUpdate = (params = {}) => {
  return post(Api.PARTNER_STALL_UPDATE, params).then(res => {
    return res.data;
  });
};

/**
 * @description 门店管理 - 获取合伙人报表数据接口
 * @param {Object} params -必填项，以json形式传参
 * @param {Number} params.indexItem - 选填项, 指标类型(1: 支付GMV, 2: 支付订单量, 100: 新增门店数, 101: 门店活跃情况)
 * @param {Number} params.timeSpan - 必填项, 时间跨度，7天、30天
 * @return {Promise}
 * */
export const stallReportList = (params = {}) => {
  return get(Api.PARTNER_STALL_REPORT_LIST, params);
};

/**
 * @description 合伙人数据，导出报表
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.startDate - 必填项, 开始时间，yyyy-MM-dd
 * @param {String} params.endDate - 必填项, 结束时间，yyyy-MM-dd
 * @return {Promise}
 * */
export const stallReportExport = (params = {}) => {
  return get(Api.PARTNER_STALL_REPORT_EXPORT, params);
};

/**
 * @description 获取指定地址页面生成的图片（eg: https://uapi.zhuanzhuan.com/v1.0/shots?url=https:%2F%2Fm.zhuanzhuan.com%2Fu%2Fbmshop%2Fshare%2Fshop-poster%3FuserId%3D36112147419926%26id%3D&ut_key=shop_poster）
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.url - 必填项, 页面地址url
 * @param {String} params.noauth - 选填项, 是否校验PPU，默认校验(0: 校验PPU，1: 不校验PPU)
 * @return {Promise}
 * */
export const screenShots = (params = {}) => {
  return get(Api.SCREEN_SHOTS, params);
};

/**
 * @description 通过cateID获取对应分类
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.cateId - 必填项, 分类ID
 * @return {Promise}
 * */
export const queryZZCate = (params = {}) => {
  return get(Api.ZZOPEN_YPCSTORE_QUERYZZCATE, params);
};

/**
 * @description 合伙人确认回收订单，支持批量
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.orderIds - 必填项, 分类ID
 * @return {Promise}
 * */
export const partnerConfirmPrice = (params = {}) => {
  return get(Api.PARTNER_RECYCLE_CONFIRM_PRICE, params);
};

/**
 * @description 合伙人打款接口，支持批量
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.orderIds - 必填项, 分类ID
 * @return {Promise}
 * */
export const partnerPayMoney = (params = {}) => {
  return get(Api.PARTNER_RECYCLE_PAY_MONEY, params);
};

/**
 * @description 获取视频上传的wos token
 * @param {Object} obj -必填项，以json形式传参
 * @param {String} obj.bucket -必填项，bucket
 * @param {String} obj.md5 -必填项，md5
 * @param {String} obj.expire -必填项，过期时间
 * @param {String} obj.extension -必填项，扩展名
 * */
export const getWosToken = (params = {}) => {
  return post(Api.GET_WOS_TOKEN, params).then(res => {
    return res.data;
  });
};

/**
 * @description 获取feconf的Apollo配置数据
 * @param {Object} obj -必填项，以json形式传参
 * @param {String} obj.keys -必填项，key值
 * */
export const getFEConf = (params = {}) => {
  return get(Api.GET_FECONF, params);
};
/**
 * @description 报价单管理上传某个型号的报价单图片
 * @param {Object} params -必填项，以json形式传参
 * @param {String} obj.img -必填项，图片链接
 * @param {String} obj.id -必填项，报价单id
 * */
export const saveOfferSheetImage = (params = {}) => {
  return get(Api.SAVE_OFFER_SHEET_IMAGE, params);
};

/**
 * @description 确认线下售卖
 * @param {Object} params -必填项，以json形式传参
 * @param {String} obj.orderIds -必填项，定单ID（多个"|"隔开）
 * */
export const offlineSell = (params = {}) => {
  return get(Api.OFFLINE_SELL, params);
};

/**
 * @description 选择卖场
 * @param {Object} params -必填项，以json形式传参
 * @param {String} obj.orderId -必填项，定单ID
 * @param {String} obj.type -必填项，卖场类型（0：已验机，1：明拍，2：暗拍）
 * @param {String} obj.price -必填项，价格
 * */
export const selectSell = (params = {}) => {
  return get(Api.SELECT_SELL, params);
};
