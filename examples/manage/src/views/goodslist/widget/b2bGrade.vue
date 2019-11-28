<template>
  <div>
    <template v-if="optData.b2bGradeEditable && isB2bSeller">
      <div class="edit" v-if="!optData.b2bGradeId" @click="change">
        <span class="el-icon-edit"></span>
      </div>
    </template>
    <div v-else>
      {{optData.b2bGradeName || '-'}}
    </div>
  </div>
</template>

<script>
import { getCookie } from '@/assets/js/helper'
export default {
  props: {
    optData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    isB2bSeller () {
      return getCookie('isB2bSeller') == 1
    }
  },
  methods: {
    change () {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
