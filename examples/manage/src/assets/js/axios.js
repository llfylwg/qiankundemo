import axiosClass from 'axios';
const axios = axiosClass.create();
import { Message } from 'element-ui';
import Cookie from 'js-cookie';
// axios.defaults.baseURL = 'https://easy-mock.com/mock/5c0b41e275301301e40f0b13/doraemon'
axios.defaults.baseURL = '//ypwork.zhuanzhuan.com/ypee';
// axios.defaults.baseURL = 'http://localhost:3003/ypee'
axios.defaults.withCredentials = true;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
function formData(data) {
  let formdata = new FormData();
  Object.keys(data).forEach(key => {
    formdata.append(key, data[key]);
  });
  return formdata;
}
axios.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.transformRequest = data => formData(data);
  }
  return config;
});
axios.interceptors.response.use(
  function(response) {
    if (response.status && response.status === 200) {
      const code = response.data.code;
      const respCode = response.data.respCode;
      // const msg = response.data.msg || '服务端异常'
      if (code === 101 || code === -1000) {
        Cookie.remove('ypsso_uid', {
          domain: 'zhuanzhuan.com',
        });
        window.location.replace('https://open.zhuanzhuan.com');
      } else if (code === -2000) {
        Message({
          type: 'error',
          message: '无权限访问',
        });
      } else if (code === -3000) {
        Message({
          type: 'error',
          message: '账号信息不完整',
        });
      } else if (+code === 0 || +respCode === 0) {
        return response.data;
      } else {
        const errMsg = response.data.msg || response.data.errMsg;
        Message({
          type: 'error',
          message: errMsg,
        });
        return Promise.reject({ msg: errMsg });
      }
    }
  },
  function(error) {
    return Promise.reject(error);
  },
);

export const get = (url, params = {}, opts = { withoutVerify: false }) =>
  axios.get(url, {
    params,
    ...opts,
  });

// 如果有formData格式的需求在这里封装
export const post = axios.post;
export const put = axios.put;
