<template lang="html">
  <div class="buttons-wrap">
    <el-button 
      v-if="tabCode === 1000"
      size="mini" 
      @click.native="shipNotOne" 
      :disabled="disabledbtn"
    >
      批量发货
    </el-button>
    <el-button
      v-if="tabCode === 1000"
      size="mini" 
      @click.native="faceShipNotOne" 
      :disabled="disabledbtn"
    >
      批量面交
    </el-button>
   </div>
</template>

<script>
export default {
  components: {
  },
  computed: {
    disabledbtn () {
      let flag = false
      this.selectList.map(item => {
        // 有不是待退货的
        if(item.status !== 1000){
          flag = true
        }
      })
      return this.selectList.length ? flag : true
    },
    isSameAddress () {
      if ( this.selectList.length ) {
        let testAddress = this.selectList[0].returnAddress
        let flag = this.selectList.every(item => {
          return item.returnAddress === testAddress
        })
        return flag
      } else {
        return false
      }
    }
  },
  props: ['tabCode', 'buttonDisable', 'selectList'],
  data () {
    return {
    }
  },
  methods: {
    shipNotOne () {
      if (!this.isSameAddress) {
        this.$message.error('地址不同，无法批量发货')
      } else {
        this.$emit('showPiliangFaHuo')
      }
    },
    faceShipNotOne () {      
      this.$emit('showPiliangMianJiao')
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons-wrap{
  padding-bottom: 20px;
}
.upload-button{
  display: inline-block;
  margin: 0 10px;
}
</style>
