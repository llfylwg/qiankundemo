<template lang="html">
    <div class="">
        <p class="opt-box">
      <span :key="k" @click="showDetail(optData, i)" class="edit" size="mini" v-for="(i, k) in opts">{{i.name}}
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
        data() {
            return {
                opts: [
                    {
                        name: '查看详情',
                        code: 'detail'
                    }
                ]
            }
        },
        methods: {
            showDetail(data, option) {
                this.$emit(option.code, data)
            }
        }
    }
</script>

<style lang="css">
</style>
