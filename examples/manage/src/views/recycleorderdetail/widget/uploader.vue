<template lang="html">
    <div class="uploader">
        <div class="uploader-list">
            <div class="uploader-list-item" :style="{backgroundImage: 'url(' + thumbnail(item) + ')'}" v-for="(item, index) in pics" :key="index">
                <div class="uploader-list-item-player" v-show="isVideo(item)" >
                    <i class="el-icon-caret-right" @click="biggerPic(item)"></i>
                </div>
                <div class="uploader-list-item-filter">
                    <i v-if="!isVideo(item)" class="el-icon-zoom-in icon-item" @click="biggerPic(item)"></i>
                    <i v-else class="el-icon-video-play icon-item" @click="biggerPic(item)"></i>
                    <i class="el-icon-delete icon-item" @click="deletePic(index)"></i>
                </div>
            </div>
            <el-upload
                v-show="this.pics.length < 8"
                class="avatar-uploader"
                :before-upload="beforeUpload"
                :http-request="upload"
                :show-file-list="false"
                accept="jpg"
                :limit="8"
                multiple
                action="">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
    import ajaxUploadWos from '@/assets/js/uploadWos'
    import PicService from '@/assets/js/picService'
    import { getLocalStorage, loadJs } from '@/assets/js/helper'
    export default {
        // props: ['orderInfo', 'price', 'orderId'],
        data () {
            return {
                dialogFormVisible: true,
                pics: []
            }
        },
        created () {
            this.init()
        },
        methods: {
            init () {
                const orderId = this.$route.query.orderId || ''
                const formObj = getLocalStorage(orderId) || []
                this.pics = formObj.pics || []
                this.imageUploaderInit()
                this.videoUploaderInit()
            },
            imageUploaderInit () {
                this.picSer = new PicService('/zhuanzh/')
            },
            isVideo (item) {
                const isVideoReg = /(mp4|avi|m3u8|rmvb)$/
                return isVideoReg.test(item.toLowerCase())
            },
            videoUploaderInit () {
                loadJs('https://s1.zhuanstatic.com/common/system/js/jquery-1.12.4.min.js')
                loadJs('https://s1.zhuanstatic.com/common/system/wos-js-sdk-v2.ajksdhkjas.js')
            },
            beforeUpload (file) {
                console.log(file)
                const {type} = file
                const isMediaReg = /(image)|(video)/
                if (!isMediaReg.test(type)) {
                    this.$message.error('图文详情，请上传图片或视频')
                    return false
                }
            },
            upload (res) {
                console.log(res)
                const { file } = res
                const isImageReg = /image/
                const isVideoReg = /video/
                console.log(isImageReg.test(file.type), isVideoReg.test(file.type))
                if (isImageReg.test(file.type)) {
                    return this.picSer.upload(file, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('upload data: ', data)
                            const pic = data.replace('/zhuanzh/', '')
                            this.pics.push(pic)
                            this.$emit('change', this.pics)
                        }
                    }, (loaded, total) => {
                        // loaded 为已经上传的字节数，total 为还未上传的字节数
                        console.log('上传进度：')
                        console.log(loaded, total)
                    })
                }
                if (isVideoReg.test(file.type)) {
                    return ajaxUploadWos(file, {}, (data) => {
                        console.log('video: ', data)
                        const { url } = data.data
                        this.pics.push(url)
                        console.log(this.pics)
                        this.$emit('change', this.pics)
                    })
                }
            },
            thumbnail (item) {
                console.log(item)
                const isVideo = this.isVideo(item)
                const defaultPost = 'https://pic3.zhuanstatic.com/zhuanzh/n_v2192931de67cf4277828a77df66b2065c.png'
                if (isVideo) {
                    return defaultPost
                }
                return this.setPicSize(item)
            },
            setPicSize (item) {
                return `https://pic3.zhuanstatic.com/zhuanzh/${item}`
            },
            deletePic (index) {
                this.pics = this.pics.filter((v, i) => (i != index))
                this.$emit('change', this.pics)
            },
            biggerPic (item) {
                console.log(item)
                this.$emit('magnifier', this.isVideo(item) && item || this.setPicSize(item))
            }
        }
    }
</script>

<style lang="scss">
    .uploader{
        &-list{
            &-item{
                position: relative;
                line-height: 120px;
                text-align: center;
                width: 120px;
                height: 120px;
                background-size: cover;
                border-radius: 2px;
                display: inline-block;
                vertical-align: middle;
                margin: 6px;
                &-player{
                    position: absolute;
                    font-size: 20px;
                    text-align: center;
                    width: 100%;
                    /*color: white;*/
                }
                &-filter{
                    border-radius: 2px;
                    background-color: transparent;
                    opacity: 0;
                    .icon-item{
                        margin: 0 4px;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                    }
                }
                &-filter:hover{
                    background-color: black;
                    opacity: 0.6;
                }
            }
        }
    }
    .avatar-uploader{
        display: inline-block;
        vertical-align: middle;
        width: 120px;
        height: 120px;
        margin: 6px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        text-align: center;
    }
    .avatar-uploader-icon:before{
        line-height: 120px;
    }
    .avatar {

        display: block;
        background-size: cover;
    }
</style>
