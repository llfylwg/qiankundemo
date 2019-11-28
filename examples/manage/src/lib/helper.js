export const isVideo = (url) => {
  const isVideoReg = /(mp4|avi|m3u8|rmvb)$/
  return isVideoReg.test(url.toLowerCase())
}
