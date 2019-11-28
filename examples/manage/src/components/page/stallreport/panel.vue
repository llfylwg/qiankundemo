<template lang="html">
    <div class="header">
        <div class="header-title">{{title}}</div>
        <div class="header-cxt">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title'],
        data () {
            return {

            }
        },
        created () {

        },
        methods: {
            getData () {
                console.log('getData')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header{
        margin: 14px;
        padding: 24px 18px;
        background-color: white;
        &-title{
            color: #2E3135;
            font-size: 14px;
        }
        &-cxt{

        }
    }
</style>
