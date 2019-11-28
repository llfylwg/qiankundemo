<template lang="html">
    <el-dialog custom-class="price-form" title="确认打款" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="pay-price-text">
            <span class="store">将向 <span>{{sellerInfo.name}}</span></span>
            <span>打款</span>
            <span class="pay-price-text-num"> {{orderInfo.dealPrice}} </span>
            <span>元</span>
        </p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import { partnerPayMoney } from '@/assets/js/Api'
    export default {
        props: ['orderInfo', 'sellerInfo', 'orderId'],
        data () {
            return {
                dialogFormVisible: true,
            }
        },
        created () {
        },
        methods: {
            modalClose () {
                this.$emit('modalClose')
            },
            sure () {
                return partnerPayMoney({ orderIds: this.orderId }).then(resp => {
                    console.log('confirmprice: ', resp)
                    const { code, data } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '打款成功',
                            type: 'success'
                        })
                    }
                    this.$emit('modalClose')
                    this.$emit('goListPage')
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .store{
        text-align: center;
        span {
            font-size: 22px;
            font-weight: bold;
        }
    }
    .pay-price-text{
        text-align: center;
        margin: 10px 0 -20px;
        &-num{
            color: #409EFF;
            font-size: 28px;
        }
    }
</style>
