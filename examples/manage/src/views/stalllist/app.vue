<template lang="html">
  <div class="goodslist-wrap">
    <section class="head-box">
      <!-- 筛选项 -->
      <h-filter @search="setFilter" ref="hfilter"></h-filter>
    </section>

    <div class="table-box">
      <buttons @downloadQrCode="showQRCode" />

      <!-- 列表 -->
      <h-table
          :isLoading="isLoading"
          :listData="listData"
          :listOPs="listOPs"
          :listProps="listProps"
          :pageData="pageData"
          :selection="true"
          :total="total"
          @onCurrent="handleCurrentChange"
          @onSelect="onSelect"
          @onSize="handleSizeChange"
          size="mini" v-if="tableShow">

        <template slot="operations" slot-scope="scope">
          <!-- 操作 -->
          <opts :optData="scope.rowData" @handleClick="handleClick"></opts>
        </template>

      </h-table>
    </div>
    <edit-dialog
      :dialogFormVisible="dialogFormVisible"
      :formData="formData"
      @closeDialog="closeDialog"
      @submitDialog="submitDialog"
    />
    <el-dialog :visible="isShowQrCode" @close="closeQrCode" :show-close="false" width="400px">
      <div class="qrcode">
        <img :src="qrCodeUrl" />
      </div>
    </el-dialog>
  </div>
  <!--<a href="" id="downImage" ></a>-->
</template>

<script>
  import hTable from 'sub/component/Table'
  import componentsMixins from '../../components/page/stalllist/componentsMixins.js'
  import mixin from '../../components/tableMixin.js'
  import * as tabCofigData from './tabsTitle.js'
  import { stallUpdate, screenShots, getFEConf } from '@/assets/js/Api'
  import { getCookie, downloadIamge } from '@/assets/js/helper'

  export default {
    components: {
      hTable
    },
    mixins: [mixin, componentsMixins],
    data () {
      let data = {
        listProps: tabCofigData['allData'],
        listOPs: tabCofigData['allOpts'],
        listApiName: 'partner/stall/list',
        tableShow: true,
        selectList: [],
        currentOpt: {},
        changeInventoryShow: false,
        changeBatchPriceShow: false,
        soldOutShow: false,
        goSaleShow: false,
        exportPriceModalShow: false,
        dialogFormVisible: false,
        effectAgents: [],
        formData: {},
        qrCodeUrl: '',
        isShowQrCode: false
      }
      return data
    },
    methods: {
      closeQrCode () {
        this.isShowQrCode = false
      },
      async getEffectAgent(){
        if (!this.effectAgents.length) this.effectAgents = (await this.$http.get('/partner/agent/effectAgents')).data
      },
      showQRCode () {
        const eid = getCookie('eid')
        const euid = getCookie('groupUid')
        const mUrl = `https://m.zhuanzhuan.com/u/store-partner/ally/qrcode?eid=${eid}&euid=${euid}`
        // const mUrl = `https://m.zhuanzhuan.com/u/bmshop/share/shop-poster?userId=36112147419926&id=`
        // this.qrCodeUrl = `${api}${encodeURIComponent(mUrl)}`
        // this.isShowQrCode = true
        screenShots({
          url: mUrl
          // noauth: 1
        }).then(resp => {
          console.log('screenShots: ', resp)
            const { respCode, respData } = resp
            if (respCode == 0) {
              const { posterImg } = respData
              const url = `https://pic3.zhuanstatic.com/zhuanzh/${posterImg}`
              const name = '店铺海报'
              downloadIamge({ url, name })
            }
        })
        // const keys = 'store-partner-poster'
        // getFEConf({ keys }).then(resp => {
        //   console.log('getFEConf: ', resp)
        //   const { respData, respCode } = resp
        //   if (respCode == 0) {
        //     const partner = respData.filter(item => {
        //       return item.eid == eid
        //     })[0]
        //     const url = partner && partner.poster || ''
        //     const name = partner && partner.name || '分享海报'
        //     downloadIamge({ url, name })
        //   }
        // })
      },
      handleClick (data, {code}) {
        // 操作区域选项点击
        this.getEffectAgent();
        this.formData = data
        this.dialogFormVisible = true
      },
      closeDialog () {
        this.dialogFormVisible = false
      },
      updateValidate (form) {
        if (!form.stallId) {
          this.$message.error('门店ID错误')
          return false
        }
        if (!form.stallName) {
          this.$message.error('门店名称不能为空')
          return false
        }
        if (!form.managerName) {
          this.$message.error('门店店长不能为空')
          return false
        }
        if (!form.contactNumber) {
          this.$message.error('手机号码不能为空')
          return false
        }
        if (!(/^1[23456789]\d{9}$/.test(form.contactNumber))) {
          this.$message.error('手机号码格式不正确')
          return false
        }
        if (!form.address) {
          this.$message.error('详细地址不能为空')
          return false
        }
        return true
      },
      submitDialog (form) {
        if (!this.updateValidate(form)) return
        return stallUpdate(form).then(resp => {
          const { data, code, msg } = resp
          if (code == 0 && data) {
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: msg || '修改成功',
              onClose () {
                location.reload()
              }
            })
            return
          }
          return this.$message.error(msg || '修改信息错误')
        })
      },
      onSelect (n) {
        // 多选选中事件
        this.selectList = n
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goodslist-wrap {
    width: 100%;
    background: #F8F8F8;
    // overflow-x: auto;
  }

  .head-box {
    padding: 20px 24px 0;
    box-sizing: border-box;
    background: #FFF;
  }

  .split-line {
    line-height: 1px;
    height: 1px;
    margin: 10px 0;
    border-bottom: 0.1rem solid rgba(221, 221, 221, 0.8);
  }

  .link {
    color: #409EFF;
  }

  .tips-icon {
    display: inline-block;
    height: 100%;
    margin-left: 0;
  }

  .nav-icon {
    cursor: pointer;
    font-size: 10px;
  }

  .detail-icon {
    color: #909399;
  }

  .tip-content-box {
    background: red;
  }

  .table-box {
    background: #FFF;
    margin: 16px 16px 0;
    padding: 24px 32px 18px;
    // height: 100vh;
  }
  .qrcode {
    width: 300px;
    height: 300px;
    margin: 0 auto 20px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
</style>
<style lang="scss">
  .el-tooltip__popper.is-light {
    border-color: #909399 !important;
  }
</style>
