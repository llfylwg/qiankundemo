import axios from 'axios'
const _promise = {}
const formatData = function(data) {
  let formdata = new FormData()
  Object.keys(data).forEach(cur => {
    formdata.append(cur, data[cur])
  })
  return formdata
}
const setPromiseQuerable = (promise, opts = {}) => {
  const time = opts.time || 100
  let obj = { isPending: true, isRejected: false, isFulfilled: false }
  let result = promise.then(
    v => {
      setTimeout(() => {
        obj.isFulfilled = true
        obj.isPending = false
      }, time)
      return v
    },
    e => {
      setTimeout(() => {
        obj.isRejected = true
        obj.isPending = false
      }, time)
      throw e
    }
  )
  if (opts.canRepeat) obj.isPending = false
  result.isFulfilled = () => obj.isFulfilled
  result.isPending = () => obj.isPending
  result.isRejected = () => obj.isRejected
  return result
}
/**
 *
 * @param url
 * @param params
 * @param method
 * @param opts canRepeat可以重复点击的标识，time是重复点击后多少ms才能点击
 * @returns {*}
 */
export function ajax(url, params = {}, method = 'get', opts) {
  const promiseObj = _promise[url]
  if (promiseObj && promiseObj.isPending()) {
    return Promise.reject(
      new Error(
        JSON.stringify({
          url,
          msg: 'POST请求重复点击'
        })
      )
    )
  }
  params.ts = +new Date()
  let conf =
    method.toLowerCase() === 'post'
      ? {
          method: 'post',
          url: url,
          data: opts && opts.json ? params : formatData(params)
        }
      : {
          method: 'get',
          url: url,
          params: params
        }
  return method == 'post'
    ? (_promise[url] = setPromiseQuerable(
        axios.request(conf).then(res => res.data),
        opts
      ))
    : axios.request(conf).then(res => res.data)
}
