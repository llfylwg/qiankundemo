/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { getWosToken } from './Api';

const STATUS_UPLOADING = 'uploading';
const STATUS_ERROR = 'error';
const STATUS_SUCCESS = 'success';

export default function uplaodWos(file, options, cb) {
  file.progress = 0.02;
  file.status = STATUS_UPLOADING;
  const bucket = 'zzfecommon';
  const appid = 'wbuTsRqPowE';
  const wosurl = '//zzwos.58.com';
  const ttl = 0;

  // insertOnly==0 表示允许覆盖文件 1表示不允许覆盖
  const insertOnly = 1;

  // 文件别名，默认不设置，如果设置，下载时通过http头中Content-Disposition字段返回
  const alias = '';

  // 大文件上传的分片大小，默认1M，支持1,2,3,4M,小文件该字段为0，不受该值影响.
  const sliceSize = 2 * 1024 * 1024;
  const succCB = function(result) {
    result = JSON.parse(result);
    if (result.code === 0) {
      cb && cb(result);
    }
  };

  const errCB = function(result) {
    cb && cb(result);
  };

  const progCB = function(curr) {
    file.progress = curr;
  };

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let lastTaskId;
  const taskReady = function(taskId) {
    lastTaskId = taskId;
  };
  // 避免重名
  const md5Value = file.name + 'zzfecommonmd5' + Math.random();
  const wos = new WosSys({
    appid, // APPID 必填参数
    bucket, // bucketName 必填参数
    wosurl, // wos的url 必填参数
    getAppSign(callback) {
      // 获取签名 必填参数
      $.ajax({
        type: 'post',
        url: 'https://app.zhuanzhuan.com/zz/transfer/getwostoken',
        data: {
          bucket,
          md5: md5Value,
          expire: '1200',
          extension: file.name.split('.')[1] || 'mp4',
        },
      })
        .done(res => {
          const rest = JSON.parse(res);
          const filename = rest.respData.fileName;
          const sig = rest.respData.data;
          callback(encodeURIComponent(sig), filename);
        })
        .fail(res => {
          cb && cb(res);
        });
    },
  });
  wos.uploadFile(succCB, errCB, progCB, bucket, file.name, file, ttl, insertOnly, taskReady, sliceSize, alias);
}
