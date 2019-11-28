<template>
  <div class="order-info">
      <div class="content">
        <div class="item"><span>下单类型：</span>{{ orderSourceDesc }}</div>
        <div class="item"><span>订单标题：</span>{{ info.title }}</div>
        <div class="item"><span>订单商品数量：</span>{{ info.count }}</div>
        <div class="item" v-if="info.firstPrice"><span>初次报价：</span>{{ info.firstPrice }}</div>
        <div class="item" v-if="info.qcEvalPrice"><span>回收质检报价：</span>{{ info.qcEvalPrice }}</div>
        <div class="item" v-if="info.secondPrice"><span>二次报价：</span>{{ info.secondPrice }}</div>
        <div class="item" v-if="info.dealPrice"><span>订单金额：</span>{{ info.dealPrice }} 元</div>
        <div class="item" v-if="orderSource === 4">
          <span>商品具体信息：</span>
          <span
            class="params-item"
            v-for="(item, index) in info.phoneParams"
          >{{ item }}</span>
        </div>
        <div class="item" v-if="info.desc"><span>补充说明：</span>{{ info.desc }}</div>
        <div class="images">
          <img class="img" @click="showDialog(item, 'image')" v-for="(item) in images" :src="url + item" alt="" />
          <div class="small-video" v-for="(item) in videos" @click="showDialog(videoUrl + item, 'video')">
            <video class="img" :src="videoUrl + item"></video>
            <div class="icon"></div>
          </div>
        </div>
        <!--二次改价的内容-->
        <div class="item" v-if="changeDesc"><span>改价说明：</span>{{ changeDesc }}</div>
        <div class="images">
          <img class="img" @click="showDialog(item, 'image')" v-for="(item) in changeImages" :src="url + item" alt="" />
          <div class="small-video" v-for="(item) in changeVideos" @click="showDialog(item, 'video')">
            <video class="img" :src="item"></video>
            <div class="icon"></div>
          </div>
        </div>
      </div>
    <el-dialog
      custom-class="dialog"
      :visible="dialogVisible"
      top="10px"
      width="640px"
      :before-close="handleClose">
      <img v-if="type == 'image'" class="big-image" :src="image" alt="" />
      <video v-if="type == 'video'" class="big-image" :src="video" controls autoplay></video>
    </el-dialog>
  </div>
</template>
<script>
  import {isVideo} from '@/lib/helper'
  export default {
  props: ['info', 'orderSource', 'orderSourceDesc', 'changeDesc', 'changeMedia'],
  data () {
    return {
      url: 'https://pic3.zhuanstatic.com/zhuanzh/',
      videoUrl: 'https://zzwos.58cdn.com.cn',
      dialogVisible: false,
      image: '',
      video: '',
      type: ''
    }
  },
  methods: {
    showDialog (item, type) {
      this.dialogVisible = true
      if (type == 'image') {
        this.image = this.url + item
      } else {
        this.video = item
      }
      this.type = type
    },
    handleClose(done) {
      this.dialogVisible = false
    }
  },
  computed: {
    images: function () {
      if (this.info.images) {
        return this.info.images.split('|')
      }
    },
    videos: function () {
      if (this.info.videos) {
        return this.info.videos.split('|')
      }
    },
    changeImages: function () {
      if (this.changeMedia) {
        return this.changeMedia.split('|').filter(item => !isVideo(item)) || []
      }
    },
    changeVideos: function () {
      if (this.changeMedia) {
        return this.changeMedia.split('|').filter(item => isVideo(item)) || []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .order-info {
    .content {
      font-size: 14px;
      .item {
        margin-bottom: 20px;
        span {
          display: inline-block;
          color: #6D6F73;
        }
      }
      .images {
        .img {
          width: 80px;
          max-height: 80px;
          margin: 0 8px 8px 0;
        }
        .small-video{
          display: inline-block;
          position: relative;
          .icon {
            width: 50px;
            height: 50px;
            position: absolute;
            background: transparent center no-repeat url('../../../assets/img/play.png');
            background-size: cover;
            top: 50%;
            left: 50%;
            transform: translate(-58%, -60%);
          }
        }
      }
    };
    .params-item {
      margin-right: 4px;
      padding: 2px 8px;
      border: 1px solid #b5b5b5;
      border-radius: 4px;
    }
    .big-image {
      width: 600px;
    }
    .big-video {
      // width: 600px;
      max-height: 700px;
    }
  }
</style>
