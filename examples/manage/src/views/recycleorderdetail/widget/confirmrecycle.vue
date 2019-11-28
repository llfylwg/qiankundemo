<template lang="html">
    <el-dialog custom-class="price-form" title="确认回收" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="price-text">
            <span>确定以</span>
            <span class="price-text-num" v-if="orderSource === 7"> {{price}} </span>
            <span class="price-text-num"v-else > {{orderInfo.firstPrice}} </span>
            <span>元回收</span>
        </p>
        <p class="goodsInfo">{{orderInfo.title}}</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import { partnerConfirmPrice } from '@/assets/js/Api'
    export default {
        props: ['orderInfo', 'orderId', 'price', 'orderSource'],
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
                if (this.orderSource === 7) {
                    this.$http.get('partner/recycle/changeprice', { orderId: this.orderId, price: this.price * 100 }).then(resp => {
                        const { code, data } = resp
                        if (code == 0 && data.status == 0) {
                            this.$message({
                                message: '确认回收成功',
                                type: 'success'
                            })
                        }
                        this.$emit('modalClose')
                        this.$emit('goListPage')
                    })
                }else {
                    return partnerConfirmPrice({ orderIds: this.orderId }).then(resp => {
                        const { code, data } = resp
                        if (code == 0 && data.status == 0) {
                            this.$message({
                                message: '确认成功',
                                type: 'success'
                            })
                        }
                        this.$emit('modalClose')
                        this.$emit('goListPage')
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .goodsInfo{
        text-align: center;
    }
    .price-form{
        margin-top: 20px;
        margin-bottom: -30px;
        text-align: center;
    }
    .price-text{
        text-align: center;
        margin: 0 0 10px;
        &-num{
            color: #409EFF;
            font-size: 28px;
        }
    }
</style>
