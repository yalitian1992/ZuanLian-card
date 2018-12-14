<template>
  <div class="payMent">
    <div class="payBox">
      <div class="header">
        <div class="back-box" @click="Back">
          <img src="../../images/icon-Arrow.png" alt="">
        </div>
        <p>确认订单</p>
      </div>
      <div class="pay-main">
        <!--支付方式-->
        <div class="Rec-box Rec-mode">
          <p class="f-size">付款方式</p>
          <ul class="Rec-mode-list">
            <li class="mode-list-box Rec-alipay" @click="selected = !selected">
              <div class="fl"></div>
              <div class="fc">
                <p>支付宝支付</p>
              </div>
              <!--<div class="mt">
                <span>立减2%</span>
              </div>-->
              <div class="fr"><span class="opt" :class="{selected: selected}"></span></div>
            </li>
            <!--优惠券-->
            <li class="mode-list-box Rec-topay no-border">
              <div class="OrderInfo" style="width:100%;margin-left:0px;">
                <div class="Order-left">
                  <img src="../../images/postage-icon.png" alt="">
                </div>
                <div class="Order-center order-minus">
                  <div>
                    <p class="Money-txt"><span class="color-black">实物奖品运费</span></p>
                    <div class="integral-box">
                      <!--<p>
                        <span class="color-orange">送650宝箱符+<i>35789</i>优众积分</span>
                      </p>-->
                      <!--<p class="color-purple">￥<span>1450</span></p>-->
                    </div>
                    <!--<p class="sty coupon-ins">优惠券不提供退换货服务</p>-->
                    <p class="sty use-time">运费不提供退款服务<br/>请勿多次支付</p>
                  </div>
                </div>
                <div class="Order-right">
                  ￥<span>{{postage}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--结算-->
      <div class="account-box pay_btn">
        <div class="account-left">
          <div>
            <p class="total color-purple">￥{{postage}}</p>
          </div>
        </div>
        <button class="account-btn" @click="Account">结算</button>
      </div>
      <!--底部支付-->
      <!--<div class="pay-bottomBox">
        <div class="pay-bottom">
          <p>总额：￥<span>2310000000</span></p>
          <button>立即支付</button>
        </div>
      </div>-->
      <!--支付浮层-->
      <!--<div class="layerBox display">
        <div class="layerback">
          <div class="layer">
            <p>是否已完成支付</p>
            <div class="btn">
              <button>支付遇到问题</button>
              <button>完成支付</button>
            </div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>
<script>
  import '../../components/common/public.js'
  import {imgBaseUrl} from '../../config/config'
  export default{
    data (){
      return {
        id: '',
        postage: '',
        selected: true
      }
    },
    methods: {
      Account: function(){
        var _this = this
        let url = window.location.href
//          支付接口
        _this.$http({
          method: 'get',
          url: '/api/chest_records/alipay',
          params: {
            id: _this.id,
            return_url: url.slice(0, url.indexOf('#')) + '#/paymentSuccess' + '?token=' + _this.getCookie('intoToken')
          },
          headers: {accessToken: _this.getToken()}
        }).then(function(res){
          var data = res.body;
          if(data.execErrCode == 400 || data.execErrCode == 201){
            _this.toast("支付失败！")
          }else if(data.execErrCode == 200){
            window.location.href = data.execDatas.url;
          }
        })

        /*_this.asyncHttp('get','/api/chest_records/alipay',{
          id: _this.id,
          return_url: url.slice(0, url.indexOf('#')) + '#/paymentSuccess' + '?token=' + _this.getCookie('intoToken')
        }, function(data){
          window.location.href = data.execDatas.url;
        })*/
      },
      Back: function(){
        this.$router.replace({
          path: '/winningRecord',
          query: {from: 3, token: this.getToken(), native: 0}
        })
      }
    },
    components: {},
    mounted(){
      var _this = this
      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }

      _this.postage = _this.$route.query.Postage
      _this.id = _this.$route.query.id
    }
  }
</script>
<style scoped>
  html,body{
    height: 100% !important;
  }
  .payMent{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: #fff;
  }
  .payBox{
    max-width: 640px;
    margin: 0 auto;
    min-height: 100%;
  }
  .header{
    width: 100%;
    height: 46px;
    position: relative;
    background: #fff;
  }
  .back-box{
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 1;
    height: 30px;
    width: 30px;
  }
  .header .back-box > img {
    height: 18px;
    width: 0.3rem;
  }
  .header > p{
    text-align: center;
    font-size: 18px;
    line-height: 46px;
  }
  .OrderInfo{
    overflow: hidden;
    margin:15px 10px 15px 15px;
  }
  .OrderInfo > div{
    float: left;
  }
  .Order-left{
    width: 90px;
    height: 90px;
    overflow: hidden;
  }
  .Order-left img{
    width: 100%;
  }
  .Order-center{
    margin-left: 10px;
    width:  50%;
    position: relative;
    height: 100px;
  }
  .Order-center p{
    text-overflow: ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
  .Order-center p:nth-child(1){
    color: darkgray;
    font-size: 14px;
    line-height: 20px;
  }
  .Order-center p:nth-child(2){
    color: darkgray;
    font-size: 14px;
    margin-top: 4px;
  }
  .Money-txt{
    width: 100%;
  }
  .integral-box{
    overflow: hidden;
    margin: 0.06rem 0;
  }
  .integral-box p:nth-child(1){
    height: 20px;
    float: left;
  }
  .integral-box p:nth-child(2){
    float: right;
  }
  .Money-txt{
    height:40px;
  }
  .Order-center .sty{
    color: #8e8e8e;
    font-size: 12px;
  }
  div.Order-right{
    float: right;
    margin-top: 44px;
    color:  #911573;
    font-size: 12px;
    margin-right: 10px;
  }
  .Order-right span{
    font-size: 14px;
  }
  .Rec-box {
    background: #fff;
    border-top: 1px solid #d1d1d3;
  }
  .Rec-box>p{
    height: 40px;
    line-height: 40px;
    background-size: 24px;
    padding: 0 10px;
  }
  .Rec-mode-list,.Rec-mode-list li{
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    margin-left: 16px;
  }
  .Rec-mode-list li{
    padding: 12px 0;
    border-bottom:1px solid #ebebec;
  }
  .Rec-mode-list li:last-child{
    margin-bottom: 0px;
  }
  .Rec-mode-list{
    margin: 0 auto;
  }
  .mode-list-box .fl{
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }
  .mode-list-box .fc{
    margin-left: 12px;
  }
  .mode-list-box .fc h4{
    font-size: 20px;
    color: #e0dcff;
    font-weight: inherit;
  }
  .mode-list-box .fc p{
    font-size: 14px;
  }
  .mode-list-box .mt{
    position: absolute;
    right: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #911573;
  }
  .mode-list-box .fr{
    width: 24px;
    height: 42px;
    position: absolute;
    right: 14px;
    /*水平垂直居中*/
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .mode-list-box .fr span{
    display: block;
    width: 20px;
    height: 20px;
    background: url(../../images/no-selected-icon1.png) no-repeat center / contain;
  }
  .mode-list-box .fr span.selected{
    background: url(../../images/selected-icon1.png) no-repeat center / contain;
  }
  .Rec-alipay .fl{
    background: url(../../images/rec-pay.png) no-repeat center / contain;
  }
  .no-border{
    border-bottom: none !important;
  }
  .color-black{
    color: #272420;
  }
  .f-size{
    font-size: 16px !important;
  }

  @media screen and (max-width: 375px) and (min-width: 360px){
    .Order-center{
      width: 50%;
    }
  }
  @media screen and (max-width: 320px) {
    .integral-box{ padding: 1px 0; }
    .Money-txt{
      height: 28px;
      line-height: 14px !important;
    }

    .Order-center{
      width: 50%;
    }
    .header > p{
      font-size: 16px;
    }
    .header > img{
      height: 14px;
      top: 16px;
    }
    .Order-center{
      height: 80px;
    }
    .order-minus{
      width: 66%;
    }
    div.Order-right{
      line-height: 20px;
    }
    .Order-left{
      width: 80px;
      height: 80px;
    }
  }

  /*用户版——优惠券购买*/
  .account-box{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    border-top: 1px solid #d1d1d3;
    padding: 0px 14px;
    max-width: 680px;
    margin: 0 auto;
    background: #fff;
    height: 2.46rem;
  }
  .account-left{
    float:left;
    margin-top: .2rem;
  }
  .account-box p{
    margin-top: 0.4rem;
  }
  .total{
    font-size: 22px;
  }

  .account-btn{
    float:right;
    width: 3.6rem;
    height: 1.6rem;
    background: #911573;
    border-radius: 5px;
    font-size: 22px;
    color: white;
    margin-top:.4rem;
  }

  @media screen and (max-width:359px) and (min-width:320px){
    .Order-center p,.Order-center span{
      font-size: 12px !important;
    }
    .order-bg>p{
      text-align: center;
    }
    .account-btn{
      margin-top: 4px;
    }
    /*用户版—优惠券购买*/
    .total{
      font-size: 22px;
    }
  }
  @media screen and (min-width: 768px){
    .account-btn{
      width: 1.6rem;
      height: 0.8rem;
    }
  }

</style>
