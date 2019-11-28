<template lang="html">
  <div class="sale-publish-main">
    <div class="sale-publish-main-title">商品发布</div>
    <panel title="商品规格">
      <div class="panel-cxt">
        <el-form :inline="true" :model="form" label-width="80px" ref="form">
          <el-form-item label="分类：">
            <!--<el-input v-model="form.cateId"></el-input>-->
            <Select
                :clearable="false"
                :dataMap="map"
                :list="infos.category1 && infos.category1.values || []"
                @input="(valueId) => getItemValue(valueId, 'category2', 'category1')"
                placeholder="请选择"
                v-model="form.category1"
            />
          </el-form-item>
          <el-form-item label="品牌：">
            <Select
                :clearable="false"
                :dataMap="map"
                :disabled="!form.category1"
                :list="infos.category2 && infos.category2.values || []"
                @input="(valueId) => getItemValue(valueId, 'category3', 'category2')"
                placeholder="请选择"
                v-model="form.category2"
            />
          </el-form-item>
          <el-form-item label="型号：">
            <Select
                :clearable="false"
                :dataMap="map"
                :disabled="!form.category2"
                :list="infos.category3 && infos.category3.values || []"
                @input="(valueId) => getItemValue(valueId, 'capacity|color|memory', 'category3')"
                placeholder="请选择"
                v-model="form.category3"
            />
          </el-form-item>
          <el-form-item label="运行内存：" label-width="108px">
            <Select
                :clearable="false"
                :dataMap="map"
                :disabled="!form.category3 || !(infos.memory && infos.memory.values && infos.memory.values.length > 0)"
                :list="infos.memory && infos.memory.values || []"
                placeholder="请选择"
                v-model="form.memory"
            />
          </el-form-item>
          <el-form-item label="容量：">
            <Select
                :clearable="false"
                :dataMap="map"
                :disabled="!form.category3"
                :list="infos.capacity && infos.capacity.values || []"
                placeholder="请选择"
                v-model="form.capacity"
            />
          </el-form-item>
          <el-form-item label="渠道：">
            <Select
                :clearable="false"
                :dataMap="map"
                :list="infos.channel && infos.channel.values || []"
                @input="(valueId) => getItemValue(valueId, 'simLock', 'channel')"
                placeholder="请选择"
                v-model="form.channel"
            />
          </el-form-item>
          <el-form-item label="颜色：">
            <Select
                :clearable="false"
                :dataMap="map"
                :disabled="!form.category3"
                :list="infos.color && infos.color.values || []"
                placeholder="请选择"
                v-model="form.color"
            />
          </el-form-item>
          <el-form-item :label="infos.warranty && infos.warranty.name + '：'" label-width="94px">
            <el-radio-group v-model="form.warranty">
              <el-radio
                  :key="index"
                  :label="item.valueId"
                  v-for="(item, index) in (infos.warranty && infos.warranty.values)"
              >{{item.valueText}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否有锁：" label-width="108px"
                        v-show="form.channel == 1080629 && infos.simLock && infos.simLock.values && infos.simLock.values.length">
            <el-radio-group v-model="form.simLock">
              <el-radio
                  :key="index"
                  :label="item.valueId"
                  v-for="(item, index) in (infos.simLock && infos.simLock.values)"
              >{{goodSpecs[item.valueId]}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </panel>
    <panel title="商品类型">
      <div class="panel-cxt">
        <el-form :inline="true" :model="form" label-width="80px" ref="form">
          <div class="panel-cxt-title">商品类型：<span>批发卖场仅支持新机和功能完好的二手机</span></div>
          <el-form-item label-width="136px">
            <el-radio-group @change="(valueId) => getItemValue(valueId, 'trait|level', 'usedType')"
                            v-model="form.usedType">
              <el-radio
                  :key="index"
                  :label="item.valueId"
                  v-for="(item, index) in (infos.usedType && infos.usedType.values)"
              >{{item.valueText}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="panel-cxt-title">是否有配件：</div>
          <el-form-item label-width="136px">
            <el-radio-group v-model="form.accessories">
              <el-radio
                  :key="index"
                  :label="item.valueId"
                  v-for="(item, index) in (infos.accessories && infos.accessories.values)"
              >{{item.valueText}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="panel-cxt-title">商品特点：</div>
          <el-form-item label-width="136px">
            <el-radio-group v-model="form.trait">
              <el-radio
                  :key="index"
                  :label="item.valueId"
                  v-for="(item, index) in (infos.trait && infos.trait.values)"
              >{{ item.valueText }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="panel-cxt-title">商品等级：（选项为可售范围）</div>
          <el-form-item label-width="136px">
            <el-radio-group v-model="form.level">
              <div class="panel-cxt-radio" v-for="(item, index) in (infos.level && infos.level.values)">
                <el-radio
                    :key="index"
                    :label="item.valueId"
                >{{ goodsType[item.valueId] }}
                </el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </panel>
    <panel title="销售信息">
      <div class="panel-cxt">
        <el-form :inline="true" :model="form" label-position="left" label-width="86px" ref="form">
          <el-row>
            <el-col :span="6">
              <el-form-item label="批发价：">
                <el-input v-model="form.price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <div class="input-unit">元/台</div>
            </el-col>
            <!--<el-col :span="8">-->
            <!--<div class="input-text">建议售价：5600 元</div>-->
            <!--</el-col>-->
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="库存数量：">
                <el-input :disabled="productId != ''" v-model="form.stock"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <div class="input-unit">台</div>
            </el-col>
            <el-col :span="8">
              <div class="input-desc">(库存数量须大于0，库存售罄后会自动下架该商品)</div>
            </el-col>
          </el-row>
          <!--<el-row>-->
          <!--<el-col :span="6">-->
          <!--<el-form-item label="起售数量：">-->
          <!--<el-input v-model="form.num"></el-input>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="1">-->
          <!--<div class="input-unit">台</div>-->
          <!--</el-col>-->
          <!--<el-col :span="8">-->
          <!--<div class="input-desc">(设置起售数量后，买家购买数量须大于等于起售数量)</div>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row>
            <el-col :span="7">
              <el-form-item label="快递方式：">
                <el-radio-group v-model="form.isFreight">
                  <el-radio label="0">卖家承担运费</el-radio>
                  <el-radio label="1">买家线上支付</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input :disabled="isDisabledFeight" v-model="form.freight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <div class="input-unit">元</div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </panel>
    <panel title="图文详情">
      <div class="panel-cxt">
        <div class="panel-cxt-title">
          <el-switch v-model="form.useSamplePic" :disabled="!form.level">
          </el-switch>
          <span>
            选中后默认以等级样例图作为商品图片展示给用户
          </span>
        </div>
      </div>

      <div class="panel-cxt">
        <template v-if="!form.useSamplePic">
          <div class="panel-cxt-title">商品图片：请至少添加商品正面和背面图片</div>
          <div class="panel-cxt-pics">
            <div class="panel-cxt-pics-item" v-for="(item, index) in ['正面图片', '背面图片', '其他图片', '其他图片', '其他图片']">
              <pic-seat :pic="pics[index]" :title="item" @del="deletePic">
                <el-upload
                    :before-upload="beforeUpload"
                    :http-request="upload"
                    :show-file-list="false"
                    accept="jpg"
                    action=""
                    class="panel-cxt-pics-item-uploader"
                >
                  <div class="panel-cxt-pics-item-uploader-cxt"></div>
                </el-upload>
              </pic-seat>
            </div>
          </div>
        </template>
        <div class="panel-cxt-title">卖家有话说：</div>
        <div class="panel-cxt-textarea">
          <el-input placeholder="可补充商品详细信息、支持快递、店铺售后服务等信息" rows="5" type="textarea" v-model="form.context"></el-input>
        </div>
      </div>
    </panel>
    <panel title="卖家承诺">
      <div class="panel-cxt">
        <el-form :inline="true" :model="form" label-position="left" label-width="86px" ref="form">
          <div v-for="(item, index) in others">
            <div class="panel-cxt-title">{{item.paramName}}：</div>
            <div class="panel-cxt-checkbox">
              <el-checkbox-group v-model="form[item.formName]">
                <el-checkbox :key="value.valueText" :label="value.valueId" :name="item.formName"
                             v-for="value in item.values">{{value.valueText}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form>
      </div>
    </panel>
    <div class="sale-publish-main-button" v-if="productId">
      <el-button @click="save" class="sale-publish-main-button-btn" type="primary">保存修改</el-button>
      <el-button @click="save('add')" class="sale-publish-main-button-btn" type="primary">新增发布</el-button>
    </div>
    <div class="sale-publish-main-button" v-else>
      <el-button @click="save" class="sale-publish-main-button-btn" type="primary">确认发布</el-button>
    </div>
  </div>
</template>

<script>
  import {
    wholesaleProductInit,
    wholesaleGetSkuItemValue,
    wholesaleGetOtherParams,
    wholesaleSave
  } from '@/assets/js/Api'
  import PicService from '@/assets/js/picService'
  import Select from 'sub/component/select2'
  import componentsMixins from '../../components/page/wholesalepublish/componentsMixins.js'
  import { goodsType, goodSpecs } from './config'

  export default {
    components: {Select},
    mixins: [componentsMixins],
    data () {
      return {
        form: {
          service: [],
          specialDesc: [],
          useSamplePic: false
        },
        infos: {},
        samplePics: '',
        map: {
          label: 'valueText',
          value: 'valueId'
        },
        items: [],
        picSer: null,
        pics: [],
        others: [],
      }
    },
    computed: {
      isDisabledFeight () {
        return !this.form.isFreight || this.form.isFreight == 0
      },
      goodsType () {
        return goodsType
      },
      goodSpecs () {
        return goodSpecs
      },
      productId () {
        return this.$route.query.productId || ''
      },
      isEdit () {
        return !!this.$route.query.productId
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      'form.useSamplePic' (val) {
        if (val) {
          this.getSampleList()
        }
      }
    },
    methods: {
      initData (data) {
        const {context, freight, stock, items} = data
        let isFreight = '0'
        if (freight && freight != '0') {
          isFreight = '1'
          this.form.freight = freight
        }
        this.form.useSamplePic = data.useSamplePic
        const price = data.price.replace(',', '')
        const service = data.service.split(',').map(item => +item)
        const specialDesc = data.specialDesc.split(',').map(item => +item)
        this.items.forEach(item => {
          this.form[item.shotName] = item.selectedValueId
        })
        this.pics = data.pics.split('|')
        const skuItems = [
          {valueId: this.form.category1, itemShotName: 'category2'},
          {valueId: this.form.category2, itemShotName: 'category3'},
          {valueId: this.form.category3, itemShotName: 'color'},
          {valueId: 1080629, itemShotName: 'simLock'},
          {valueId: this.form.category3, itemShotName: 'memory'},
          {valueId: this.form.category3, itemShotName: 'capacity'},
          {valueId: this.form.usedType, itemShotName: 'level'},
          {valueId: this.form.usedType, itemShotName: 'trait'}
        ]
        skuItems.forEach(({valueId, itemShotName}) => {
          this.getItemValue(valueId, itemShotName)
        })
        this.form = Object.assign({}, this.form, {
          context, isFreight, price, service, specialDesc, stock,
          isAgree1: !!this.productId,
          isAgree2: !!this.productId
        })
        // 等级旧数据更新
        if (this.form.level) {
          const isNew = this.infos.level.values.some(item => item.valueId === this.infos.level.selectedValueId)
          this.form.level = isNew ? this.form.level : ''
        }
        console.log(this.form, data)
      },
      getInitInfo () {
        const productId = this.productId
        return wholesaleProductInit({productId}).then(resp => {
          const {data, code} = resp
          if (code == 0) {
            this.items = data.items && data.items.length && data.items || []
            this.items.forEach(item => {
              if (item.shotName && !this.infos[item.shotName]) {
                this.$set(this.infos, item.shotName, item)
              }
            })
            this.initData(data)
          }
        })
      },
      getOtherParams () {
        return wholesaleGetOtherParams().then(resp => {
          const {data, code} = resp
          if (code == 0) {
            this.others = data
          }
        })
      },
      getItemValue (valueId, valueBindWith, key) {
        // console.log(valueId, valueBindWith)
        const values = valueBindWith.split('|')
        this.refreshSku(key)
        values.forEach(value => {
          wholesaleGetSkuItemValue({valueId, itemShotName: value}).then(resp => {
            const {data, code} = resp
            if (code == 0) {
              this.$set(this.infos[value], 'values', data)
            }
          })
        })
      },
      refreshSku (key) {
        const dist = {
          category1: ['category2', 'category3', 'capacity', 'color', 'memory'],
          category2: ['category3', 'capacity', 'color', 'memory'],
          category3: ['capacity', 'color', 'memory'],
          channel: ['simLock'],
          usedType: ['trait', 'level']
        }
        if (!key && !dist[key]) return
        dist[key].forEach(item => {
          // this.form[item] = ''
          delete this.form[item]
        })
      },
      isInteger (num) {
        if (!num && num !== 0) return false
        num = Number(num)
        return Math.floor(num) === num
      },
      beforeUpload (file) {
        console.log(file)
        const {type} = file
        const isImageReg = /image/
        if (!isImageReg.test(type)) {
          this.$message.error('图文详情，请上传图片')
          return false
        }
      },
      upload (res) {
        console.log(res)
        if (this.pics.length >= 5) return
        this.picSer.upload(res.file, (err, data) => {
          if (err) {
            console.log(err)
          } else {
            // console.log('upload data: ', data)
            const pic = data.replace('/zhuanzh/', '')
            this.pics.push(pic)
          }
        }, (loaded, total) => {
          // loaded 为已经上传的字节数，total 为还未上传的字节数
          console.log('上传进度：')
          console.log(loaded, total)
        })
      },
      deletePic (pic) {
        this.pics = this.pics.filter(item => (pic != item))
      },
      verify () {
        const {
          category1, category2, category3, memory, capacity, channel, color, warranty, simLock,   //商品规格
          usedType, accessories, trait, level,    //商品类型
          price, stock, isFreight, freight,    // 销售信息
          context,    // 图文详情
          service, specialDesc, isAgree1, isAgree2    // 卖家承诺
        } = this.form
        const {isInteger, isEdit} = this
        if (!category1 || !category2 || !category3 || !capacity || !channel || !color || !warranty) {
          this.$message.error('商品规格信息，请填写完整')
          return false
        }
        if ((this.infos.memory && this.infos.memory.values && this.infos.memory.values.length > 0) && !memory) {
          this.$message.error('商品规格信息，请填写完整')
          return false
        }
        if (channel == '1080629' && !simLock) {     // 渠道为其他版本时，是否有锁必填
          this.$message.error('请选择sim卡，是否有锁')
          return false
        }
        if (!usedType || !accessories || !trait || !level) {
          this.$message.error('商品类型信息，请填写完整')
          return false
        }
        if (!price || !isFreight || !(isEdit && stock >= 0 || stock > 0)) {
          this.$message.error('商品销售信息，请填写完整')
          return false
        }
        if (isFreight != 0 && !freight) {     // 运费买家支付时，需要填写具体运费（元/单）
          this.$message.error('请填写具体运费金额')
          return false
        }
        if (!isInteger(price) || !isInteger(stock) || (Number(isFreight) != 0 && !isInteger(freight))) {
          this.$message.error('价格或库存数量需要为整数')
          return false
        }
        if (isNaN(Number(price)) || isNaN(Number(stock)) || (isFreight != 0 && isNaN(Number(freight)))) {
          this.$message.error('销售信息的金额或者数量，请填写数字')
          return false
        }
        if (!context) {
          this.$message.error('商品图文详情，请填写完整')
          return false
        }
        if (this.form.useSamplePic) {
          if (!this.samplePics) {
            this.$message.error('请上传等级样例图后再发布')
            return false
          }
        } else {
          if (this.pics.length < 2) {
            this.$message.error('商品图片请上传至少2张')
            return false
          }
        }
        if (!service || !specialDesc) {
          this.$message.error('商品卖家承诺信息，请填写完整')
          return false
        }
        return true
      },
      save (type) {
        const isVerified = this.verify()
        if (!isVerified) return

        const service = this.form.service.join(',')
        const specialDesc = this.form.specialDesc.join(',')
        this.form.pics = this.form.useSamplePic ? this.samplePics : this.pics.join('|')
        this.form.freight = this.form.isFreight == 0 ? 0 : this.form.freight
        this.form.simLock = this.form.channel != '1080629' ? '' : this.form.simLock

        const {
          category1, category2, category3, memory, capacity, channel, color, warranty, simLock,   //商品规格
          usedType, accessories, trait, level,    //商品类型
          price, stock, isFreight, freight,    // 销售信息
          context, pics, useSamplePic,   // 图文详情
          isAgree1, isAgree2    // 卖家承诺
        } = this.form
        const productId = type === 'add' ? '' : this.productId
        const items = [
          {shotName: 'category1', selectedValueId: category1},
          {shotName: 'category2', selectedValueId: category2},
          {shotName: 'category3', selectedValueId: category3},
          {shotName: 'capacity', selectedValueId: capacity},
          {shotName: 'color', selectedValueId: color},
          {shotName: 'memory', selectedValueId: memory},
          {shotName: 'channel', selectedValueId: channel},
          {shotName: 'warranty', selectedValueId: warranty},
          {shotName: 'simLock', selectedValueId: simLock},
          {shotName: 'usedType', selectedValueId: usedType},
          {shotName: 'accessories', selectedValueId: accessories},
          {shotName: 'trait', selectedValueId: trait},
          {shotName: 'level', selectedValueId: level},
        ]
        const params = {
          productId, price, stock, freight, pics, context, service, specialDesc, items, useSamplePic
        }
        wholesaleSave(params).then(resp => {
          const {code, data} = resp
          if (code == 0) {
            if (type !== 'add') {
              this.$router.push({name: 'wholesalegoodslist'})
            } else {
              this.$message.success('新增成功')
            }
          }
        })
      },
      getSampleList () {
        this.$http.get('/wholesale/product/samplePicList').then(res => {
          res.data.forEach(item => {
            if (item.id == this.form.level) {
              this.samplePics = item.pics || ''
              return
            }
          })
        })
      },
      init () {
        this.picSer = new PicService('/zhuanzh/')
        this.getInitInfo()
        this.getOtherParams()
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
