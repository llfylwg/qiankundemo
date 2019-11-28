<template>
  <div class="sale-publish-main">
    <div class="sale-publish-main-title">等级样例图（每个等级对应的样例图最少上传2张，最多5张）</div>
    <panel :key="item.id" :title="item.name" v-for="item in items">
      <div class="panel-cxt">
        <div class="panel-cxt-pics">
          <div class="panel-cxt-pics-item" v-for="(text, index) in ['正面图片', '背面图片', '其他图片', '其他图片', '其他图片']">
            <pic-seat :pic="item.pics[index]" :title="text" @del="res => deletePic(res, item)">
              <el-upload
                  :before-upload="beforeUpload"
                  :http-request="res => upload(res, item)"
                  :show-file-list="false"
                  accept="jpg"
                  action=""
                  class="panel-cxt-pics-item-uploader">
                <div class="panel-cxt-pics-item-uploader-cxt"></div>
              </el-upload>
            </pic-seat>
          </div>
        </div>
      </div>
    </panel>
    <div class="sale-publish-main-button">
      <el-button @click="save" class="sale-publish-main-button-btn" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
  import PicService from '@/assets/js/picService'
  import axiosClass from 'axios'
  import panel from '@/components/page/wholesalepublish/panel'
  import picSeat from '@/components/page/wholesalepublish/picSeat'
  const axios = axiosClass.create()
  export default {
    components: {
      panel, picSeat
    },
    data () {
      return {
        picSer: null,
        items: []
      }
    },
    created () {
      this.getPicList()
      this.picSer = new PicService('/zhuanzh/')
    },
    methods: {
      save () {
        const item = this.items.find(item => item.pics.length && item.pics.length < 2)
        if (item) {
          this.$message.error(`保存失败，${item.name}样例图片不足2张，请补充后再重新保存`)
          return
        }
        const data = this.items.map(item => {
          return {
            id: item.id,
            name: item.name,
            pics: item.pics.join('|')
          }
        })
        axios.defaults.withCredentials = true
        axios.post('//ypwork.zhuanzhuan.com/ypee/wholesale/product/saveSamplePics', {
          picList: data
        }).then(resp => {
          const res = resp.data
          if (res.code == 0) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      getPicList () {
        this.$http.get('/wholesale/product/samplePicList').then(res => {
          this.items = res.data.map(item => {
            return {
              id: item.id,
              name: item.name,
              pics: item.pics ? item.pics.split('|') : []
            }
          })
        })
      },
      beforeUpload (file) {
        const {type} = file
        const isImageReg = /image/
        if (!isImageReg.test(type)) {
          this.$message.error('图文详情，请上传图片')
          return false
        }
      },
      upload (res, item) {
        if (item.pics.length >= 5) return
        this.picSer.upload(res.file, (err, data) => {
          if (err) {
            console.log(err)
          } else {
            const pic = data.replace('/zhuanzh/', '')
            item.pics.push(pic)
          }
        }, (loaded, total) => {
          // loaded 为已经上传的字节数，total 为还未上传的字节数
          console.log('上传进度：')
          console.log(loaded, total)
        })
      },
      deletePic (pic, item) {
        item.pics = item.pics.filter(item => (pic != item))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sale-publish-main {
    &-title {
      color: #2E3135;
      font-size: 16px;
      font-weight: bold;
      padding: 28px 32px;
      background-color: white;
    }

    .panel-cxt {
      margin: 16px 0 6px;

      &-title {
        font-size: 14px;
        color: #6D6F73;
        line-height: 22px;

        span {
          font-size: 14px;
          color: #FF962F;
        }
      }

      &-radio {
        margin-top: 4px;
        margin-bottom: 12px;
      }

      &-pics {
        margin-top: 16px;

        &-item {
          display: inline-block;
          margin-right: 16px;
          margin-bottom: 24px;

          &-uploader {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;

            &-cxt {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
      }

      &-textarea {
        margin-top: 16px;
      }

      &-checkbox {
        margin: 16px 0 24px;

        &-row {
          margin-bottom: 16px;

          &-text {
            font-size: 14px;
            color: #6D6F73;
            margin-left: 10px;

            a {
              color: #1087F2;
            }
          }
        }
      }

      .el-form-item {
        margin: 10px 0 10px;
      }

      .input-unit {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #6D6F73;
      }

      .input-desc {
        font-size: 14px;
        color: #C8C8C8;
        height: 60px;
        line-height: 60px;
      }

      .input-text {
        font-size: 14px;
        color: #FF962F;
        height: 60px;
        line-height: 60px;
        margin-left: 20px;
      }

      .input-wrapper {
        margin-left: 16px;
        display: inline-block;
      }
    }

    &-button {
      margin: 60px auto;
      text-align: center;

      &-btn {
        width: 160px;
      }
    }
  }
</style>
