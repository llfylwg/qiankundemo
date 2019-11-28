/**
 * Created by hqq on 2018/10/10.
 */
export const paramsObjToStr = params => {
  let str = ''
  const keys = Object.keys(params)
  keys.map((key, index) => {
    if (params[key] != undefined) {
      index === 0
        ? (str += `${key}=${params[key]}`)
        : (str += `&${key}=${params[key]}`)
    }
  })
  return str
}

export const isArray = arr => {
  return Object.prototype.toString.call(arr) == '[object Array]'
}
