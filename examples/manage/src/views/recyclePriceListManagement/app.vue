<template>
  <div class="recycle-price-list">
    <p class="el-header-title">回收报价单</p>
    <div class="content">
      <el-alert
        title="重新上传报价单后，之前的将会被覆盖无法找回，请谨慎上传"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <zz-table
        ref="zzTable"
        :columns="columns"
        :showPagination="false"
        apiName="partner/offerSheet/getRecyclePriceList"        
      >
        <template slot="action" slot-scope="{ row }">
          <el-upload
            class="upload"
            :show-file-list="false"
            action=""
            :before-upload="beforeUpload"
            :http-request="res => upload(res, row.brandId)"
          >
            <el-button size="mini" type="primary">上传报价单</el-button>
          </el-upload>
          <el-button v-if="row.offerSheetImage" size="mini" type="success" @click="showRecycleDialog(row.offerSheetImage)">查看报价单</el-button>
        </template>
        <template slot="brand" slot-scope="{ row }">
          <span class="brand-logo" :style="{backgroundImage: `url(${row.brandLogo})`}"></span>
          <span>{{ row.brandName }}</span>
        </template>
      </zz-table>
    </div>
    <div class="progress-dialog">
      <el-dialog 
        :visible="showDialog"
        :show-close="false"
        width="0"
      >
        <el-progress
          type="circle"
          :percentage="percentage"
          :color="colors"
          :width="200"></el-progress>
      </el-dialog>
    </div>
    <el-dialog
      :visible="recycleDialog"
      :before-close="closeRecycleDialog"
    >
      <img :src="priceListImage" style="width: 100%"/>
    </el-dialog>
  </div>
</template>
<script>
import PicService from '@/assets/js/picService'
import zzTable from '../../../submodules/component/zzTable'

import { saveOfferSheetImage } from '@/assets/js/Api'
export default {
  components: { zzTable },
  data () {
    return {
      priceListImage: '',
      picService: null,
      showDialog: false,
      recycleDialog: false, // 查看报价单的弹窗
      percentage: 0,
      columns: [
        { prop: 'brandId', label: 'id', width: 40 },
        { prop: 'brand', label: '品牌', width: 140, soltName: 'brand' },
        { prop: 'updateTime', label: '更新时间', width: 200 },
        { prop: 'action', label: '操作', soltName: 'action'}
      ],
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#6f7ad3', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#5cb87a', percentage: 100}
      ]
    }
  },
  created () {
    this.picService = new PicService('/zhuanzh/')
  },
  methods: {
    beforeUpload (file) {
      this.showDialog = true
    },
    upload (res, id) {
      this.picService.upload(res.file, (err, data) => {
        if (err) {
          this.$message({
            message: err,
            type: 'error'
          })
        } else {
          const img = data.split('/zhuanzh/')[1]
          this.showDialog = false
          this.percentage = 0
          this.postImageName({ img, id })
        }
      }, (loaded, total) => {
        // loaded 为已经上传的字节数，total 为还未上传的字节数
        console.log('上传进度：')
        console.log(loaded, total)
        this.percentage = Math.floor((loaded / total) * 100)
      })
    },
    postImageName (params) {
      // 将图片传给后端，并刷新页面
      saveOfferSheetImage(params).then(res => {
        console.log('=====res', res)
        const { code, msg } = res
        if (code == 0) {
          this.$refs.zzTable.fetchData();
          return this.$message({
            type: 'success',
            message: '上传成功'
          })
        }
        return this.$message({
          type: 'error',
          message: msg
        })
      })
    },
    showRecycleDialog (pic) {
      const url = 'https://pic3.zhuanstatic.com/zhuanzh/'
      this.recycleDialog = true
      this.priceListImage = url + pic
    },
    closeRecycleDialog () {
      this.recycleDialog = false
      this.priceListImage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.recycle-price-list {
  .content {
    overflow: hidden;
    padding: 16px 16px;
    margin: 0 16px;
    background: #fff;
    .upload {
      display: inline-block;
      margin-right: 10px;
    }
    .brand-logo {
      vertical-align: middle;
      display: inline-block;
      width: 50px;
      height: 50px;
      margin-right: 10px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .progress-dialog {
    /deep/ .el-progress__text {
      color: #fff;
    }
  }
}
</style>

