<template lang="html">
    <div class="main-pic">
        <div class="main-pic-plus">
            <div class="main-pic-plus-1"></div>
            <div class="main-pic-plus-2"></div>
        </div>
        <div class="main-pic-title">{{title}}</div>
        <slot></slot>
        <div v-show="pic" class="main-pic-cxt" :style="{backgroundImage: 'url(https://pic3.zhuanstatic.com/zhuanzh/' + pic + '?w=500&h=500)'}"></div>
        <div v-show="pic" class="main-pic-del" @click="handle">
            <i class="el-icon-delete icon"></i>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title', 'pic'],
        data () {
            return {

            }
        },
        created () {

        },
        methods: {
            handle () {
                this.$emit('del', this.pic)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-pic{
        position: relative;
        border: 1px solid #E7E7E7;
        border-radius: 4px;
        width: 160px;
        height: 160px;
        cursor: pointer;
        overflow: hidden;
        &-plus{
            position: relative;
            width: 40px;
            height: 40px;
            margin: 42px auto 0;
            &-1{
                position: absolute;
                top: 18px;
                left: 0;
                width: 40px;
                height: 4px;
                border-radius: 2px;
                background-color: #D8D8D8;
            }
            &-2{
                position: absolute;
                top: 0px;
                left: 18px;
                width: 4px;
                height: 40px;
                border-radius: 2px;
                background-color: #D8D8D8;
            }
        }
        &-title{
            font-size: 14px;
            color: #C6C6C6;
            text-align: center;
            margin-top: 16px;
        }
        &-cxt{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
        }
        &-del{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            background-color: black;
            .icon{
                color: white;
                display: block;
                margin: 0 auto;
                line-height: 158px;
                text-align: center;
            }
        }
        &-del:hover{
            opacity: 0.6;
        }
    }
</style>
