<template lang="html">
  <div class="sendshiplist-wrap">
    <div class="head-box">
      <h-filter @search="setFilter"></h-filter>
    </div>
    <div class="table-box">
      <!-- 调出数据 -->
      <buttons @exportData="exportData"
      ></buttons>
      <h-table
        :listData="listData"
        :listProps="listProps"
        :pageData="pageData"
        :total="total"
        :listOPs="listOPs"
        size="mini"
        @onSize="handleSizeChange"
        @onCurrent="handleCurrentChange"
        @mouseEnter="mouseEnter"
        @mouseLeave="mouseLeave"
        >
        <template slot="operations" slot-scope="scope">
          <p class="opt-box">
            <span @click="selectCancle(scope.rowData)" class="edit" v-if="scope.rowData.operations.indexOf('cancle') > -1">取消</span>
            <span @click="selectSendShip(scope.rowData)" class="edit" v-if="scope.rowData.operations.indexOf('deliver') > -1">发货</span>
            <span @click="selectExpress(scope.rowData)" class="edit" v-if="scope.rowData.operations.indexOf('view_express') > -1">查看物流信息</span>
            <span @click="handleClickToDetail(scope.rowData.bizPkgId)" class="edit" v-if="scope.rowData.operations.indexOf('manage_goods') > -1">管理商品</span>
          </p>
        </template>
      </h-table>
    </div>
    <!-- 取消订单弹窗 -->
    <cancelOrder v-if="showCancleSendShip" @cancleSend="cancleSendShip" @closeModal="closeModal"></cancelOrder>
    <!-- 发货弹窗 -->
    <sendShip v-if="showSendShipModal" :bizPkgId="sendShipOrder['bizPkgId']" @hideSendShipModal="closeModal" @refreshList="getList"></sendShip>
    <expressInfo v-if="showExpressInfoModal" @hideExpressModal="closeModal" :bizPkgId="expressOrder['bizPkgId']"></expressInfo>
    <!-- 包裹数量明细 -->
    <pkgNum v-if="hoverShow" :pkgNum="pkgNum" ref="pkgNum"></pkgNum>
  </div>
</template>

<script>
  import hFilter from '../../components/page/sendshiplist/filter-goods'
  import mixin from '../../components/tableMixin.js'
  import hTable from 'sub/component/Table'
  import cancelOrder from '../../components/page/sendshiplist/cancelorder'
  import sendShip from '../../components/page/sendshiplist/sendship'
  import expressInfo from '../../components/page/sendshiplist/expressinfo'
  import pkgNum from '../../components/page/sendshiplist/pkgNum'
  import buttons from '../../components/page/sendshiplist/buttons'
  export default {
    mixins: [mixin],
    data () {
      return {
        showCancleSendShip: false,
        cancleOrder: '',
        showSendShipModal: false,
        sendShipOrder: '',
        showExpressInfoModal: false,
        expressOrder: '',
        hoverShow: false,
        pkgNum: {},
        listProps:  [
          {
            prop: 'bizPkgId',
            label: '发货单号'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'publishCnt',
            label: '商品数量'
          },
          {
            prop: 'statusDes',
            label: '发货状态'
          },
          {
            prop: 'expressNum',
            label: '物流单号'
          }
        ],
        listOPs: [
          {
            label: '操作',
            name: 'operations'
          }
        ],
        listApiName: 'bizpkg/list'
      }
    },
    created () {
      // this.cancelOrder()
    },
    methods: {
      exportData () {
        const keys = Object.keys(this.filter)
        let str = ''
        keys.map(item => {
          str += `${item}=${this.filter[item]}&`
        })
        window.location.href = '//ypwork.zhuanzhuan.com/ypee/bizpkg/export/list?' + str
      },
      handleClickToDetail (id) {
        this.$router.push({
          name: 'goodsList',
          query: {
            bizPkgId: id,
            tabCode: null
          }
        })
      },
      closeModal () {
        // 关闭所有弹窗
        this.showCancleSendShip = false
        this.showSendShipModal = false
        this.showExpressInfoModal = false
      },
      selectCancle (item) {
        // 取消发货操作
        this.cancleOrder = item
        this.showCancleSendShip = true
      },
      selectSendShip (item) {
        // 发货操作
        this.sendShipOrder = item
        this.showSendShipModal = true
      },
      selectExpress (item) {
        // 查看物流信息
        this.expressOrder = item
        this.showExpressInfoModal = true
      },
      cancleSendShip () {
        // 确认取消发货
        this.$http.get('bizpkg/cancle', {bizPkgId: this.cancleOrder['bizPkgId']}).then(res => {
          console.log(this.cancleOrder)
          this.closeModal()
          // const key = this.listData.indexOf(this.cancleOrder)
          this.getList()
          this.cancelOrder = ''
        })
      },
      mouseEnter () {
        // 数量信息明细弹窗
        const target = arguments[0][2]
        const {clientX, clientY} = arguments[0][3]
        console.log(clientX, clientY)
        const par = target.parentNode
        const childs = par.children
        const index = [].indexOf.call(childs, target)
        if (index === 2) {
          this.hoverShow = true
          this.pkgNum = arguments[0][0]
          this.$nextTick(() => {
            const dom = this.$refs['pkgNum']['$el']
            dom.style.top = clientY - 120  +'px'
            // dom.style.left = clientX - 180 + 'px'
          })
        } else {
          this.hoverShow = false
        }
      },
      mouseLeave () {
        this.pkgNum = {}
        this.hoverShow = false
      }
    },
    components: {
      hTable,
      hFilter,
      cancelOrder,
      sendShip,
      expressInfo,
      pkgNum,
      buttons
    }
  }
</script>

<style lang="scss" scoped>
.sendshiplist-wrap{
  width: 100%;
  box-sizing: border-box;
  background: #F8F8F8;

}
.head-box{
  padding: 20px 24px 0;
  box-sizing: border-box;
  background: #FFF;
}
  .split-line {
    line-height: 1px;
    height: 1px;
    margin: 10px 0;
    border-bottom:0.1rem solid rgba(221,221,221,0.8);
  }
  .link {
    color: #409EFF;
  }
  .table-box{
    background: #FFF;
    margin: 16px 16px 0;
    padding: 24px 32px 18px;
    // height: 100vh;
  }
</style>
