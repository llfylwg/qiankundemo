<template lang="html">
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
        <v-tooltip :htmlContent="htmlContent" />
        <v-axis />
        <v-legend />
        <v-line position="date*temperature" color="line" />
        <v-point position="date*temperature" color="line" :size="4" :v-style="style" :shape="'circle'" />
    </v-chart>
</template>

<script>
    import DataSet from '@antv/data-set'
    import toolTip from './toolTip'

    export default {
        props: ['dataSource'],
        data () {
            return {
                data: [],
                scale: [],
                height: 400,
                style: { stroke: '#fff', lineWidth: 1 },
            }
        },
        created () {

        },
        mounted () {
            this.init()
        },
        watch: {
            dataSource (val) {
                this.init()
            }
        },
        methods: {
            htmlContent (title, items) {
                return toolTip.launch({ title, items })
            },
            getData () {
                console.log('getData')
                const { list, fields } = this.dataSource
                const dv = new DataSet.View().source(list)
                dv.transform({
                    type: 'fold',
                    fields,
                    key: 'line',
                    value: 'temperature',
                })
                return dv.rows
            },
            getScale () {
                return [{
                    dataKey: 'date'
                }]
            },
            init () {
                this.data = this.getData()
                this.scale = this.getScale()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
