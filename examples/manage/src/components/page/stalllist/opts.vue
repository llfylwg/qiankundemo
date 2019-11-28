<template lang="html">
  <div class="">
    <p class="opt-box" >
      <span @click="handleClick(optData, i)" size="mini" class="edit"  v-for="(i, k) in opts" :key="k">{{i['name']}}
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
    },
    tabCode: {
      type: [Number, String, null],
      default: null
    }
  },
  data () {
    return {
      opts: [
        {
          name: '编辑',
          code: 'edit'
        }
      ]
    }
  },
  methods: {
      handleClick (...arg) {
      this.$emit('handleClick', ...arg)
    }
  }
}
</script>

<style lang="css">
</style>
