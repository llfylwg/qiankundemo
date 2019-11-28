<template>
  <el-dialog title="报价单配置" :visible="visiable" :show-close="false">
    <el-form :modal="form">
      <el-form-item label="标题" required>
        <el-input v-model="form.title" placeholder="此处为标题区，可点击编辑按钮输入（例如：转转批发二手手机报价单）"/>
      </el-form-item>
      <el-form-item label="购买须知" required>
        <el-input type="textarea" :rows="3" v-model="form.tips" placeholder="此处为购买须知区，可点击编辑按钮进行注意事项及其他文案的描述"/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handledialog('cancle')">取 消</el-button>
      <el-button type="primary" @click="handledialog('sure')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props:[ 'form', 'visiable' ],
  data () {
    return {}
  },
  methods: {
    handledialog (name) {
      if (name == 'cancle') {
        console.log('-----', this.form);
        return this.$emit('cancle');
      }
      return this.$emit('submitText', this.form);
    }
  }
}
</script>