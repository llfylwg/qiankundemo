<template lang="html">
    <div class="report">
        <div class="report-header">
            <div class="report-header-title">门店数据总览</div>
            <div class="report-header-tools">
                <el-form ref="filterForm" :model="form" size="medium" :inline="true" label-width="80px">
                    <el-form-item label="时间区间" >
                        <filter-time :select="getSelectTime" :pickerOptions="pickerOptions" @filter="changeOrderTime" :timePlaceHolder="timePlaceHolder"></filter-time>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="onSubmit">数据导出</el-button>
                        <el-button @click.native="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 支付GMV -->
        <panel :title="gmvData.title">
            <div class="report-buttons">
                <el-radio-group v-model="gmvData.timeSpan" size="small" @change="(day)=>changeDay(day, 'stallReportGMVList')">
                    <el-radio-button :label="7">7d</el-radio-button>
                    <el-radio-button :label="30">30d</el-radio-button>
                </el-radio-group>
            </div>
            <div class="report-line">
                <chart :dataSource="gmvData" v-loading="loading1" />
            </div>
        </panel>

        <!-- 支付订单量 -->
        <panel :title="orderData.title">
            <div class="report-buttons">
                <el-radio-group v-model="orderData.timeSpan" size="small" @change="(day)=>changeDay(day, 'stallReportOrderList')">
                    <el-radio-button :label="7">7d</el-radio-button>
                    <el-radio-button :label="30">30d</el-radio-button>
                </el-radio-group>
            </div>
            <chart :dataSource="orderData" v-loading="loading2" />
        </panel>

        <!-- 新增门店数-->
        <panel :title="newStallData.title">
            <div class="report-buttons">
                <el-radio-group v-model="newStallData.timeSpan" size="small" @change="(day)=>changeDay(day, 'stallReportNewStallList')">
                    <el-radio-button :label="7">7d</el-radio-button>
                    <el-radio-button :label="30">30d</el-radio-button>
                </el-radio-group>
            </div>
            <chart :dataSource="newStallData" v-loading="loading3" />
        </panel>

        <!-- 门店活跃情况 -->
        <panel :title="activeStallData.title">
            <div class="report-buttons">
                <el-radio-group v-model="activeStallData.timeSpan" size="small" @change="(day)=>changeDay(day, 'stallReportActiveStallList')">
                    <el-radio-button :label="7">7d</el-radio-button>
                    <el-radio-button :label="30">30d</el-radio-button>
                </el-radio-group>
            </div>
            <chart :dataSource="activeStallData"  v-loading="loading4" />
        </panel>
    </div>
</template>

<script>
    // import _ from 'lodash'
    import filterTime from 'sub/component/time2'
    import componentsMixins from '../../components/page/stallreport/componentsMixins.js'
    // import mixin from '../../components/tableMixin.js'
    // import * as tabCofigData from './tabsTitle.js'
    import { stallReportList, stallReportExport } from '@/assets/js/Api'
    // import { getCookie } from '@/assets/js/helper'

    export default {
        components: {
            filterTime
        },
        mixins: [componentsMixins],
        data () {
            const list = []
            const title = ''
            const fields = []
            const timeSpan = '7'
            return {
                loading1: true,
                loading2: true,
                loading3: true,
                loading4: true,
                timePlaceHolder: {
                    start: '开始时间',
                    end: '结束时间'
                },
                form: {
                    createTimeStart: '',
                    createTimeEnd: ''
                },
                gmvData: { list, title, fields, timeSpan },
                orderData: { list, title, fields, timeSpan },
                newStallData: { list, title, fields, timeSpan },
                activeStallData: { list, title, fields, timeSpan },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() >= Date.now();
                    }
                }
            }
        },
        computed: {
            getSelectTime () {
                if (this.form.createTimeStart && this.form.createTimeEnd) {
                    return [this.form.createTimeStart, this.form.createTimeEnd]
                } else {
                    return []
                }
            }
        },
        methods: {
            changeOrderTime (data) {
                this.form.createTimeEnd = data.addTimeEnd
                this.form.createTimeStart = data.addTimeStart
            },
            formatData (data) {
                let { indexItemDesc } = data
                let list = data.list.sort((a, b) => {
                    return b.indexDimension - a.indexDimension
                }).reverse()
                // console.log('list: ', list)
                const title = indexItemDesc
                const fields = list.map(item => item.indexDimensionDesc)
                list = list.map((item, i) => {
                    const { indexDimension, indexDimensionDesc } = item
                    const indexValues = item.indexValues.map(v => {
                        const val = {}
                        // val['data_' + indexDimension + '_value'] = v.value
                        val[indexDimensionDesc] = +v.value
                        val['data_' + indexDimension + '_dayBasis'] = v.dayBasis
                        val['data_' + i + '_indexDimension'] = indexDimension
                        val['date'] = v.date
                        return val
                    })
                    return indexValues
                })
                list = _.zipWith(...list, (...rest) => {
                    return Object.assign({}, ...rest)
                })
                return { list, title, fields }
            },
            changeDay (day, fn) {
                return this[fn](day)
            },
            stallReportGMVList (timeSpan = 7) {
                const indexItem = 1
                return stallReportList({ indexItem, timeSpan }).then(resp => {
                    this.loading1 = false
                    const { code, data } = resp
                    if (code == 0) {
                        this.gmvData = Object.assign({ timeSpan }, this.formatData(data))
                    }
                })
            },
            stallReportOrderList (timeSpan = 7) {
                const indexItem = 2
                return stallReportList({ indexItem, timeSpan }).then(resp => {
                    this.loading2 = false
                    const { code, data } = resp
                    if (code == 0) {
                        this.orderData = Object.assign({ timeSpan }, this.formatData(data))
                    }
                })
            },
            stallReportNewStallList (timeSpan = 7) {
                const indexItem = 100
                return stallReportList({ indexItem, timeSpan }).then(resp => {
                    this.loading3 = false
                    const { code, data } = resp
                    if (code == 0) {
                        this.newStallData = Object.assign({ timeSpan }, this.formatData(data))
                    }
                })
            },
            stallReportActiveStallList (timeSpan = 7) {
                const indexItem = 101
                return stallReportList({ indexItem, timeSpan }).then(resp => {
                    this.loading4 = false
                    const { code, data } = resp
                    if (code == 0) {
                        this.activeStallData = Object.assign({ timeSpan }, this.formatData(data))
                    }
                })
            },
            toast (mseeage) {
                return this.$message.error(mseeage)
            },
            exportValidate () {
                const { createTimeStart, createTimeEnd } = this.form
                if (!createTimeStart || !createTimeEnd) {
                    this.toast('开始时间或结束时间不能为空！')
                    return false
                }
                const createTimeStartStmp = new Date(createTimeStart).getTime()
                const createTimeEndStmp = new Date(createTimeEnd).getTime()
                const year = new Date().getFullYear()
                const month = new Date().getMonth() + 1
                const date = new Date().getDate()
                const dateInterval = 60 * 24 * 60 * 60 * 1000
                const EndValue = new Date(`${year}-${month}-${date}`).getTime()
                if (createTimeEndStmp >= EndValue) {
                    this.toast('结束时间应该在今天之前！')
                    return false
                }
                if (createTimeStartStmp + dateInterval <= createTimeEndStmp) {
                    this.toast('开始时间到结束时间应该在60天以内！')
                    return false
                }
                return true
            },
            onSubmit () {
                const { createTimeStart, createTimeEnd } = this.form
                const startDate = createTimeStart.split(' ')[0]
                const endDate = createTimeEnd.split(' ')[0]
                // return stallReportExport({ startDate, endDate })
                if (!this.exportValidate()) return
                location.href = `https://ypwork.zhuanzhuan.com/ypee/partner/report/export?startDate=${startDate}&endDate=${endDate}`
            },
            reset () {
                this.$refs['filterForm'].resetFields()
                Object.keys(this.form).map(item => {
                    this.form[item] = ''
                })
            },
            init () {
                this.stallReportGMVList()
                this.stallReportOrderList()
                this.stallReportNewStallList()
                this.stallReportActiveStallList()
            }
        },
        mounted () {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .report{
        &-header {
            padding: 28px 32px 0;
            background-color: white;
            &-title{
                color: #2E3135;
                font-size: 16px;
                font-weight: bold;
            }
            &-tools{
                margin-top: 20px;
            }
        }
        &-buttons{
            text-align: right;
        }
        &-line{
            width: 100%;
        }
    }
</style>
