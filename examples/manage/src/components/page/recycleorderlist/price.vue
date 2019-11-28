<template lang="html">
    <div>
        <span v-if="price && optData.statusCode != 10 && optData.statusCode != 50">{{price / 100}}</span>
        <span v-if="optData.statusCode === 10" @click="setPriceClick">
            <i class="el-icon-edit"></i>
        </span>
        <!-- <span v-if="optData.statusCode === 60" @click="setSecondPriceClick">
            <i class="el-icon-edit"></i>
        </span> -->
    </div>
    
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
            },
            setSecondPriceClick () {
                this.$emit('handleClickToDetail', this.optData, {code: 'secondOffer'})
            }
        }
    }
</script>

<style lang="css">
</style>
