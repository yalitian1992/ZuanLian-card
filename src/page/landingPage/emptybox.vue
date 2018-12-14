<template>
  <div>
    <div class="wm">
      <div class="bigBg">
        <div class="logo"></div>
        <div class="empty">
          <div class="tit"></div>
          <div class="dis"></div>
        </div>
        <div class="table">
          <div class="box"></div>
          <div class="emptyBtn" @click="downLoad"></div>
          <!-- <p>每日500元，领完即止！</p> -->
        </div>
        <div class="record">
          <ul class="record-list" id="recordList">
            <li id="li" v-for="(item, index) in indexData.list">
              <span class="user-phone">{{item.mobile}}</span>
              <span class="ward-info pull-right">领取<i>{{item.value}}元</i>京东卡</span>
            </li>
          </ul>
        </div>
      </div>
      <icpInfo></icpInfo>
    </div>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  import icpInfo from '../../components/icpInfo/icpInfo.vue'
  export default {
    data () {
      return {
        imgBaseUrl,
        indexData:[], //
        surplusNum: 0   //剩余
      }
    },
    methods: {
      downLoad: function(){
        this.downApp()
      },
      recordScroll: function(){
        setTimeout(function(){
          var liElm = document.getElementsByTagName("li")
          var ulElm = document.getElementById("recordList")
          for (var i=0;i<4;i++){
            var cln=liElm[i].cloneNode(true);
            ulElm.appendChild(cln);
          }
          var liHight = liElm[0].clientHeight  //一个li的高度
          var ulHight = ulElm.clientHeight   //整个ul的高度
          var nomalHeight = -liHight;  // 默认滚动条位置
          window.timer1 = setInterval(function(){
            nomalHeight += liHight
            var start = nomalHeight
            var end = nomalHeight + liHight
            window.timer2 = setInterval(function(){
              ulElm.scrollTop = start++
              if(start>=end){
                if (ulElm.scrollTop>=ulHight + 4*liHight){
                  nomalHeight = -liHight
                }
                clearInterval(window.timer2)
              }
            }, 17)
          }, 1500)
        }, 1000)
      },
      indexHttp: function(){
        let _this = this
        this.$http({
          method: 'get',
          url: '/api/chest_boxs/h5_box_detail',
        }).then(function(res){
          if(res.body.execErrCode==200){
            _this.indexData = res.body.execData
            _this.surplusNum = _this.indexData.left_count
          }else {
            _this.toast(res.body.execData.execMsg)
          }
        })
      }
    },
    components: {
      icpInfo
    },
    mounted(){
      let _this = this;
      this.recordScroll()
        this.$http({
          method: 'get',
          url: '/api/chest_boxs/h5_box_detail',
        }).then(function(res){
          if(res.body.execErrCode==200){
            _this.indexData = res.body.execData
            window.fiveTimer = setInterval(function(){
              _this.indexHttp()
            }, 5000)
          }else {
            _this.toast(res.body.execData.execMsg)
          }
        })
      this.pvCount()
    },
    beforeDestroy: function () {
      clearInterval(window.timer1)  //步与步
      clearInterval(window.timer2)  //单步
      clearInterval(window.fiveTimer)    //五分钟刷新数据
    }
  }
</script>
<style scoped>
.wm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  overflow-y: auto;
  background: #5F0703;
}
.bigBg {
  overflow: hidden;
  background: url(../../images/wm-bg.jpg) no-repeat center/100% 100%;
}
.bigBg .logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 3rem;
  height: 1.63rem;
  z-index: 333;
  background: url(../../images/logo-img.png) no-repeat center/contain;

}
.bigBg .empty .tit {
  height: .81rem;
  margin-top: 1.91rem;
  margin-bottom: .67rem;
  background: url(../../images/wm-empytit.png) no-repeat center/contain;
}
.bigBg .empty .dis {
  height: 3.29rem;
  background: url(../../images/wm-empty-dis.png) no-repeat center/contain;
}
.bigBg .dis span {
  display: inline-block;
  height: .8rem;
}
.bigBg .dis .bg-qian {
  width: 3.28rem;
  background: url(../../images/wm-dis-qian.png) no-repeat center/contain;
}
.bigBg .dis .bg-qian {
}
.bigBg .dis .bg-hou {
  width: 0.88rem;
  background: url(../../images/wm-dis-hou.png) no-repeat center/contain;
}
.bigBg .box {
  position: absolute;
  top: 0;
  left: -0.6rem;
  right: 0;
  margin: auto;
  width: 11.08rem;
  height: 5.62rem;
  background: url('../../images/vm-box.png') no-repeat center/contain;
}
.bigBg .table {
  position: relative;
  width: 100%;
  height: 7.56rem;
  color: #fff;
  font-size: .4rem;
  line-height: .25rem;
  text-align: center;
  background: url(../../images/wm-table.png) no-repeat center/contain;
}
.bigBg .table .openBtn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: .5rem;
  z-index: 3;
  margin: 0 auto;
  width: 8.02rem;
  height: 3.03rem;
  background: url(../../images/vm-openboxbtn.png) no-repeat center/contain;
}
.bigBg .table .emptyBtn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: .5rem;
  z-index: 3;
  margin: 0 auto;
  height: 3.03rem;
  background: url(../../images/vm-kongbtn.png) no-repeat center/contain;
}
.receive-status {
  width: 11.20rem;
  height: .76rem;
  margin: .29rem auto;
  font-size: .4rem;
  line-height: .76rem;
  text-align: center;
  color: #fff;
  background: url(../../images/wm-receive.png) no-repeat center/contain;
}
.receive-status span {
  color: #fffe79;
}
.bigBg .record {
  position: relative;
  padding: 0.53rem .65rem;
  font-size: .5rem;
  color: #fff;
  width: 11.66rem;
  height: 5.06rem;
  margin: .15rem auto;
  background: url(../../images/wm-record-bg.png) no-repeat center/contain;
}
.bigBg .record:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

}
.bigBg .record ul {
  height: 4rem;
  overflow-y: auto;
}
.bigBg .record ul li {
  height: 1rem;
  line-height: 1rem;
}
.bigBg .record ul li i {
  color: #fff717;
}
</style>
