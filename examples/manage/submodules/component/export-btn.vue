<template>
  <el-button @click.native="handleExport" type="primary" icon="el-icon-download">导出</el-button>
</template>
<script>
  import { paramsObjToStr } from '../lib/utils'
  export default {
    props: {
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
        this.$emit('handleExport')
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
            this.$emit('complete', data)
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
