<template lang="html">
    <el-dialog custom-class="price-form" title="修改报价" :visible.sync="dialogFormVisible" width="460px" :before-close="modalClose" center>
        <p v-if="orderInfo.firstPrice" class="goodsInfo">
            <span>原报价</span>
            <span class="goodsInfo-oriPrice"> {{orderInfo.firstPrice}} </span>
            <span>元</span>
        </p>
        <p class="content">您的第二次报价为：<span>{{ price || '?' }}</span>元</p>
        <div class="price-tips">提示：请确认与门店已完成沟通，您只可发起修改价格一次。</div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: ['orderInfo', 'price', 'orderId', 'desc', 'media'],
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
                if (price > 999999.99) {
                    this.modalClose()
                    return this.$message({
                        message: '价格不能超过999999.99',
                        type: 'error'
                    })
                }
                // const newPrice = price.toFixed(2) * 100
                const newPrice = parseInt(price * 100)
                const { orderId, desc, media } = this
                if (isNaN(newPrice) || !newPrice) {
                    return this.$message({
                        message: '请正确的填写报价价格',
                        type: 'error'
                    })
                }
                if (desc.length > 200) {
                    return this.$message.error('原因需要小于200个字！')
                }
                this.$http.get('partner/recycle/changeprice', { orderId, price: newPrice, desc, media }).then(resp => {
                    console.log('setprice: ', resp)
                    const { code, data } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '报价修改成功',
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
    .goodsInfo{
        text-align: center;
        &-text{
            margin-right: 20px;
        }
        &-oriPrice{
            color: #409EFF;
            font-size: 28px;
        }
    }
    .content {
        text-align: center;
        span {
            color: #409EFF;
            font-size: 28px;
        }
    }
    .price-form{
        margin-top: 20px;
        text-align: center;
    }
    .price-tips{
        margin: 24px 0 -20px;
        text-align: center;
        font-size: 12px;
        color: red;
    }
</style>
