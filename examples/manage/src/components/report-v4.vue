<template>
  <el-dialog  width="500px" :visible.sync="dialogReportVisible" :before-close="closeReport">
    <div class="sp-report-box report-v4" :class="{'un-normal': !isNormal}">
      <div class="report-box">
        <slot name="icon"></slot>
        <i class="zj-top-bg"></i>
        <div class="report-title-box">
          <p class="title">评估报告</p>
          <div class="sub-title">
            <i></i>
            <span>{{subTitle}}</span>
            <i></i>
          </div>
        </div>

        <div class="report-brand" v-if="brand">
          <h2 class="brand-title">{{ `${brand} ${model} ${condition ? condition['title'] : ''}` }}</h2>
          <div v-if="basicInfo" class="brand-desc">{{ basicInfo }}</div>
          <div v-if="partQc" class="report-partqc">本机未完成全部质检</div>
        </div>

        <div class="report-content" v-if='isNormal'>
          <div class="report-basic clearfix" v-if='basicCheckList.length > 0'>
            <h2 class="module-title">设备外观</h2>
            <div class="basic-line" v-for="basicCheck, index in basicCheckList" :key="index">
              <div class="check-name">{{ basicCheck.key }}</div>
              <div class="check-details">
                <div class="check-details-line" v-for="item,k in basicCheck.itemList">
                  <span class="basic-key">{{ item.key }}</span>
                  <div class="basic-value">{{ item.value  }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="report-function clearfix" v-if='functionCheck'>
            <h2 class="module-title">{{ functionCheck.name }}</h2>
            <div class="clearfix">
              <span v-for="(func, index) in functionCheck.list"
                    :key="index" >
              <i :class="[JSON.parse(func).normal === 'true' ? 'allNormal' : '']"></i>{{ JSON.parse(func).desc }}
            </span>
            </div>
            <div v-if="partQc" class="report-partqc left">* 其他设备功能无法完成质检，成交后不退不换</div>
          </div>

          <div class="report-unchecked clearfix" v-if='unchecked'>
            <h2 class="module-title">{{ unchecked.name }}</h2>
            <span v-for="(func, index) in unchecked.list"
                  :key="index" >
              <i :class="[JSON.parse(func).normal === 'true' ? 'allNormal' : '']"></i>{{ JSON.parse(func).desc }}
            </span>
          </div>

          <div class="report-function clearfix" v-if='displayCheck'>
            <h2 class="module-title">{{ displayCheck.name }}</h2>
            <div class="clearfix">
              <span v-for="(func, index) in displayCheck.list"
                    :key="index">
                <i :class="[JSON.parse(func).normal === 'true' ? 'allNormal' : '']"></i>{{ JSON.parse(func).desc }}
              </span>
            </div>
            <div v-if="partQc" class="report-partqc left">* 屏幕显示无法完成质检，成交后不退不换</div>
          </div>

        </div>

        <div class="shanzhai-phone" v-if='!isNormal'>
          {{unNormalReason}}
          <p class='shanzhai-desp'>您的手机无法报价</p>
        </div>

        <div class="report-comment report-content" v-if='zjStr'>
          <h2 class="module-title">工程师有话说</h2>
          <span>“{{ zjStr }}”</span>
        </div>
        <div class="footer-fix">
          <div class="footer-pos">编码{{ zjm }}</div>
        </div>
        <i class="zj-bottom-bg"></i>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'yp-report-v4',
    props: ['zjId'],
    data () {
      return  {
        dialogReportVisible: true,
        zjm: '',
        subTitle: '',
        condition: '',
        brand: '',
        unchecked: '',
        model: '',
        basicInfo: '',
        basicCheckList: '',
        functionCheck: '',
        displayCheck: '',
        zjStr: '',
        isNormal: true,
        unNormalReason: '',
        precheckType: ''
      }
    },
    created () {
        this.$http.get('https://app.zhuanzhuan.com/zzopen/ypdeal/report', {
          id: this.zjId
        }).then(res => {
          Object.assign(this, res['respData'])
        })
    },
    computed: {
      // 是否是部分质检
      partQc () {
        return this.precheckType === 3
      }
    },
    methods: {
      closeReport () {
        this.$emit('closeReport')
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .report-partqc {
    color: #ff5555;
    &.center {
      text-align: center;
    }
    &.left {
      text-align: left;
    }
  }
  $border: 1px solid #EAEAEA;
  .sp-report-box {
    border: 2px solid #D2D5DF;
    background-color: #FFF;
    margin-bottom: 24px;
    .zj-top-bg {
      display: block;
      width: 100%;
      height: 121px;
      background: url(https://pic4.zhuanstatic.com/zhuanzh/n_v24ecbad466fa34080917952734dadba9f.png);
      background-size: 100%;
      z-index: 0;
    }
    .zj-bottom-bg {
      display: block;
      width: 100%;
      height: 121px;
      background: url(https://pic3.zhuanstatic.com/zhuanzh/n_v2f36e40c973cc4cdbb20160746a0f7dd5.png);
      background-size: 100%;
    }
  }
  .report-box {
    position: relative;
    z-index: 1;
    text-align: center;
    margin: 6px;
    border: 6px solid #D2D5DF;
    background: url(https://pic2.zhuanstatic.com/zhuanzh/n_v29f1f1b3e98ac41f3b3f6e36f46788ad7.png) repeat-y;
    background-size: 100%;
    .report-title-box {
      width: 440px;
      margin: -40px auto 20px;
      .title {
        padding-bottom: 5px;
        color: #676F8A;
        font-size: 24px;
        font-weight: 500;
        text-align: center;
      }
    }
    .footer-fix {
      position: absolute;
      bottom: 30px;
      width: 100%;
      .footer-pos {
        text-align: center;
        margin: 0 auto;
        color: #AAAEB9;
        font-size: 12px;
      }
    }
    .sub-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #A9AEC1;
      span {
        padding: 0 15px;
      }
      i {
        width: 52px;
        height: 1px;
        vertical-align: middle;
        background: #969696;
      }
    }
    .report-content {
      padding: 0 30px;
    }
    .report-conclusion {
      border-top: $border;
      border-left: $border;
      border-right: $border;
      margin: 0 30px;
      .conclusion-title {
        color: #00B65E;
        font-weight: bold;
        font-size: 16px;
        padding: 50px 0 12px;
      }
      .conclusion-desc {
        color: #969696;
        margin-top: 10px;
        padding: 0 15px 26px;
      }
    }
    .report-brand {
      padding-top: 35px;
      border-top: $border;
      border-left: $border;
      border-right: $border;
      margin: 0 30px;
      .brand-title {
        color: #504A4D;
        font-weight: bold;
        font-size: 16px;
        padding: 12px 0;
      }
      .brand-desc {
        color: #00B65E;
        margin-top: 10px;
        padding: 0 15px 26px;
      }
    }
    .report-authenticate {
      margin: 0 30px;
      .authenticate-title {
        color: #504A4D;
        font-weight: bold;
        margin: 50px 0 25px 0;
        font-size: 14px;
      }
    }
    .report-basic {
      border-left: $border;
      border-right: $border;
      border-bottom: $border;
      margin: 0 0 26px 0;
      .basic-line {
        display: table;
        width: 100%;
        border-top: $border;
      }
      .basic-key, .basic-value {
        font-size: 12px;
        padding: 11px 16px;
        text-align: left;
        color: #969696;
        display: table-cell;
        box-sizing: border-box;
      }
      .basic-key {
        width: 110px;
        padding: 11px;
        color: #969696;
        border-left: $border;
        border-right: $border;
      }
      .basic-value {
        width: 33%;
      }
    }
    .module-title {
      color: #504A4D;
      font-size: 16px;
      font-weight: bold;
    }
    .report-function, .report-function{
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid #F2F2F2;
      span {
        width: 50%;
        float: left;
        text-align: left;
        line-height: 2;
        color: #969696;
        padding-left: 20px;
        box-sizing: border-box;
      }
      i {
        text-align: center;
        width: 18px;
        height: 18px;
        line-height: 21px;
        display: inline-block;
        border-radius: 50%;
        background-color: #FAC65E;
        margin-right: 8px;
        &:after {
          color: #FFF;
          content: "";
          width: 18px;
          height: 18px;
          background-size: cover;
          display: block;
          background-image: url('//pic3.zhuanstatic.com/zhuanzh/n_v2d5d01a320c83439590a50d67ee98466a.png');
          font-size: 10px;
        }
        &.allNormal{
          background-color: #00B65E;
          &:after {
            content: "";
            width: 18px;
            height: 18px;
            background-size: cover;
            display: block;
            background-image: url('//pic3.zhuanstatic.com/zhuanzh/n_v234ede397c61a4a6eaffeabd4ebf94c21.png');
          }
        }
      }
    }
    .report-comment {
      text-align: left;
      h2 {
        text-align: center;
      }
      span {
        word-break: break-all;
        color: #969696;
        line-height: 2;
      }
    }
  }
  .sp-report-box.report-v4 {
    .zj-top-bg,
    .zj-bottom-bg {
      color: #D2D5DF;
      font-family: 'PingFangSC-Regular';
      letter-spacing: 15px;
      line-height: 60px;
      font-size:9px;
    }
    .report-title-box .report-conclusion .conclusion-title,
    .report-conclusion .footer-fix {
      color: #000;
    }
  }

  .check-name {
    display: table-cell;
    color: #969696;
    width: 150px;
    vertical-align: middle;
  }

  .check-details {
    display: table-cell;
  }

  .check-details-line {
    border-bottom: 1px solid #EAEAEA;
    &:last-child {
      border-bottom: none;
    }
    display: flex;
    .basic-key {
      flex: none;
      text-align: center !important;
      width: 145px !important;
    }
    .basic-value {
      flex: 1;
      text-align: center !important;
    }
  }

  .report-unchecked {
    span {
      color: #969696;
      display: block;
      margin: 15px 0;
      box-sizing: border-box;
    }
  }
</style>
