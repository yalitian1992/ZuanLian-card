<template>
  <div>
    <pubbg></pubbg>
    <!-- 发货信息 -->
    <div class="big-title" :class="{ios: isIos}">
      <h1></h1>
    </div>
    <div class="sendinfo" id="main-box" :class="{iphonex: isIphonex}">
      <div class="detailinfo">
        <div class="prizeinfo">
          <ul class="prize-img">
            <li>
              <img :src="imgBaseUrl()  + receiveInfo.pic" alt=" " :onerror="defaultImg(0)">
            </li>
            <li>
              <p class="text-overflow-multi">{{receiveInfo.name}}</p>
            </li>
          </ul>
        </div>
        <div class="good-reseivinfo">
          <div class="receiptinfo">
            <h5><span class="addr-mod" @click="toggleAddress"></span></h5>
            <ul class="info-txt">
              <li>
                <dl>
                  <dd>收&nbsp货&nbsp;人：</dd>
                  <dd>{{adderssInfo.consignee}}</dd>
                </dl>
                <dl>
                  <dd>联系方式：</dd>
                  <dd>{{adderssInfo.mobile}}</dd>
                </dl>
                <dl>
                  <dd>收货地址：</dd>
                  <dd class="text-overflow-multi">{{adderssInfo.detailedAddress}}</dd>
                </dl>
                <dl>
                  <dd>邮&nbsp;&nbsp;&nbsp;&nbsp;编：</dd>
                  <dd>{{adderssInfo.postcode}}</dd>
                </dl>
              </li>
            </ul>
          </div>
        </div>
        <p class="rece-tip">实物奖品需支付{{chestRecord}}元运费，请前往支付</p>
        <div class="sendstatu align-c" v-if="isStatusShow">
          <p>
            <span class="span1 txt-zong">我们将会在1~5个工作日为您发货！</span>
          </p>
        </div>
        <div class="submit-btn">
          <button class="btn-ok" v-if="isSubmitOrderShow" @click="payShow = true /*submitOrder*/">提交</button>
          <button class="btn-ok" v-else @click="goShare">分享</button>
        </div>
      </div>
    </div>
    <!--到付弹框-->
    <div class="toPay-box" v-show="payShow">
      <div class="box-txt">
        <h3><p>支付运费</p></h3>
        <p class="tip">请选择运费付款方式</p>
        <div class="payBtn">
          <button class="df" @click="dfPay">货到付款</button>
          <button class="zx" @click="submitOrder">在线支付</button>
        </div>
        <span class="close" @click="payShow = false"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import pubbg from '../../components/pubbg/bg-big.vue'
  import {imgBaseUrl} from '../../config/config'
  export default {
    data(){
      return {
        imgBaseUrl,
        payShow: false,
        adderssInfo: {},      //地址信息
        receiveInfo: {},      //接收礼物信息
        isStatusShow: false,  //发货信息
        isSubmitOrderShow: true,//提交按钮是否显示
        isIos: false,         //是否是iPhone
        isIphonex: false,      //是否是iPhonex
        chestRecord: ''        //邮费
      }
    },
    components: {
      pubbg
    },
    methods: {
      /*切换地址*/
      toggleAddress: function () {
        let url = window.location.href;
        window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/addressChange?from=3&backHref=1';
      },
//      货到付款
      dfPay: function(){
        this.$http({
          method: 'post',
          url: '/card-service-web/h5/chestRecords/getBigPrize',
          params: {
            id: this.receiveInfo.id,
            addressId: this.adderssInfo.addressId
          },
          headers: {accessToken: this.getToken()}
        }).then(function(res){
          var data = res.body;
          if (data.execErrCode == 200){
//            到付接口
            this.$http({
              method: 'post',
              url: '/api/chest_records/express',
              params: {
                id: this.receiveInfo.id,
              },
              headers: {accessToken: this.getToken()}
            }).then(function(res){
              var data = res.body
              if(data.execErrCode == 200){
                this.toast(data.execMsg)
                window.history.back();
                window.history.back();
              }else{
                this.toast(data.execMsg)
              }
              this.payShow = false
            })
          }else if(data.execErrCode == 1707){
            this.clientType(function(){window.Android.phoneBindingWx();},function(){ window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx'); })
          } else if(data.execErrCode == 1708){
            this.clientType(function(){window.Android.wxBindingPhone();},function(){ window.webkit.messageHandlers.AppModel.postMessage('wxBidingMobile');})
          } else {
            this.toast(data.execMsg);
          }
        })
      },

      /*提交*/
      submitOrder: function () {
        this.payShow = false
        this.$http({
          method: 'post',
          url: '/card-service-web/h5/chestRecords/getBigPrize',
          params: {
            id: this.receiveInfo.id,
            addressId: this.adderssInfo.addressId
          },
          headers: {accessToken: this.getToken()}
        }).then(function (res) {
          var data = res.body;
          if (data.execErrCode == 200) {
            if(this.chestRecord == 0) {
              /*支付接口*/
              this.$http({
                method: 'get',
                url: '/api/chest_records/alipay',
                params: {
                  id: this.receiveInfo.id,
                  return_url: 'www.baidu.com'
                },
                headers: {accessToken: this.getToken()}
              }).then(function(res){
                var data = res.body;
                if(data.execErrCode == 201){
                  window.history.back();
                  window.history.back();
                  /*this.$router.replace({
                    path: '/winningRecord',
                    query: {from: 3, token: this.getToken(), native: 0}
                  })*/
                }
              })
            }else if(this.chestRecord > 0){
              this.$router.replace({
                path: '/payment',
                query: {from: 3, token: this.getToken(), native: 0, Postage: this.chestRecord, id: this.receiveInfo.id}
              })
            }
          } else if(data.execErrCode == 1707){
            this.clientType(function(){window.Android.phoneBindingWx();},function(){ window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx'); })
          } else if(data.execErrCode == 1708){
            this.clientType(function(){window.Android.wxBindingPhone();},function(){ window.webkit.messageHandlers.AppModel.postMessage('wxBidingMobile');})
          } else {
            this.toast(data.execMsg);
          }
        })
        /*let _this = this;
        _this.asyncHttp('post', '/card-service-web/h5/chestRecords/getBigPrize', {
          id: _this.receiveInfo.id,
          addressId: _this.adderssInfo.addressId
        }, function (data) {
//          _this.toast("<h3>领取成功</h3><p>我们将会在1~5个工作日为您发货！</p>")
//          _this.isStatusShow = true;
//          _this.isSubmitOrderShow = false;

          _this.$router.replace({
            path: '/payment',
            query: {from: 3, token: this.getToken(), native: 0, Postage: _this.chestRecord, id: _this.receiveInfo.id}
          })
        })*/
      },
      /*分享*/
      goShare: function () {
        var _this = this;
        this.clientType(function () {
          window.Android.boxToShareWechat(_this.receiveInfo.id + '');
        }, function () {
          window.webkit.messageHandlers.AppModel.postMessage({type: 'rewordsShare', id: _this.receiveInfo.id + ''});
        })
      }
    },
    mounted(){

      let _this = this;
      if (localStorage.adderssInfo) {
        this.adderssInfo = JSON.parse(localStorage.adderssInfo)
      }
      if (localStorage.receiveInfo) {
        this.receiveInfo = JSON.parse(localStorage.receiveInfo)
      }
//      显示邮费
      _this.asyncHttp('get', '/api/chest_records/pay_amount', {
//        id: 536
        id: _this.receiveInfo.id
      }, function (data) {
        _this.chestRecord = data.execDatas.total_amount
      })
      this.clientType(function () {
      }, function () {
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        } else {
          _this.isIos = true;
        }
      })
    }
  }

</script>

<!-- 私有样式 -->
<style scoped>
  .close{
    display: block;
    width: 1.4rem;
    height: 1.4rem;
    position: absolute;
    top: 0rem;
    right: -0.9rem;
    background: url("../../images/icon-close.png") no-repeat center/100% 100%;
  }
  .toPay-box .df{
    margin-right: 1rem;
  }
  .toPay-box .payBtn button{
    /*display: block;*/
    float: left;
    width: 2.5rem;
    height: 1rem;
    background: url("../../images/record-btn.png") no-repeat center/100% 100%;
  }
  .toPay-box .payBtn{
    position: absolute;
    bottom: 0.8rem;
    left: 0;
    right: 0;
    padding-left: 1rem;
  }
  .toPay-box .tip{
    position: absolute;
    top: 1.4rem;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.48rem;
    color: #fff;
  }
  .toPay-box .box-txt>h3 p{
    margin: 0 auto;
    width: 4rem;
    height: 1.2rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.54rem;
    font-weight: normal;
    color: #efc153;
    background: url("../../images/get-box-title.png") no-repeat center/100% 100%;
  }
  .toPay-box .box-txt>h3{
    position: absolute;
    top: -0.3rem;
    left: 0;
    right: 0;
  }
  .toPay-box .box-txt{
    position: relative;
    margin: 60% auto 0 auto;
    width: 8rem;
    height: 5rem;
    background: url("../../images/get-invented-bg.png") no-repeat center/100% 100%;
  }
  .toPay-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(0,0,0,0.4);
  }
  .rece-tip {
    margin-top: 0.2rem;
  }

  .big-title h1 {
    background: url(../../images/tit-duihuanxinxi.png) no-repeat center center/contain;
  }

  .big-title.ios {
    position: absolute;
  }

  #main-box {
    padding-bottom: 5.11rem;
  }
</style>

<!-- 与胜利纪录共用样式 -->
<style>
  .sendinfo {
    font-size: .42rem;
  }

  .sendinfo.iphonex {
    min-height: 812px;
  }

  .detailinfo {
    padding: .42rem .3rem 0;
  }

  .prizeinfo {
    padding: .3rem;
    overflow: hidden;
    background: url("../../images/bg-wininfo-prize.png") no-repeat center/100% 100%;
  }

  .prizeinfo ul.prize-img {
    display: flex;
  }

  .prizeinfo ul.prize-img li {
    position: relative;
    height: 1.8rem;
  }

  .prizeinfo ul.prize-img li:nth-child(1) {
    width: 1.8rem;
    background: #eee;
  }

  .prizeinfo ul.prize-img li:nth-child(2) {
    flex: 1;
    padding: .1rem 0 0 .3rem;
  }

  .prizeinfo ul.prize-img li > p {
    line-height: .48rem;
  }

  .prizeinfo ul.prize-img li > div {
    position: absolute;
    bottom: 0;
    left: .48rem;
  }

  .prizeinfo ul.prize-img li .exchange-type-pic {
    font-size: .36rem;
    width: 1.82rem;
    height: .54rem;
    line-height: .57rem;
    text-align: center;
    text-indent: .14rem;
    padding-left: .16rem;
    color: #2c1609;
    background: url("../../images/opa-btn-bg.png") 0/100% 100%;
  }

  .prizeinfo ul.prize-img li .exchange-type-pic div {
    width: .68rem;
    height: .68rem;
    background: url("../../images/feats.png") 0/100% 100%;
    margin: -.66rem 0 0 -.4rem;
  }

  .prizeinfo ul.prize-img li .exchange-type-pic.wjf_pic div {
    background: url("../../images/score.png") 0/100% 100%;
  }

  .receiptinfo {
    margin-top: .3rem;
    overflow: hidden;
    padding: .3rem;
    background: url("../../images/bg-wininfo-prize.png") no-repeat center/100% 100%;
  }

  .receiptinfo h5 {
    position: relative;
    height: .8rem;
    margin-top: .15rem;
    line-height: .8rem;
    background: url("../../images/bg-win-tit.png") no-repeat center/contain;
  }

  .receiptinfo h5 span.addr-mod {
    position: absolute;
    top: .11rem;
    right: 0;
    width: .6rem;
    height: .6rem;
    background: url("../../images/bg-addr-mod.png") no-repeat center/100% 100%;
  }

  .receiptinfo ul.info-txt {
    margin-top: .15rem;
  }

  .receiptinfo ul.info-txt li dl {
    overflow: hidden;
    padding-top: .26rem;
    display: flex;
  }

  .receiptinfo ul.info-txt li dl dd {
    float: left;
  }

  .receiptinfo ul.info-txt li dl dd:nth-child(1) {
    width: 2.4rem;
  }

  .receiptinfo ul.info-txt li dl dd:nth-child(2) {
    flex: 1;
  }

  .sendstatu {
    height: 1.2rem;
    line-height: 1.2rem;
    margin-top: .3rem;
    background: url("../../images/bg-wininfo-send-1.png") no-repeat left/contain,
    url("../../images/bg-wininfo-send-2.png") no-repeat right/contain,
    url("../../images/bg-wininfo-send-3.png") repeat center/contain;
  }

  .sendstatu .span1 {
    padding-right: .28rem;
  }

  .submit-btn {
    position: fixed;
    left: 1.37rem;
    right: 1.33rem;
    bottom: 2.17rem;
    height: 2.94rem;
    padding: .87rem 0;
    background: #C4BDB3;
  }

  .btn-ok {
    display: block;
    margin: 0 auto;
    width: 4.3rem;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    background: url(../../images/btn-ok-submit.png) no-repeat center/100% 100%;
    font-size: .54rem;
    color: #9E3A1D;
  }
</style>
