<template>
    <div>
        <div class="detail-title">
            <div class="title-left">
                <el-page-header @back="back" :content="`授权人：${$route.query.name || ''}`"/>
            </div>
            <export-btn :filter="{agentUid: $route.query.agentUid}" exportName="导出最近90天记录"
                        pre_export="commonexport/exportpreypauth/ypee/paymentsExport" type="primary"/>
        </div>

        <div class="table-box">
            <h-table
                    :listData="listData"
                    :listProps="listProps"
                    :listOPs="listOPs"
                    :pageData="pageData"
                    :total="total"
                    @onCurrent="handleCurrentChange"
                    @onSize="handleSizeChange"
                    size="mini">
                <template slot="moneyAsYuan" slot-scope="scope">
                    <span :class="scope.rowData.type == 1 ? 'positive': 'negative'">
                        {{ scope.rowData.moneyAsYuan }}</span>
                </template>
                <template slot="balanceSnapshotAsYuan" slot-scope="scope">
                    <span>
                        {{ scope.rowData.balanceSnapshotAsYuan }}</span>
                </template>
                <template slot="payTime" slot-scope="scope">
                    <span> {{ scope.rowData.payTime }}</span>
                </template>
            </h-table>
        </div>
    </div>
</template>

<script>
    import hTable from 'sub/component/Table'
    import exportBtn from 'sub/component/export-btn-free'
    import * as detailConfigData from './balanceDetailTitle.js'
    import mixin from '../../components/tableMixin.js'

    export default {
        name: "balanceDetail",
        mixins: [mixin],
        components: {
            hTable, exportBtn,
        },
        data() {
            return {
                listProps: detailConfigData['allData'],
                listOPs: detailConfigData['opts'],
                listApiName: 'partner/account/payments'
            }
        },
        methods: {
            back() {
                window.history.go(-1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .detail-title {
        font-weight: bold;
        width: 100%;
        background: #FFF;
        padding: 28px 32px 30px;
        font-size: 16px;
        color: #2E3135;

        .title-left {
            display: inline-block;
            // width: 200px;
        }

        .reject-cause {
            background: #FFF;
        }

        button {
            float: right;
        }
    }


    .table-box {
        background: #FFF;
        margin: 16px 16px 0;
        padding: 24px 32px 18px;

        .positive, .negative {
            text-shadow: 2px 2px wheat;
        }

        .positive {
            color: red;

            &:before {
                content: '+';
            }
        }

        .negative {
            color: green;
            &:before {
                content: '-';
            }
        }
    }
</style>
