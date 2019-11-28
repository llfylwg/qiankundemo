<template>
  <el-row>
    <el-col :span="12">
      <Select
        form-key="province"
        @change="change"
        :list="provinceList"
        placeholder="选择省份/直辖市"
        v-model="addr.province"
      />
    </el-col>
    <el-col :span="12">
      <Select
        form-key="city"
        @change="change"
        :list="cityList"
        placeholder="选择市区"
        v-model="addr.city"
      />
    </el-col>
    <el-col v-if="!hideArea" :span="12">
      <Select
        form-key="area"
        @change="change"
        :list="areaList"
        :reset="areaFLag"
        placeholder="选择区域"
        v-model="addr.area"
      />
    </el-col>
  </el-row>
</template>
<script>
import { ajax } from '../lib/ajax.js'
import Select from './select.vue'
export default {
  components: {
    Select
  },
  props: {
    initData: {
      type: Object,
      default: () => ({
        province: '',
        city: '',
        area: ''
      })
    },
    hideArea: Boolean
  },
  data: () => ({
    addr: {
      province: '',
      city: '',
      area: ''
    },
    provinceList: [],
    cityList: [],
    areaList: []
  }),
  watch: {
    initData: {
      handler() {
        this.setDefaultProvince()
      },
      deep: true
    },
    'addr.province': {
      handler(val) {
        this.setDefaultCity()
        this.getList('city', val)
      }
    },
    'addr.city': {
      handler(val) {
        this.getList('area', val)
      }
    }
  },
  created() {
    this.getList('province', 0)
  },
  methods: {
    getList(type, id) {
      ajax('bm/transfer/merchant/selectOptions', {
        parentLocalId: id,
        key: 'location'
      }).then(res => {
        const data = res.data
        switch (type) {
          case 'province':
            this.provinceList = this.formatKV(data.location)
            break
          case 'city':
            this.cityList = this.formatKV(data.location)
            break
          case 'area':
            this.areaList = this.formatKV(data.location)
            break
          default:
            break
        }
      })
    },
    formatKV(data) {
      if (!data) return []
      return data.map(cur => {
        const { code, desc } = cur
        return {
          id: code,
          name: desc
        }
      })
    },
    change(data) {
      this.addr = Object.assign({}, this.addr, data)
      this.$emit('change', this.addr)
    },
    setDefaultProvince() {
      Object.assign(this.addr, { province: this.initData.province })
    },
    setDefaultCity() {
      Object.assign(this.addr, { city: this.initData.city })
    }
  }
}
</script>
