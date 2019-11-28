<template>
  <el-form 
    ref="form" 
    :inline="formOptions.inline || false" 
    :model="params" 
    @submit.native.prevent="searchHandler()"
    :size="formOptions.size || 'medium'"
    :rules="formOptions.rules || {}"
    :label-width="formOptions.labelWidth? formOptions.labelWidth + 'px' : ''">
    <el-form-item
      v-for="(form, index) in forms"
      :key="index"
      :label="form.label || ''"
      :rules="form.rules || []"
      :prop="form.prop"
    >
    <el-input
      v-if="form.itemType == 'input' || form.itemType == undefined"
      v-model="params[form.modelValue]"
      :placeholder="form.placeholder"
    />
    <el-select
      v-else-if="form.itemType == 'select'"
      v-model="params[form.modelValue]"
      :placeholder="form.placeholder"
      :clearable="form.clearable || false"
      :disabled="form.depend && !params[form.depend]"
      @change="(value) => selectItemChange(value, form)"
    >
      <div v-if="form.selectFetch">
        <el-option
          v-for="(option, optionIndex) in selectOptions[selectOptionPrefix + index]"
          :key="optionIndex + '_local'"
          :label="form.map ? option[form.map.label] : option.label"
          :value="form.map ? option[form.map.value] : option.value"
        >
        </el-option>
      </div>
      <div v-else>
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :label="form.map ? option[form.map.label] : option.label"
          :value="form.map ? option[form.map.value] : option.value"
        >
        </el-option>
      </div>
    </el-select>
    <el-date-picker
      v-else-if="form.itemType == 'data-range'"
      v-model="params[form.modelValue]"
      type="daterange"
      value-format="yyyy-MM-dd HH:mm:ss"
      :start-placeholder="form['timePlaceHolder'][0] || 开始日期"
      :end-placeholder="form['timePlaceHolder'][0] || 结束日期"
      :default-time="['00:00:00', '23:59:59']"
      @change="date => handleTimeRange(date, form)"
    ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="searchHandler"
      >
        {{ formOptions.submitBtnText || '提交' }}
      </el-button>
      <el-button
        v-if="formOptions.showResetBtn || true"
        @click="resetForm"
        >
        {{ formOptions.resetBtnText || '重置'}}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'zz-form',
  props: [ 'formOptions' ],
  data () {
    const { forms } = this.formOptions;
    const selectOptionPrefix = 'select-option-prefix'
    let params = {};
    let dataObj = {
      selectOptions: {}
    };
    let dependArray = [];
    let dependObj = {};
    
    // 循环生成params
    forms.forEach((v, i) => {
      v.modelValue = v.prop;
      if (v.itemType != 'data-range') {
        params[v.prop] = '';
      }
      
      //处理依赖关系
      if (v.depend) {
        dependArray.push(v.depend);
        dependObj[v.depend] = i;
      }

      // 下拉框是否要获取远程数据
      if (v.itemType === 'select') {
        const dataKey = selectOptionPrefix + i;
        dataObj.selectOptions[dataKey] = [];
        if (v.selectFetch && !v.depend) {
          const { url, params = {} } = v.selectFetch;
          this.getRemoteData(url, params).then(data => {
            const newOptions = v.options ? v.options.concat(data) : data;
            dataObj.selectOptions[dataKey] = newOptions;
          });
        }
      }
      if (v.itemType === 'data-range') {
        params[v.timeKeys[0]] = '';
        params[v.timeKeys[1]] = '';
      }
    });
    console.log('----forms', {
      forms,
      params,
      ...dataObj,
      dependArray,
      dependObj,
      selectOptionPrefix, //下拉框选项前缀
    });

    return {
      forms,
      params,
      ...dataObj,
      dependArray,
      dependObj,
      selectOptionPrefix, //下拉框选项前缀
    }
  },
  methods: {
    searchHandler () {
      this.getParams((error, params) => {
        if (!error) {
          console.log('---this.props', this.props);
          this.$emit('submitHandler', params);
          // const { submitHandler } = this;
          // if (submitHandler) {
          //   return submitHandler(params);
          // }
          // return console.error('未定义处理函数：submitHandler')
        }
      });
    },
    handleTimeRange (date, { prop, timeKeys }) {
      this.params[timeKeys[0]] = date[0];
      this.params[timeKeys[1]] = date[1];
      delete this.params[prop]
    },
    getParams (cb) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const { params } = this;
          if (cb) cb(null, params); 
        } else {
          if (cb) cb(new Error());
        }
      })
    },

    // 监听下拉框的onchange事件
    selectItemChange (value, form) {
      const { dependArray, dependObj, forms } = this;
      const index = dependObj[form.prop];
      this.params[form.prop] = value;

      if (value == '') {
        return this.params[forms[index].prop] = '';
      };
      // 如果存在被依赖
      if (dependArray.indexOf(form.prop) != -1 ) {
        // dependObj存的是有依赖的项对应的数组的下标
        const { prop, selectFetch, options } = forms[index];
        const { url, params } = selectFetch;
        const paramsKeys = Object.keys(params);
        let newParams = {};
        paramsKeys.forEach(item => {
          if (params[item] == 'depend') {
            newParams[item] = this.params[form.prop];
          } else {
            newParams[item] = params[item];
          }
        });
        this.getRemoteData(url, newParams).then(data => {
          const newOptions = options ? options.concat(data) : data;
          this.selectOptions[this.selectOptionPrefix + index] = newOptions;
        });
      };
    },
    // 重置按钮的处理函数
    resetForm () {
      this.$refs['form'].resetFields();
      // const { resetBtnCallback } = this;
      // if (resetBtnCallback) resetBtnCallback();
    },
    //获取远程下拉框数据
    getRemoteData (url, params) {
      return this.$http.get(url, params).then(resp => {
        const { code, data, msg } = resp;
        if (code != 0) {
          return console.error(`接口请求出错：${msg}`);
        }
        if (code == 0) {
          if (!Array.isArray(data)) {
            return console.error(`接口返回的字段：${data}不是一个数组`);
          }
          return data;
        }
      });
    }
  }
}
</script>
