<template>
  <div>
    <div class="capture-photo" @click="handleCaptureClick">
      <img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMuMiIvPgogICAgPHBhdGggZD0iTTkgMkw3LjE3IDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yaC0zLjE3TDE1IDJIOXptMyAxNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo="/>
    </div>
    <div class="capture-result" v-show="canvas_show" ref="canvasArea">
      <i class="el-icon-close close" @click="closeCature"/>
      <div class="save-btn" @click="downloadPic">
        <el-button icon="el-icon-download">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  props: {
    captureQuery: {
      default: 'body',
      type: String,
      current_canvas: null
    }
  },
  data() {
    return {
      canvas_show: false
    }
  },
  methods: {
    handleCaptureClick() {
      const that = this
      const captureBody = document.querySelector(this.captureQuery)
      html2canvas(captureBody).then(function(canvas) {
        that.current_canvas = canvas
        that.$refs.canvasArea.appendChild(canvas)
        that.canvas_show = true
      })
    },
    downloadPic() {
      var canvas = document.getElementsByTagName('canvas')[0]
      var image = canvas.toDataURL('image/png')
      var link = document.createElement('a')
      link.download = 'capture.png'
      link.href = image
      link.click()
    },
    closeCature() {
      this.canvas_show = false
      this.$refs.canvasArea.removeChild(this.current_canvas)
    }
  }
}
</script>
<style lang="scss">
.capture-photo {
  width: 56px;
  height: 56px;
  background-color: #108ee9;
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 999;
  border-radius: 50%;
  display: flex;
  align-items: center;
  img {
    flex: 1;
    width: 30px;
    height: 30px;
  }
}
.capture-result {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 99999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  i.close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    font-size: 36px;
    color: #fff;
  }
  canvas {
    position: fixed;
    top: 0px;
    left: 0px;
    opacity: 1;
    transform: scale(0.8);
  }
}
.save-btn {
  position: absolute;
  right: 20px;
  top: 80px;
}
</style>
