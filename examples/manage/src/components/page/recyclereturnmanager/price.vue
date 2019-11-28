<template lang="html">
    <span v-if="optData.statusCode != 1">{{price / 100}}</span>
    <span v-else @click="setPriceClick">
        <i class="el-icon-edit"></i>
    </span>
</template>

<script>
    export default {
        props: ['orderType', 'optData'],
        data () {
            return {
                price: ''
            }
        },
        created () {
            this.setPrice()
        },
        methods: {
            setPrice () {
                const { price } = this.optData
                this.price = price
            },
            setPriceClick () {
                this.$emit('setPriceClick', this.optData)
            }
        }
    }
</script>

<style lang="css">
</style>
