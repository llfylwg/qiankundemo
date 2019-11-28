<template lang="html">
    <el-dialog :visible="dialogFormVisible" @close="close" title="门店编辑">
        <el-form :model="form">
            <el-form-item :label-width="formLabelWidth" label="门店名称">
                <el-input autocomplete="off" v-model="form.stallName"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="门店店长">
                <el-input autocomplete="off" v-model="form.managerName"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="手机号码">
                <el-input autocomplete="off" v-model="form.contactNumber"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="详细地址">
                <el-input autocomplete="off" v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item v-if="isShowAgent" :label-width="formLabelWidth" label="对接人">
                <el-select placeholder="请选择" v-model="form.agentId" @change="handlerAgentSelect">
                    <el-option
                            :key="item.agentId"
                            :label="item.agentName"
                            :value="item.agentId"
                            v-for="item in effectAgents">
                    </el-option>
                </el-select>
                <p v-if="authority">所属权限：{{ authority }}</p>
            </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button @click="close">取 消</el-button>
            <el-button @click="handleClick" type="primary">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false
            },
            formData: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                formLabelWidth: '100px',
                form: {
                  agentId: ''
                },
                effectAgents: [],
                isShowAgent: false,
                authority: ''
            }
        },
        async mounted() {
            this.effectAgents = (await this.$http.get('/partner/agent/effectAgents')).data
        },
        watch: {
            formData() {
                const {stallName, managerName, contactNumber, address, id, agentId, asAgent} = this.formData;
                this.isShowAgent = !asAgent
                this.form = Object.assign({}, {
                    stallName, managerName, contactNumber, address,
                    agentId: agentId ? String(agentId) : '',
                    stallId: id
                })

            }
        },
        methods: {
            handleClick() {
                this.$confirm('确认修改门店信息么？', '提示', {
                    type: 'info'
                }).then(() => this.$emit('submitDialog', this.form))
            },
            close() {
                this.authority = ''
                this.$emit('closeDialog')
            },
            handlerAgentSelect(value) {
                const index = this.effectAgents.find(item => {
                    return item.agentId == value
                })
                this.authority = index.authorityDesc
            }
        }
    }
</script>

<style lang="css">
</style>
