<template>
  <div class="product-price-list-warp">
    <div class="product-price-list-warp-edit">
      <div class="header">编辑区</div>
      <div class="btns">
        <el-button  type="primary" @click="showDialog">编辑文案</el-button>
        <el-button  type="success" @click="convert">生成图片</el-button>
      </div>
      <div class="title">
        <el-input
          :value="form.title"
          :disabled="true"
          placeholder="此处为标题区，可点击编辑按钮输入（例如：转转批发二手手机报价单）"/>
      </div>
      <el-input
        :value="form.tips"
        :disabled="true"
        type="textarea"
        :rows="3"
        placeholder="此处为购买须知区，可点击编辑按钮进行注意事项及其他文案的描述"/>
    </div>
    <div class="product-price-list-warp-edit">
      <div class="header">预览区</div>
      <div class="image" >
        <!-- <div class="image-header">{{ title }}</div> -->
        <div id="capture">
          <h2  class="image-header">{{ form.title || '***报价单' }} <span>{{ date }}</span></h2>
          <div class="image-content">
            <div class="image-content-null" v-if="data.length == 0">
              当前暂无数据，请先上传批发商品或修改商品等级！
            </div>
            <div
              v-else
              v-for="(item, index) in data"
              :key="index"
            >
              <div class="image-content-header">{{ item.cate2 }}</div>
              <el-table
                v-for="index in 2"
                :key="index"
                :data="getListData(index, item.records)"
                style="width: 50%; display: inline-block; vertical-align: top;"
                :header-cell-style="{color:'red', padding: 0}"
                :cell-style="{fontSize: '12px', padding: 0 }"
                border
                stripe
              >
                <el-table-column
                  v-for="(item, index) in columns"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                >
                  <template slot-scope="scope">
                    {{ scope.row[item.prop] || '-' }}
                  </template>
                </el-table-column>
            </el-table>
            </div>
          </div>
          <div class="image-footer">
            <div class="image-footer-tips">
              <span class="image-footer-tips-title">＊购买须知：</span><br/>
              <span>{{ form.tips || '***' }}</span>
            </div>
            <div class="image-footer-eqcode">
              <img :src='erCodeImage' alt="">
              <p>扫码进店</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    <edit-text @submitText='submitText' @cancle='hiddenDialog' :form='form' :visiable='visiable' />
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { getCookie } from '@/assets/js/helper.js'
import { getShareMiniCode } from '@/assets/js/common.js'
import { wholesaleProductPriceList, wholesaleProductPriceListSave } from '@/assets/js/Api.js'
import editText from './editText'
import domtoimage from 'dom-to-image'
export default {
  data () {
    return {
      date: '',
      tableNum: '3',
      erCodeImage: '',
      form: {
        title: '',
        tips: ''
      },
      oldForm: {
        title: '',
        tips: ''
      },
      data: [],
      visiable: false,
      columns: [{
        label: '商品信息',
        prop: 'productTitle',
        width: 336
      }, {
        label: '全新',
        prop: 'qxPrice',
        width: 60
      }, {
        label: '充新',
        prop: 'cxPrice',
        width: 60
      }, {
        label: '靓机',
        prop: 'ljPrice',
        width: 60
      }, {
        label: '小花',
        prop: 'xhPrice',
        width: 60
      }]
    }
  },
  created () {
    this.getEqCode();
    this.getProductList();
  },
  computed: {

  },
  methods: {
    getProductList () {
      wholesaleProductPriceList().then(res => {
        const { data, code } = res;
        if (code == 0) {
          const { date, quotation, tips, title } = data;
          //todo 修改data数据和form的数据
          this.data = quotation;
          this.date = date;
          this.form.tips = tips;
          this.form.title = title;
          this.oldForm = Object.assign({}, this.form);
        }
      })
    },
    getListData (index, data) {
      const len = data.length;
      let line = 0;
      const obj = {
        productTitle: '',
        qxPrice: '',
        cxPrice: '',
        ljPrice: '',
        xhPrice: ''
      };

      line = Math.ceil(len / 2);
      const num =  len % 2;
      if (num != 0) {
        data.push(obj);
      }
      if (index == 1) {
        return data.slice(0, line);
      }
      if (index == 2) {
        return data.slice(line, len);
      }
    },
    convert () {
      if (this.form.title == '' || this.form.tips == '') {
        return this.$message({
          message: '请先编辑报价单的标题和购买须知！',
          type: 'error',
          duration: 5000
        });
      }
      const nowTime = new Date().toLocaleString();
      const filename = this.form.title + nowTime;

      const dom = document.querySelector("#capture");
      domtoimage.toJpeg(dom).then(dataUrl => {
          const alink = document.createElement('a');
          alink.href = dataUrl;
          alink.download = filename;//图片名称
          const event = new MouseEvent('click', {bubbles: true, cancalable: true, view: window});
          alink.dispatchEvent(event);
      });
    },
    getEqCode () {
      const zzuid = getCookie('uid');
      const url = `https://m.zhuanzhuan.com/u/bmshop/share/shop?userId=${zzuid}`
      getShareMiniCode({
        url: encodeURIComponent(url)
      }, '1000', '1000').then(res => {
        const { picUrl } = res.respData;
        this.erCodeImage = `https://pic3.zhuanstatic.com/zhuanzh/${picUrl}`
      })
    },
    showDialog () {
      this.visiable = true;
    },
    hiddenDialog () {
      this.form = Object.assign({}, this.oldForm);
      this.visiable = false;

    },
    submitText (form) {
      const { title, tips } = form;
      if (title == '' || tips == '') {
        return this.$message({
          message: '请先编辑报价单的标题和购买须知！',
          type: 'error',
          duration: 5000
        });
      }
      if (title.length > 30) {
        return this.$message({
          message: '标题文字长度不能超过30个字',
          type: 'error',
          duration: 5000
        });
      }
      if (tips.length > 300) {
        return this.$message({
          message: '购买须知文字长度不能超过300个字',
          type: 'error',
          duration: 5000
        });
      }
      wholesaleProductPriceListSave(form).then(res => {
        const { code, data, msg } = res;
        if (code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.visiable = false;
          this.form = form;
        } else {
          this.$message({
            message: msg,
            type: 'error'
          });
        }
      });

    }
  },
  components: {
    editText
  }
}
</script>

<style lang="scss" scoped>
.product-price-list-warp {
  width: 100%;
  background: #f8f8f8;

  &-edit {
    overflow-x: scroll;
    margin: 16px;
    padding: 14px 30px;
    background: #fff;
  }
}
.header {
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.title {
  min-height: 36px;
  margin: 10px 240px 18px 0;
}
.btns {
  float: right;
  line-height: 60px;
}
.tips {
  white-space: pre;
  min-height: 100px;
}
.image {
  // padding-left: 40px;
  width: 1158px;
  &-header {
    height: 90px;
    background: #fff url('./bg.png') no-repeat center;
    background-size: cover;
    color: #fff;
    text-align: center;
    line-height: 90px;
    font-weight: bold;
    font-size: 28px;

    span {
      font-size: 20px;
      font-weight: normal;
    }
  }
  &-content {
    font-size: 0;
    &-null {
      text-align: center;
      line-height: 80px;
      color: #6e6e6e;
      font-size: 16px;
      border: 1px solid #e2e2e2;
      background: #fff;
    }
    &-header {
      line-height: 34px;
      background: #CAEEFF;
      text-align: center;
      font-size: 16px;
      &-cell{
        background: red;
      }
    }
  }
  &-footer {
    background: #fff;
    font-size: 0;
    border: 1px solid #e6e6e6;
    &-tips {
      display: inline-block;
      vertical-align: middle;
      width: 960px;
      min-height: 140px;
      background: #f9f9f9;
      font-size: 16px;
      white-space: pre;
      color: #6f6f6f;
      padding: 10px 20px;
      &-title {
        color: red;
      }
      &-con {
        display: block;
        margin-left: 18px;
      }
    }
    &-eqcode {
      display: inline-block;
      text-align: center;
      margin-left: 40px;
      vertical-align: middle;
      img {
        width: 100px;
        height: 100px;
      }
      p {
        font-size: 14px;
      }
    }
  }
}
.image-content-header-cell {
  background: red;
}
</style>


