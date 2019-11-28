/* eslint-disable */
function PicService(path) {
  if (!/\/[a-z_1-9]*\//.test(path)) {
    throw new Error('不符合规则的路径，路径必须以 / 开头和结尾');
  }

  console.assert(
    File && FileReader,
    '暂不支持的浏览器类型，因为使用了 File 和 FileReader API， 如果你实现了对应的功能，欢迎给我们提 PR http://gitlab.58corp.com/npm/pic',
  );

  this.path = path;
}

PicService.prototype.upload = function(file, callback, progressCallback) {
  var ctx = this;

  if (!file instanceof File) {
    if (file.file == undefined || file.file == null || !file.file instanceof File) {
      callback(
        {
          code: 1,
          message: '参数不正确',
        },
        null,
      );
      return;
    }
  }

  var fileReader = new FileReader();

  fileReader.onload = function(event) {
    var request = new XMLHttpRequest();

    request.upload.onprogress = function(e) {
      progressCallback(e.loaded, e.total);
    };

    request.onreadystatechange = function(res) {
      if (request.readyState == 4) {
        if (request.status == 200) {
          callback(null, ctx.path + request.responseText);
        } else {
          callback(
            {
              code: 2,
              message: '上传出错',
              stack: res,
            },
            null,
          );
        }
      }
    };

    request.ontimeout = function(e) {
      callback({
        code: 3,
        message: '上传超时',
      });
    };

    request.open('POST', '//upload.58cdn.com.cn/json?rand=0.1928');
    request.setRequestHeader('Content-Type', 'text/plain');
    request.send(
      JSON.stringify({
        'Pic-Size': '0',
        'Pic-Encoding': file.encoding || 'base64',
        'Pic-Path': ctx.path,
        'Pic-Data': event.target.result.split('base64,').pop(),
      }),
    );
  };

  fileReader.onerror = function(e) {
    callback(
      {
        code: 2,
        message: '图片读取错误',
      },
      null,
    );
  };

  fileReader.readAsDataURL(file);
};

export default PicService;
