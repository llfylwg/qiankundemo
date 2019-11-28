<template lang="html">
    <el-dialog custom-class="price-form" title="确认回收" :visible.sync="dialogFormVisible" width="30%" :before-close="modalClose" center>
        <p class="price-text">
            <span>将以</span>
            <span class="price-text-num"> {{Number(optData.price) / 100}} </span>
            <span>元回收</span>
        </p>
        <p class="goodsInfo">{{optData.goodsInfo}}</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" >确定</el-button>
            <el-button @click="modalClose">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import { partnerConfirmPrice } from '@/assets/js/Api'
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
                return partnerConfirmPrice({ orderIds: orderId }).then(resp => {
                    const { code, data } = resp
                    if (code == 0 && data.status == 0) {
                        this.$message({
                            message: '确认成功',
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
