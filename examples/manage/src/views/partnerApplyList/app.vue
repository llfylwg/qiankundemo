<template>
    <div class="wrap">
        <section class="head-box">
            <h-filter @search="setFilter"></h-filter>
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
                    size="mini" v-if="tableShow">

                <template slot="operations" slot-scope="scope">
                    <opts :optData="scope.rowData" @detail="showDetail"></opts>
                </template>
            </h-table>
        </div>

        <el-dialog :visible="!!detail" @close="detail = ''"
                   center class="detail-dialog" title="合伙人申请信息">
            <div v-if="detail">
                <div class="detail-base">
                    <span>申请人：{{detail.name}}</span>
                    <span>申请人地区：{{detail.area}}</span>
                    <span>申请人联系方式：{{detail.mobile}}</span>
                </div>
                <div>从业时间：{{detail.professionInfo.duration}}</div>
                <div>是否有零售门店：{{detail.professionInfo.hasShop}}</div>
                <div>客户数量：{{detail.professionInfo.customerNum}}</div>
                <div>日均台数：{{detail.professionInfo.numPerDay}}</div>
                <div>联系地址：{{detail.address}}</div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import hTable from 'sub/component/Table'
    import componentsMixins from '../../components/page/partnerApplyList/componentsMixins.js'
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
                listApiName: 'partner/agent/applyList',
                detail: false,
                tableShow: true,
            }
        },
        methods: {
            showDetail(e) {
                this.$http.get('partner/agent/applyDetail', {
                    id: e.id
                }).then(res => this.detail = res.data)
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

    .detail-dialog {
        .detail-base {
            font-weight: bold;
            margin-bottom: 20px;

            span {
                display: inline-block;
                margin-right: 20px;
            }
        }
    }

</style>
