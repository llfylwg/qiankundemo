<template lang="html">
    <div class="main-panel">
        <div class="main-panel-title">{{title}}</div>
        <div class="main-panel-cxt">
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
    .main-panel{
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
