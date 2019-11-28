<template>
    <el-dialog :visible="show" @close="cancel" title="编辑">
        <el-form :model="agentForm" :rules="rules" class="dialog-content" label-position="right" label-width="150px"
                 ref="agentForm"
                 size="small">
            <el-form-item label="角色类型" prop="type">
                <el-select :disabled="revise ? Boolean(revise) : false" placeholder="请选择" v-model="agentForm.type">
                    <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            v-for="item in userType">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="业务权限（多选）" prop="authority">
                <el-select multiple placeholder="请选择" v-model="agentForm.authority">
                    <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            v-for="item in authority">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="姓名" prop="name">
                <el-input autocomplete="off" type="text" v-model="agentForm.name"></el-input>
            </el-form-item>

            <template v-if="!revise">
                <el-form-item label="转转注册手机号" prop="zzPhoneNumber">
                    <el-input @input="getZZAccount" autocomplete="off" type="text"
                              v-model="agentForm.zzPhoneNumber"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="el-form-item__error" style="position: static" v-if="zzAccount.length == 1">
                        请确认并选择此账号是为您授权的账号
                    </div>
                    <div class="el-form-item__error" style="position: static" v-if="zzAccount.length>1">
                        识别此手机号有多个转转账号，请选择授权账号。
                    </div>
                    <div class="zz-account" v-if="zzAccount.length">
                        <template v-for="(e,i) in zzAccount">
                            <div :class="[{ active: i=== selectedAccountIndex }, 'zz-account-content']"
                                 @click="chooseAccount(i)">
                                <img :src="e.pic"/>
                                <div>{{e.nick}}</div>
                            </div>
                        </template>
                    </div>
                    <div v-else></div>

                    <input style="display: none" type="text" v-model="agentForm.zzUid">
                </el-form-item>

                <el-form-item label="验证码" prop="verificationCode">
                    <el-input autocomplete="off" type="text" v-model="agentForm.verificationCode">
                        <el-button :loading="!!codeLoading" @click.prevent="sendCode" class="verification-code"
                                   slot="append">
                            获取验证码{{codeLoading?`(${codeLoading})`:''}}
                        </el-button>
                    </el-input>
                    <el-tag size="mini">验证码为了保证您授权人的正确性，防止结算给其他人</el-tag>
                </el-form-item>
            </template>

            <el-form-item label="联系电话" prop="mobile">
                <el-input autocomplete="off" type="text" v-model="agentForm.mobile"></el-input>
            </el-form-item>

            <el-form-item label="支付宝账号" prop="aliAccount">
                <el-input autocomplete="off" type="text" v-model="agentForm.aliAccount" :disabled="!!revise"></el-input>
            </el-form-item>
            <el-form-item label="支付宝名称" prop="aliName">
                <el-input autocomplete="off" type="text" v-model="agentForm.aliName" :disabled="!!revise"></el-input>
                <el-tag size="mini">错误将无法结算和收款，请确认支付宝注册时的手机号或邮箱</el-tag>
            </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button @click="agentFormSubmit" type="primary">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    const PHONE_REG = new RegExp('^1[23456789]\\d{9}$');
    export default {
        name: "newPartnerDialog",
        props: ['revise'],
        data() {
            return {
                userType: [{name: '公司BD', id: '0'}, {name: '合作黄牛', id: '1'}],
                authority: [{name: '回收推广', id: '1'}, {name: '回收垫资结算', id: '2'}],
                zzAccount: [],
                selectedAccountIndex: -1,
                agentForm: {},
                codeLoading: false,
                show: true,
                rules: {
                    type: [
                        {required: true, message: '请选择角色类型', trigger: 'blur'}
                    ],
                    authority: [
                        {type: 'array', required: true, message: '请选择业务权限', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, max: 6, message: '长度在 2 到 4 个字符', trigger: 'blur'}
                    ],
                    zzPhoneNumber: [
                        {required: true, message: '请输入转转注册手机号', trigger: 'blur'},
                        {type: 'string', message: '手机号格式不正确', trigger: 'blur', pattern: PHONE_REG},
                    ],
                    verificationCode: [
                        {type: 'string', required: true, len: 4, message: '请输入正确验证码', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {type: 'string', message: '手机号格式不正确', trigger: 'blur', pattern: PHONE_REG},
                    ],
                    aliAccount: [
                        {required: true, message: '支付宝账户不能为空', trigger: 'blur'}
                    ],
                    aliName: [
                        {required: true, message: '支付宝名不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.revise) {
                this.$http.get('partner/agent/editDetail', {
                    id: this.revise
                }).then(res => {
                    const {type, authority, name, mobile, aliAccount, aliName} = res.data;
                    this.agentForm = {
                        id: this.revise,
                        type,
                        authority: authority.split(','),
                        name,
                        mobile,
                        aliAccount,
                        aliName
                    }
                })
            }
        },
        methods: {
            getZZAccount(e) {
                if (!PHONE_REG.test(e)) return;
                this.$http.get('/partner/agent/zzAccount', {
                    zzMobile: this.agentForm.zzPhoneNumber
                }).then(res => {
                    const {data, code, msg} = res;
                    if (code === 0) {
                        this.zzAccount = data
                    } else {
                        this.$message.error(msg);
                    }
                })
            },
            chooseAccount(i) {
                this.selectedAccountIndex = i;
                this.agentForm.zzUid = this.zzAccount[i].zzUid;
            },
            sendCode() {
                if (!this.agentForm.zzUid) return this.$message.error('请先选择转转账号');
                this.codeLoading = 60;
                const intervalId = setInterval(() => this.codeLoading -= 1, 1000);
                setTimeout(() => clearInterval(intervalId), 1000 * 60);
                this.$http.get('/partner/agent/sendVerification', {
                    zzUid: this.agentForm.zzUid
                }).then(res =>
                    res.data ? this.$message.success('验证码已经发送') : this.$message.error('验证码发送失败')
                )
            },
            agentFormSubmit() {
                //格式化多选下拉菜单的值
                const agentForm = Object.assign({}, this.agentForm);
                agentForm.authority = this.agentForm.authority.join(',');
                this.submitDialog(agentForm, 'partner/agent/save')
            },
            submitDialog(form, url) {
                this.$refs['agentForm'].validate(valid => {
                    if (!valid) return;
                    return this.$http.post(url, form).then(res => {
                        const {data, code, msg} = res;
                        (code === 0 && data) ?
                            this.$message({
                                type: 'success',
                                message: '提交成功'
                            }) :
                            this.$message.error(msg || '表单提交错误');

                        this.$emit('submit');
                        this.$emit('close')
                    })
                });
            },
            cancel() {
                this.show = false;
                this.$emit('close')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dialog-content {
        width: 75%;
        margin: 0 auto;
    }
    .zz-account {
        display: flex;
    }
    .zz-account-content {
        display: inline-block;
        width: 80px;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;

        &.active {
            background-color: rgba(221, 221, 221, 0.8);
            border-radius: 5px;
        }

        img {
            display: block;
            margin: 0 auto;
            width: 80%;
            border-radius: 50%;
        }
    }
</style>
