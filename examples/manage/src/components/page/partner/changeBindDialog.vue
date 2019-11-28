<template>
    <el-dialog :visible="show" center title="门店换绑" @close="cancel">
        <div class="change-bind-dialog">
            <div>将 <span class="bind-name">{{data.name}}</span> 名下的门店全部批量换绑对接人。</div>
            <div class="middle">
                <span>换绑对接人： </span>
                <el-select placeholder="请选择" v-model="targetAgentId">
                    <el-option
                            :key="item.agentId"
                            :label="item.agentName"
                            :value="item.agentId"
                            v-for="item in fullAuthorityAgents">
                    </el-option>
                </el-select>
            </div>
            <div>如有进行中订单，订单将关闭，请提前与门店进行沟通。</div>
        </div>
        <div class="dialog-footer" slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button @click="changeBindConfirm" type="primary">确认换绑</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "changeBindDialog",
        props: {
            data: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            fullAuthorityAgents: {
                type: Array
            }
        },
        data() {
            return {
                zzAccount: [],
                operateIndex: '',
                targetAgentId: '',
                show: true
            }
        },
        methods: {
            changeBindConfirm() {
                this.show = false;
                this.$http.get('partner/agent/replace', {
                    id: this.data.id,
                    targetAgentId: this.targetAgentId
                }).then(() => {
                    this.$message.success('换绑成功');
                    this.$emit('submit');
                    this.$emit('close')
                })
            },
            cancel() {
                this.show = false;
                this.$emit('close')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .change-bind-dialog {
        text-align: center;

        .bind-name {
            font-size: large;
        }

        .middle {
            margin: 30px 0;
        }
    }
</style>
