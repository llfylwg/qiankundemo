<template lang="html">
    <el-dialog custom-class="pay-orders" title="批量打款" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="pay-orders-value">
            <span>批量确认结算</span>
            <span class="pay-orders-value-num"> {{money / 100}} </span>
            <span>元</span>
        </p>
        <p class="pay-orders-phone">共{{orderNum}}个订单，{{phonesNum}}台机器</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" :loading="isLoading">确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import { reduce } from 'lodash'
    import { partnerPayMoney } from '@/assets/js/Api'
    export default {
        props: ['selection'],
        data () {
            return {
                dialogFormVisible: true,
                isLoading: false
            }
        },
        computed: {
            money () {
                return reduce(this.selection, (memo, item) => {
                    return memo + Number(item.price)
                }, 0)
            },
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
                this.isLoading = true
                const orderIds = this.selection.map(order => order.orderId).join(',')
                return partnerPayMoney({ orderIds }).then(resp => {
                    const { data, code } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '批量打款成功',
                            type: 'success'
                        })
                        this.isLoading = false
                    }
                    this.$emit('getList')
                    return this.modalClose()
                })
            }
        }
    }
</script>

<style lang="scss">
    .pay-orders{
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
