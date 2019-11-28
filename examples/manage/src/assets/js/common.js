import { get } from './axios';
const zzHost = 'https://app.zhuanzhuan.com';

const getShareMiniCode = function(params, w, h) {
  return get(`${zzHost}/zzopen/wxcommon/createCode2Long`, {
    source: '111',
    width: w || '500',
    height: h || '500',
    autoColor: 'false',
    lineColor: {
      r: '0',
      g: '0',
      b: '0',
    },
    page: 'pages/webview/bridge',
    params: {
      ...params,
      shareCode: 'true',
    },
  });
};

export { getShareMiniCode };
