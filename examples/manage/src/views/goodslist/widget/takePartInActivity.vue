<template>
    <div>
        <div>{{['无', '待秒杀', '秒杀中', '已结束秒杀'][optData.actType]}}</div>

        <el-popover
                placement="bottom"
                trigger="click"
                v-if="optData.actType === 1 || optData.actType === 2"
                width="300">
            <div>
                <p><span>活动名称：</span>{{optData.activityDetail.name}}</p>
                <p><span>满减标签：</span>
                    <el-tag size="small">{{optData.activityDetail.description}}</el-tag>
                </p>
                <p><span>秒杀开始时间：</span>{{optData.activityDetail.beginTime | formatTime}}</p>
                <p><span>秒杀结束时间：</span>{{optData.activityDetail.endTime | formatTime}}</p>
            </div>
            <el-link @click="showDetail" slot="reference" type="primary">查看详情</el-link>
        </el-popover>
    </div>
</template>

<script>
    export default {
        name: "takePartInActivity",
        props: {
            optData: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        }
    }
</script>