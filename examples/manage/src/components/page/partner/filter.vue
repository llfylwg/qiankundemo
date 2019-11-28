<template lang="html">
    <el-form :inline="true" :model="form" label-width="100px" ref="filterForm" size="medium">
        <el-form-item>
            <el-select @change="typeChange" placeholder="角色类型" v-model="form.type">
                <el-option
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        v-for="item in userType">
                </el-option>
            </el-select>
        </el-form-item>

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
            <el-input placeholder="电话" v-model="form.mobile"></el-input>
        </el-form-item>

        <el-form-item label="">
            <el-button @click.native="reset">重置</el-button>
            <el-button @click="$emit('search', form)" type="primary">查询</el-button>
            <el-button @click.native="exportFn" type="primary" icon="el-icon-download">导出</el-button>
            <el-button @click.native="$emit('add')" type="success">新增</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import { paramsObjToStr } from 'sub/lib/utils'
    const defaultPartnerState = [{name: '已关闭', id: 0}, {name: '生效中', id: 1}];
    export default {
        data() {
            return {
                stallTypes: [],
                userType: [{name: '公司BD', id: 0}, {name: '合作黄牛', id: 1}],
                partnerState: defaultPartnerState,
                form: {
                  type: '',
                  state: '',
                  name: '',
                  mobile: ''
                }
            }
        },
        created() {
            Object.assign(this.form, this.$route.query);
            this.form.type = this.$route.query.type ? Number(this.$route.query.type) : ''
            this.form.state = this.$route.query.state ? Number(this.$route.query.state) : ''
        },
        methods: {
            typeChange(type) {
                this.form.state = '';
                this.partnerState = type === 0 ? defaultPartnerState : defaultPartnerState.concat([{
                    name: '未签约',
                    id: 2
                }, {name: '未续签', id: 3}]);
            },
            reset() {
                this.selectCates = [];
                this.$refs['filterForm'].resetFields();
                Object.keys(this.form).map(item => {
                    this.form[item] = ''
                })
            },
            changeOrderTime(data) {
                this.form.createTimeEnd = data.addTimeEnd;
                this.form.createTimeStart = data.addTimeStart;
            },
          exportFn () {
            location.href = `https://ypwork.zhuanzhuan.com/ypee/partner/agent/export?${paramsObjToStr(this.form)}`
          }
        }
    }
</script>
<style lang="scss">

</style>
