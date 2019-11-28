<template lang="html">
    <el-form :inline="true" :model="form" label-width="100px" ref="filterForm" size="medium">
        <el-form-item>
            <el-select placeholder="选择对接人" v-model="form.agentUid">
                <el-option
                        :key="item.agentUid"
                        :label="item.agentName"
                        :value="item.agentUid"
                        v-for="item in effectAgents">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-button @click.native="reset">重置</el-button>
            <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import filterTime from 'sub/component/time2'
    import Select from 'sub/component/select2'
    import exportBtn from 'sub/component/export-btn'

    export default {
        components: {
            Select,
            exportBtn,
            filterTime
        },
        data() {
            return {
                effectAgents: [],
                form: {
                  agentUid: ''
                },
            }
        },
        computed: {},
        created() {
            this.$http.get('/partner/agent/effectAgentUids').then(res => {
                this.effectAgents = res.data
            });
        },
        methods: {
            search() {
              this.$emit('search', this.form)
            },
            reset() {
                this.selectCates = [];
                this.$refs['filterForm'].resetFields();
                Object.keys(this.form).map(item => {
                    this.form[item] = ''
                })
            }
        }
    }
</script>
<style lang="scss">

</style>
