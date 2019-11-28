<template>
  <el-button @click.native="handleExport" :disabled="disabled" :type="type" :size="size" >{{exportName}}</el-button>
</template>
<script>
  import { paramsObjToStr } from '../lib/utils'
  export default {
    props: {
      exportName: {
        // 自定义导出按钮文字
        type: String,
        default: '导出'
      },
      disabled: {
        // 自定义按钮是否有效
        type: Boolean,
        default: false
      },
      size: {
        // 自定义大小
        type: String,
        default: 'mini'
      },
      type: {
        // 按钮主题
        type: String,
        default: ''
      },
      pre_export: {
        type: String
      },
      filter: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        host: '//ypwork.zhuanzhuan.com/'
      }
    },
    methods: {
      handleExport() {
        if (window.EventSource) {
          const params = paramsObjToStr(this.filter)
          var eventSource = new EventSource(
            `${this.host}${this.pre_export}?${params}`,
            { withCredentials: true }
          )
          this.$store.commit('progress', {
            showProgressBar: true
          })
          eventSource.addEventListener('running', res => {
            const data = JSON.parse(res.data)
            this.$store.commit('progress', {
              tipName: data.name,
              progressPercentage: data.percent
            })
          })
          eventSource.addEventListener('complete', res => {
            const data = JSON.parse(res.data)
            this.$store.commit('progress', {
              showProgressBar: false
            })
            eventSource.close()
            window.open(
              `${this.host}commonexport/export?key=${data.fileKey}`,
              '_blank',
              'fullscreen=no,width=400,height=300'
            )
          })
          eventSource.addEventListener('error', res => {
            eventSource.close()
            const data = JSON.parse(res.data)
            this.$message.error(data.errorMsg)
            this.$store.commit('progress', {
              showProgressBar: false
            })
          })
        } else {
          this.$message.error('您的浏览器暂不支持该功能，请换chrome重试一下～～')
        }
      }
    }
  }
</script>
