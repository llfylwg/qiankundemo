<template lang="html">
    <el-form :inline="true" :model="form" label-width="100px" ref="filterForm" size="medium">
        <el-form-item>
            <el-select placeholder="状态" v-model="form.state">
                <el-option
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        v-for="item in partnerState">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-input placeholder="姓名" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item>
            <el-input placeholder="电话" type="number" v-model="form.mobile"></el-input>
        </el-form-item>

        <el-form-item>
            <el-select @change="changeProvince" placeholder="请选择省" v-model="form.provinceCode">
                <el-option
                        :key="item.localId"
                        :label="item.localName"
                        :value="item.localId"
                        v-for="item in province">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-select placeholder="请选择市" v-model="form.cityCode" :disabled="!form.provinceCode">
                <el-option
                        :key="item.localId"
                        :label="item.localName"
                        :value="item.localId"
                        v-for="item in city">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-date-picker
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="changeRangeTime"
                    end-placeholder="结束日期"
                    range-separator="-"
                    start-placeholder="开始日期"
                    type="daterange"
                    v-model="dateRang">
            </el-date-picker>
        </el-form-item>

        <el-form-item>
            <el-button @click.native="reset">重置</el-button>
            <el-button @click="()=>$emit('search', this.form)" type="primary">查询</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import filterTime from 'sub/component/time2'

    export default {
        components: {
            filterTime
        },
        data() {
            return {
                stallTypes: [],
                partnerState: [{name: '未处理', id: 0}, {name: '已处理', id: 1}],
                form: {
                    state: '',
                    name: '',
                    mobile: '',
                    provinceCode: '',
                    cityCode: ''
                },
                province: [],
                city: [],
                dateRang: ''
            }
        },
        computed: {},
        async created() {
            this.province = await this.getLocal();
            // Object.assign(this.form, this.$route.query);
        },
        methods: {
            reset() {
                this.selectCates = [];
                this.dateRang = '';
                this.$refs['filterForm'].resetFields();
                Object.keys(this.form).map(item => {
                    this.form[item] = ''
                })
            },
            async getLocal(localId = this.form.provinceCode) {
                return (await this.$http.get('//app.zhuanzhuan.com/zz/transfer/getMagicLocal', localId ? {localId} : {})).respData
            },
            async changeProvince() {
                this.form.cityCode = '';
                this.city = await this.getLocal()
            },
            changeRangeTime(date) {
                this.form.applyBeg = date[0];
                this.form.applyEnd = date[1];
            }
        }
    }
</script>
<style lang="scss">

</style>
