<template lang="html">
    <div class="">
        <p class="opt-box">
      <span :key="k" @click="handleClick(optData, i)" class="edit" size="mini" v-for="(i, k) in opts">{{i.name}}
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
                        name: '修改',
                        code: 'revise'
                    }
                ]
            }
        },
        created() {
            switch (this.optData.stateDesc) {
                case '生效中':
                    this.opts.push({
                        name: '关闭',
                        code: 'close'
                    }, {
                      name: '门店改绑',
                      code: 'changeBind'
                    });
                    break;
                case '已关闭':
                    this.opts.push({
                        name: '开启',
                        code: 'open'
                    });
                    break;
            }
        },
        methods: {
            handleClick(optData, option) {
                this.$emit(option.code, optData)
            }
        }
    }
</script>

<style lang="css">
</style>
