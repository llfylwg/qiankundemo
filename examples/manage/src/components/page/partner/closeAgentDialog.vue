<template>
    <el-dialog :visible.sync="show" @close="cancel" center title="关闭对接人">
        <div class="remove-bind-dialog">
            <div class="agent-info">
                <div>对接人：{{targetAgentInfo.name}}</div>
                <div>绑定门店：{{targetAgentInfo.storeNum}}</div>
                <div>待结算订单数：{{targetAgentInfo.waitOrderNum}}</div>
                <div>账户余额：{{targetAgentInfo.accountAmt}}</div>
            </div>

            <div v-if="targetAgentInfo && targetAgentInfo.storeNum > 0">
                <div style="color: red">换绑对接人后进行中的订单将被关闭，请提前与门店沟通处理</div>
                <div class="middle">
                    <span>所有客户换绑对接人： </span>
                    <el-select placeholder="请选择" v-model="targetAgentId">
                        <el-option
                                :key="item.agentId"
                                :label="item.agentName"
                                :value="item.agentId"
                                v-for="item in fullAuthorityAgents">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div>将同时关闭对接人所有回收权限，授权账户关闭，授权金额划归主账户（如有）。</div>
        </div>
        <div class="dialog-footer" slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button @click="removeAgentConfirm" type="primary">确定关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "closeAgentDialog",
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
                targetAgentInfo: {},
                targetAgentId: '',
                show: true
            }
        },
        created() {
            this.$http.get('partner/agent/closeDetail', {
                id: this.data.id
            }).then(res => this.targetAgentInfo = res.data)
        },
        methods: {
            removeAgentConfirm() {
                if (+this.targetAgentInfo.accountAmt > 0) {
                    return this.$message.error('关闭失败！请先清空该对接人的余额，再关闭。');
                }
                this.$http.get('partner/agent/close', {
                    id: this.data.id,
                    targetAgentId: this.targetAgentId
                }).then(() => {
                    this.$message.success('关闭对接人成功');
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
    .remove-bind-dialog {
        text-align: center;

        .agent-info {
            border: dashed 1px gray;
            box-sizing: content-box;
            padding: 20px;
            display: flex;
            margin: 10px auto;
            justify-content: space-between;
            align-items: center;

            div {
                display: inline-block;
            }
        }

        .middle {
            margin: 20px 0;
        }
    }
</style>
