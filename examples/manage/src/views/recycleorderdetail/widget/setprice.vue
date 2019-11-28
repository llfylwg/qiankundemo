<template lang="html">
    <el-dialog custom-class="price-form" title="立即报价" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="content">您的当前报价为：<span>{{ price || '?' }}</span>元</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    export default {
        props: ['orderInfo', 'price', 'orderId'],
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
                const price = Number(this.price)
                if (this.price > 999999.99) {
                    this.modalClose()
                    return this.$message({
                        message: '价格不能超过999999.99',
                        type: 'error'
                    })
                }
                const newPrice = price.toFixed(2) * 100
                const orderId = this.orderId
                if (isNaN(newPrice) || !newPrice) {
                    return this.$message({
                        message: '请正确的填写报价价格',
                        type: 'error'
                    })
                }
                this.$http.get('partner/recycle/setprice', { orderId, price: newPrice }).then(resp => {
                    console.log('setprice: ', resp)
                    const { code, data } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '报价成功',
                            type: 'success'
                        })
                    }
                    this.modalClose()
                    this.$emit('goListPage')
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content {
        text-align: center;
        span {
            color: #409EFF;
            font-size: 28px;
        }
    }
    .price-form{
        margin-top: 20px;
        margin-bottom: -30px;
        text-align: center;
    }
</style>
