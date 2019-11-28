<template lang="html">
    <el-dialog custom-class="price-form" title="修改报价" :visible.sync="dialogFormVisible" width="460px" :before-close="modalClose" center>
        <p class="goodsInfo">
            <span class="goodsInfo-text">{{optData.goodsInfo}}</span>
            <span>原报价</span>
            <span class="goodsInfo-oriPrice"> {{optData.price / 100}} </span>
            <span>元</span>
        </p>
        <el-form :inline="true" :model="form" class="price-form">
            <el-form-item label="您的报价为：">
                <el-input-number v-model="form.price" placeholder="请输入内容"></el-input-number>
            </el-form-item>
        </el-form>
        <div class="price-tips">提示：请确认与门店已完成沟通，您只可发起修改价格一次。</div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    export default {
        props: ['optData'],
        data () {
            return {
                dialogFormVisible: true,
                form: {
                    price: ''
                }
            }
        },
        created () {
        },
        methods: {
            modalClose () {
                this.$emit('modalClose')
            },
            validate () {
                let { price } = this.form
                if (!price) {
                    this.$message.error('请输入报价价格！')
                    return false
                }
                price = price * 100
                if (typeof price != 'number') {
                    this.$message.error('请输入正确的价格！')
                    return false
                }
                if (Math.floor(price) != price) {
                    this.$message.error('价格最多两位小数哦~')
                    return false
                }
                if (price >= 1000000 * 100) { // 单位：分
                    this.$message.error('报价不能超过100万元！')
                    return false
                }
                if (price < 0) {
                    this.$message.error('报价价格必须大于0！')
                    return false
                }
                return true
            },
            sure () {
                if (!this.validate()) return
                const { orderId } = this.optData
                const price = this.form.price * 100
                this.$http.get('partner/recycle/changeprice', { orderId, price }).then(resp => {
                    const { code, data } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '报价修改成功',
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
