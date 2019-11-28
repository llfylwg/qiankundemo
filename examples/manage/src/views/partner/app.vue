<template>
    <div class="wrap">
        <section class="head-box">
            <h-filter @add="addDialogVisible = true" @search="setFilter"
                      ref="hfilter"></h-filter>
        </section>

        <div class="table-box">
            <!-- 列表 -->
            <h-table
                    :listData="listData"
                    :listOPs="listOPs"
                    :listProps="listProps"
                    :pageData="pageData"
                    :total="total"
                    @onCurrent="handleCurrentChange"
                    @onSize="handleSizeChange"
                    size="mini">

                <template slot="operations" slot-scope="scope">
                    <!-- 操作 -->
                    <opts :optData="scope.rowData" @changeBind="changeBind" @close="removeAgent" @open="openAgent"
                          @revise="reviseAgentInfo"></opts>
                </template>
            </h-table>
        </div>

        <newPartnerDialog :revise="revise" @close="addAgentDialogClose" @submit="setFilter"
                          v-if="addDialogVisible"></newPartnerDialog>

        <changeBindDialog :data="optData" :fullAuthorityAgents="fullAuthorityAgents"
                          @close="changeBindVisible = false" @submit="setFilter"
                          v-if="changeBindVisible"></changeBindDialog>

        <closeAgentDialog :data="optData" :fullAuthorityAgents="fullAuthorityAgents"
                          @close="removeAgentVisible = false" @submit="setFilter"
                          v-if="removeAgentVisible"></closeAgentDialog>
    </div>
</template>

<script>
    import hTable from 'sub/component/Table'
    import componentsMixins from '../../components/page/partner/componentsMixins.js'
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
                listApiName: 'partner/agent/list',
                addDialogVisible: false,
                changeBindVisible: false,
                removeAgentVisible: false,
                optData: '',
                revise: false,
                fullAuthorityAgents: [],
            }
        },
        created() {
            this.$http.get('partner/common/agentSupport').then(res => {
                if (!Number(res.data)) this.$alert('您没有开启招募合伙人暂无此类数据哦～</br>启动合伙人招募，可以帮助您更好的拓展合作伙伴及门店。', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '去开启',
                    callback: () => this.$router.push('/recyclesetting')
                });
            })
        },
        methods: {
            getFullAuthorityAgents() {
                if (!this.fullAuthorityAgents.length) this.$http.get('partner/agent/fullAuthorityAgents').then(res => {
                  this.fullAuthorityAgents = res.data.filter(item => item.agentId != this.optData.agentId)
                })
            },

            reviseAgentInfo(data) {
                this.revise = data.id;
                this.addDialogVisible = true
            },

            addAgentDialogClose() {
                this.revise = false;
                this.addDialogVisible = false
            },

            changeBind(data) {
                this.optData = data;
                this.changeBindVisible = true;
                this.getFullAuthorityAgents()
            },

            openAgent(optData) {
                this.$http.get('partner/agent/open', {
                    id: optData.id
                }).then(res => {
                  if (res.code == 0) {
                    this.$message.success('开启成功')
                    this.getList()
                  }
                })
            },

            removeAgent(data) {
                this.optData = data;
                this.getFullAuthorityAgents();
                this.removeAgentVisible = true;
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
</style>
