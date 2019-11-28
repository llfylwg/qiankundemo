<template>
    <div class="wrap">
        <section class="head-box">
            <el-row :gutter="12" class="account-header">
                <el-col :span="10">
                    <el-card shadow="hover">
                        <div class="account-balance">
                            <div class="account-balance-header">
                                <span class="title">主账户余额</span>
                                <el-tag type="warning" v-if="balance < 5e4">您的账户可用余额为{{balance}}，请及时充值。
                                </el-tag>
                            </div>
                            <div>
                                <span class="balance">{{balance || 0}}元</span>
                                <a class="recharge" href="/bm-manage/balance/index">去充值</a>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="10">
                    <el-card shadow="hover">
                        <div class="account-balance">
                            <div class="title">合作外放账户总余额</div>
                            <div>
                                <span class="balance">总剩余授权金：{{agentBalanceInfo.totalAgentBalanceAsYuan}}元</span>
                                <el-divider direction="vertical"></el-divider>
                                <span>合伙人数：{{agentBalanceInfo.totalAgentCount}}人</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <h-filter @search="setFilter" ref="hfilter"></h-filter>
        </section>

        <div class="table-box">
            <h-table
                    :listData="listData"
                    :listOPs="listOPs"
                    :listProps="listProps"
                    :pageData="pageData"
                    :total="total"
                    @onCurrent="handleCurrentChange"
                    @onSize="handleSizeChange"
                    size="mini">

                <template slot="latestRechargeTime" slot-scope="scope">
                    <span> {{ scope.rowData.latestRechargeTime }}</span>
                </template>

                <template slot="authorisedTime" slot-scope="scope">
                    <span> {{ scope.rowData.authorisedTime }}</span>
                </template>

                <template slot="operations" slot-scope="scope">
                    <opts :optData="scope.rowData" @handleClickToDetail="handleClickToDetail"></opts>
                </template>
            </h-table>
        </div>

        <el-dialog :visible="manageDialogVisible" @close="manageDialogVisible=false" center
                   title="授权金管理">
            <div class="dialog-content">
                <div class="agent-info">
                    <div>对接人：{{optData.name}}</div>
                    <div>剩余授权金额：{{optData.balanceAsYuan}}元</div>
                </div>

                <div class="middle">
                    <el-form :model="chargeForm" label-position="right" label-width="100px">
                        <el-form-item label="授权金余额：">
                            <el-select @change="chargeDialogTip" v-model="chargeForm.type">
                                <el-option label="充值" value="0"></el-option>
                                <el-option label="扣减" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :rules="[
                                          { required: true, message: '充值金额不能为空',trigger: 'change'},
                                          { type:'number',max:maxAmount,
                                          message: `主账户余额不足，无法为${optData.name}账户${chargeForm.type==='0'?'充值':'扣减'}${chargeForm.value}元`,
                                          trigger: 'change'}
                                        ]" label="金额：" prop="value">
                            <el-input @input="chargeDialogTip" placeholder="请输入金额" type="number"
                                      v-model.number="chargeForm.value"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-alert
                            :closable="false"
                            :title="chargeTip"
                            type="warning"
                            v-if="chargeTip">
                    </el-alert>
                </div>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="manageDialogVisible=false">取 消</el-button>
                <el-button @click="chargeConfirm" type="primary">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible="unfreezeDialogVisible" @close="unfreezeDialogVisible=false" center title="解冻授权账户">
            <div class="dialog-content">
                <div class="agent-info">
                    <div>对接人：{{optData.name}}</div>
                    <div>剩余授权金额：{{optData.balanceAsYuan}}元</div>
                </div>

                <div class="middle">合伙人账户解冻后，将恢复正常订单结算支出余额权限。</div>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="unfreezeDialogVisible=false">取 消</el-button>
                <el-button @click="unfreezeConfirm" type="primary">确定开启</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible="freezeDialogVisible" @close="freezeDialogVisible=false" center title="冻结授权账户">
            <div class="dialog-content">
                <div class="agent-info">
                    <div>对接人：{{optData.name}}</div>
                    <div>剩绑定门店：{{unfreezeInfo.agentedStallCnt}}</div>
                    <div>待结算订单总数：{{unfreezeInfo.toOfferAndPayOrderCount}}</div>
                </div>

                <div class="middle">
                    <div>合伙人账户冻结后，将无法进行余额结算。</div>
                    <div>为保证您的交易安全，合伙人进行中的订单也会关闭。</div>
                    <div>请及时与卖家沟通订单处理事宜。</div>
                </div>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="freezeDialogVisible=false">取 消</el-button>
                <el-button @click="freezeConfirm" type="primary">确定冻结</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import hTable from 'sub/component/Table'
    import componentsMixins from '../../components/page/account/componentsMixins.js'
    import mixin from '../../components/tableMixin.js'
    import * as tabCofigData from './tabsTitle.js'

    export default {
        components: {
            hTable
        },
        mixins: [mixin, componentsMixins],
        data() {
            return {
                listProps: tabCofigData['allData'],
                listOPs: tabCofigData['allOpts'],
                listApiName: 'partner/account/list',
                optData: '',
                manageDialogVisible: false,
                freezeDialogVisible: false,
                unfreezeDialogVisible: false,
                unfreezeInfo: {},
                agentBalanceInfo: {},
                maxAmount: '',
                chargeTip: '',
                chargeForm: {
                    type: '0',
                    value: 0
                },
                balance: 0
            }
        },
        computed: {
            ...mapState(['app'])
        },
        async created() {
            this.agentBalanceInfo = (await this.$http.get('partner/account/agentBalanceInfo')).data
            this.balance = (await this.$http.get('/partner/common/balance')).data
        },
        methods: {
          handleClickToDetail (data, {code}) {
            const handlerMap = {
              'manageBalance': () => {
                this.showManage(data)
              },
              'freeze': () => {
                this.showFreeze(data)
              },
              'unfreeze': () => {
                this.showUnfreeze(data)
              },
              'detail': () => {
                this.jumpBalanceDetail(data)
              }
            }
            handlerMap[code] && handlerMap[code]()
          },
            showManage(data) {
                this.optData = data;
                this.manageDialogVisible = true
            },
            showFreeze(data) {
                this.optData = data;
                this.freezeDialogVisible = true
              this.$http.get('partner/account/agentScale', {
                agentUid: data.uid
              }).then(res => this.unfreezeInfo = res.data)
            },
            showUnfreeze(data) {
                this.optData = data;
                this.unfreezeDialogVisible = true;
            },

            jumpBalanceDetail(data) {
                this.$router.push({
                    name: 'accountBalanceDetail',
                    query: {name: data.name, agentUid: data.uid}
                })
            },

            chargeDialogTip() {
                const {name, balanceAsYuan} = this.optData;
                const {type, value} = this.chargeForm;
                //充值
                if (type === '0') {
                    this.maxAmount = Number(this.app.balance + balanceAsYuan);
                    const checkMainAccountBalance = value < this.maxAmount;
                    //设置金额>剩余授权金额 且 不超过剩余授权金额+回收商账户剩余金额
                    this.chargeTip = (value > Number(balanceAsYuan) && checkMainAccountBalance) ? `将从主账户划拨资金，为${name}账户充值${value}元。` : '';
                } else { //扣减
                    this.maxAmount = Number(balanceAsYuan);
                    //设置金额<剩余授权金额
                    this.chargeTip = balanceAsYuan > value ? `将从${name}账户扣减${value}元，资金将划拨回主账户。` : ''
                }
            },

            async chargeConfirm() {
                await this.accountOperate(this.chargeForm.type == 1 ? 'charge' : 'recharge', this.chargeForm.value);
                this.manageDialogVisible = false
              this.getList()
            },

            unfreezeConfirm() {
                this.accountOperate('unfreeze');
                this.unfreezeDialogVisible = false
            },

            freezeConfirm() {
                this.accountOperate('freeze');
                this.freezeDialogVisible = false
            },

            accountOperate(optType, money) {
                return this.$http.get('partner/account/operateBalance', {
                    optType,
                    agentUid: this.optData.uid,
                    money
                }).then(res => {
                  res.code === 0 && this.$message.success('操作成功')
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap {
        width: 100%;
        background: #F8F8F8;
    }

    .head-box {
        padding: 20px 24px 0;
        box-sizing: border-box;
        background: #FFF;
    }

    .table-box {
        background: #FFF;
        margin: 16px 16px 0;
        padding: 24px 32px 18px;
    }

    .account-header {
        margin-bottom: 20px;

        .account-balance {
            height: 80px;
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            &:not(:last-child) {
                margin-right: 20px;
            }

            .title {
                font-weight: bold;
                margin-right: 20px;
            }

            .account-balance-header {
                margin-bottom: 10px;
            }

            .recharge {
                float: right;
                color: #4A90E2;
            }
        }
    }

    .dialog-content {
        width: 90%;
        margin: 0 auto;

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
            width: 70%;
            margin: 40px auto 0;

            .charge-input {
                margin: 15px 0;
            }
        }
    }
</style>
<style lang="scss">
    .el-tooltip__popper.is-light {
        border-color: #909399 !important;
    }
</style>
