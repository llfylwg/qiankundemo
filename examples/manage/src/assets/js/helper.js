function formatSeconds(value) {
  var theTime = parseInt(value); // 秒
  var middle = 0; // 分
  var hour = 0; // 小时
  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  var result = '' + parseInt(theTime) + '秒';
  if (middle > 0) {
    result = '' + parseInt(middle) + '分' + result;
  }
  if (hour > 0) {
    result = '' + parseInt(hour) + '小时' + result;
  }
  return result;
}

function checkTime(value) {
  if (value < 10) {
    return `0${value}`;
  }
  return value;
}

function setCookie(name, value, expireHours) {
  let cookieString = name + '=' + escape(value);
  // 判断是否设置过期时间
  if (expireHours > 0) {
    var date = new Date();
    date.setTime(date.getTime() + expireHours * 3600 * 1000);
    cookieString = cookieString + ';domain=.zhuanzhuan.com;path=/;expires=' + date.toGMTString();
  }
  document.cookie = cookieString;
}

function countTime(time) {
  const newTime = parseInt(time); // 秒
  let d = parseInt(newTime / 60 / 60 / 24); // 天
  let h = parseInt((newTime / 60 / 60) % 24); // 时
  let m = parseInt((newTime / 60) % 60); // 分
  let s = newTime % 60; // 秒
  d = checkTime(d);
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  return `${d}天${h}时${m}分${s}秒`;
}

function getCookie(name) {
  let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
  if (arr != null) return unescape(arr[2]);
  return null;
}

/**
 * @description 下载图片（PC端，移动端可能会有权限问题）
 * @param {Object} params -必填项，以json形式传参
 * @param {String} params.url - 必填项, 图片地址
 * @param {String} params.name - 选填项, 下载图片名称（默认值：下载图片名称）
 * @return {Promise}
 * */
function downloadIamge({ url, name }) {
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL('image/png');

    // 生成一个a元素
    const a = document.createElement('a');
    // 创建一个单击事件
    const event = new MouseEvent('click');

    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
    a.download = name || '下载图片名称';
    // 将生成的URL设置为a.href属性
    a.href = url;

    // 触发a的单击事件
    a.dispatchEvent(event);
  };
  image.src = url;
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return JSON.parse(value);
}

function setLocalStorage(key, value) {
  if (typeof value == 'object') {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}
function clearStorage() {
  localStorage.clear();
}

function loadJs(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  if (typeof callback != 'undefined') {
    if (script.readyState) {
      script.onreadystatechange = function() {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function() {
        callback();
      };
    }
  }
  script.src = url;
  document.body.appendChild(script);
}

export {
  loadJs,
  formatSeconds,
  countTime,
  getCookie,
  setCookie,
  downloadIamge,
  getLocalStorage,
  setLocalStorage,
  clearStorage,
};
