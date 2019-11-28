<template lang="html">
    <el-dialog custom-class="price-form" title="确认打款" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="store">将向 {{optData.storeName}}</p>
        <p class="pay-price-text">
            <span>打款</span>
            <span class="pay-price-text-num"> {{optData.price / 100}} </span>
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
        props: ['optData'],
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
                const { orderId } = this.optData
                return partnerPayMoney({ orderIds: orderId }).then(resp => {
                    console.log('confirmprice: ', resp)
                    const { code, data } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '打款成功',
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
    .store{
        text-align: center;
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
