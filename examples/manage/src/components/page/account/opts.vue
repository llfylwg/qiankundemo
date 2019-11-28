<template lang="html">
  <div class="">
    <p class="opt-box">
      <span :key="k" @click="emit(optData, i)" class="edit" size="mini" v-for="(i, k) in opts" v-if="optData.operations && optData.operations.indexOf(i.code) > -1">
        {{i.name}}
      </span>
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      optData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        opts: [
          {
            name: '余额管理',
            code: 'manageBalance'
          }, {
            name: '冻结',
            code: 'freeze'
          },
          {
            name: '解冻',
            code: 'unfreeze'
          },
          {
            name: '余额明细',
            code: 'detail'
          }
        ]
      }
    },
    created () {

    },
    methods: {
      emit (...arg) {
        this.$emit('handleClickToDetail', ...arg)
      }
    }
  }
</script>

<style lang="css">
</style>
