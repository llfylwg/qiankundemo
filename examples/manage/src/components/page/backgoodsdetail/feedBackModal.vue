<template lang="html">
  <el-dialog title="退货反馈" :visible.sync="dialogFormVisible" width="30%" :before-close="closeModal">
    <div class="mark-list-box">
  很抱歉给您带来的退货困扰，转转客服收到您的反馈后，会与您联系确认反馈信息并沟通解决退货问题。
    </div>

    <p class="feedlist-title">请选择您遇到的退货问题：</p>
    <el-select v-model="feedBackType" clearable  placeholder="请选择" size="medium" class="feedback">
        <el-option
          v-for="item in feedBackTypeList"
          :key="item.feedbackType"
          :label="item.feedbackTypeDesc"
          :value="item.feedbackType">
        </el-option>
    </el-select>
    <p class="feedlist-title">备注信息：</p>
    <el-input
      type="textarea"
      :rows="5"
      placeholder="请输入需要反馈的问题"
      v-model="textarea">
    </el-input>

    <div slot="footer" >
      <el-button type="primary" @click="sure" :disabled="canSend">提交反馈</el-button>
    </div>
</el-dialog>

</template>

<script>
import Select from 'sub/component/select2'
export default {
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  components: {
    Select
  },
  data () {
    return {
      dialogFormVisible: true,
      textarea: '',
      feedBackTypeList: [
        {
          type: '1',
          typeDesc: '你好'
        }
      ],
      feedBackType: '',
      feedBackContext: ''
    }
  },
  computed: {
    canSend () {
      return this.feedBackType ? false: true
    }
  },
  created () {
    this.$http.get('bizReturnPkg/feedBackType').then(res => {
      this.feedBackTypeList = res['data']
    })
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    },
    sure () {
      this.$http.get('bizReturnPkg/feedback', {
        bizRetrunPkgId: this.$route.query['id'],
        bizProductId: this.info['productId'],
        feedbackType: this.feedBackType,
        feedbackContext: this.textarea
      }).then(res => {
        this.$message({
          message: '问题反馈成功',
          type: 'success'
        });
        this.$emit('closeModal')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-tip{
  text-align: center;
  color: #C0C4CC;
}
.feedlist-title{
  margin-top: 20px;
  padding-bottom: 10px;
  font-weight: bold;
}
</style>
<style lang="scss">
  .feedback{
    width: 100%;
  }
</style>
