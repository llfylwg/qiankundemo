<template lang="html">
    <el-dialog custom-class="confirm-orders" title="批量确认" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="confirm-orders-value">
            <span>批量确认</span>
            <span class="confirm-orders-value-num"> {{orderNum}} </span>
            <span>个订单</span>
        </p>
        <p class="confirm-orders-phone">回收共{{phonesNum}}台机器</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { reduce } from 'lodash'
    import { partnerConfirmPrice } from '@/assets/js/Api'
    export default {
        props: ['selection'],
        data () {
            return {
                dialogFormVisible: true,
            }
        },
        computed: {
            orderNum () {
                return this.selection.length
            },
            phonesNum () {
                return reduce(this.selection, (memo, item) => {
                    return memo + item.count
                }, 0)
            }
        },
        methods: {
            modalClose () {
                this.$emit('modalClose')
            },
            sure () {
                // this.$emit('confirmOrderList')
                const orderIds = this.selection.map(order => order.orderId).join(',')
                return partnerConfirmPrice({ orderIds }).then(resp => {
                    const { data, code } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '批量确认成功',
                            type: 'success'
                        })
                    }
                    this.$emit('getList')
                    return this.modalClose()
                })
            }
        }
    }
</script>

<style lang="scss">
    .confirm-orders{
        margin-top: 20px;
        margin-bottom: -30px;
        text-align: center;
        &-value{
            text-align: center;
            margin: 0 0 10px;
            &-num{
                color: #409EFF;
                font-size: 28px;
            }
        }
        &-phone{
            text-align: center;
        }
    }
</style>
