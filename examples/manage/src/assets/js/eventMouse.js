const eventMouse = (key, success, error, progress) => {
  var eventSource = new EventSource(`https://ypwork.zhuanzhuan.com/ypee/partner/recycle/upload_result?key=${key}`, {
    withCredentials: true,
  });
  eventSource.addEventListener('beat', res => {
    const data = JSON.parse(res.data);
    progress && progress(data);
  });
  eventSource.addEventListener('ok', res => {
    const data = JSON.parse(res.data);
    eventSource.close();
    success && success(data);
  });
  eventSource.addEventListener('error', res => {
    const data = JSON.parse(res.data);
    eventSource.close();
    error && error(data);
  });
};

export { eventMouse };
