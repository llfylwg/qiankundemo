<template lang="html">
    <span>{{desc}}</span>
</template>

<script>
    export default {
        props: ['orderType', 'optData'],
        data () {
            return {
                desc: ''
            }
        },
        created () {
            const { status } = this.optData
            this.desc = status
        }
    }
</script>

<style lang="css">
</style>
