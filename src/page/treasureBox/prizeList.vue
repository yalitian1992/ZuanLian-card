<template>
  <div class="main" :class="{iphonex: isIphonex,ios:isIos ,'inputCursor':bonus}">
    <div class="pre-box">
      <div class="topHeight" :class="{iphonex: isIphonex&&appOpen}" @click="goBack();">
        <p class="go-back"></p>
      </div>
      <div class="ruleBtn" @click="openRule"></div>
      <div class="rec-box">
        <div class="title">
          <p>我的钱包</p>
        </div>
        <div class="prizeTop">
          <p class="prizeTopOne">累计奖金</p>
          <p class="prizeTopNum">{{userInfo.withdrawals}}<span>元</span></p>

          <div class="withdrawNum"><span>未提现奖金:{{userInfo.balance}}元</span><router-link :to="{path: '/presentRecord', query: {native: 0}}">提现记录&nbsp;&gt;</router-link></div>
          <div class="withdrawBtn" @click="Withdraw">提现</div>
          <p class="annotation">注：只能提现整数值</p>
        </div>
        <div class="rec-content">
          <div class="moneyListBox">
            <div class="moneyListTitle">奖金明细</div>
            <ul class="moneyList">
              <li class="hb" v-for="(item,index) in prizeList">
                <div class="lc">
                  <p class="fc">{{item.trad_type}}</p>
                  <span>{{item.create_time}}</span>
                </div>
                <div class="rc">
                  <p class="fc">{{item.amount}}元</p>
                </div>
              </li>
            </ul>
            <div v-if="prizeList.length==0" class="noRecord">
              <span></span>
              <p>暂无奖金明细</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--提现弹框1-->
    <div class="get-box-mask" v-if="noEnough">
      <div class="get-box WithdrawBox">
        <div class="get-box-title align-c">奖金提现</div>
        <div class="get-box-close pull-right" @click="noEnough = false; setSlide()"></div>
        <div class="align-c WithdrawAlert">
          <p>最低提现额度为<span>{{userInfo.withdrawl.min_money}}</span>元，快去获取</p>
          <p>更多现金吧！</p>
          <div class="buttons">
            <p class="exchange-props" @click="goBack();">放弃道具</p>
            <p class="invite" @click="invitation()">邀请好友</p>
          </div>
        </div>
      </div>
    </div>
    <div class="get-box-mask" v-if="Enough">
      <div class="get-box EnoughMoney">
        <div class="get-box-title align-c">奖金提现</div>
        <div class="get-box-close pull-right" @click="Enough = false; setSlide()"></div>
        <div class="align-c WithdrawAlert">
          <p class="">奖金会在<span>1-5个工作日</span>内到账</p>
          <p>请留意查看<span>支付宝账户余额</span></p>
          <p>如有问题请联系客服</p>
          <p class="returnUrl" @click="Enough = false; setSlide()">知道了</p>
        </div>
      </div>
    </div>
    <!--规则说明-->
    <div class="rule-mask" v-if="ruleShow">
      <div class="rule">
        <div class="rule-title"></div>
        <div class="rule-close pull-right" @click="closeRule"></div>
        <div class="rule-con">
          <h4>Q：为什么我提不了现？</h4>
          <p>A：当“我的钱包”内金额达到{{userInfo.withdrawl.min_money}}元以上（含{{userInfo.withdrawl.min_money}}元），您就可以提现到支付宝账户，提现金额须为整数，单次提现金额小于{{userInfo.withdrawl.charge_amount}}元，将会产生{{userInfo.withdrawl.service_charge}}元手续费。为了保障您的账户安全，您在首次提现时需要绑定支付宝账户。</p>

          <h4>Q：怎么绑定支付宝？</h4>
          <p>A：您在首次提现时，会自动弹出支付宝绑定，需要您提供个人支付宝账户即可绑定，绑定后每次提现将默认提现至此支付宝账户。每个支付宝账户只可绑定一个集分竞宝账户，且每个集分竞宝账户只能绑定一个支付宝账户。</p>

          <h4>Q：我完成提现了，为什么支付宝账户没收到钱？</h4>
          <p>A：您的提现申请发起后，您的奖金将在1-5个工作日内到账，双休日、法定节假日顺延处理。</p>

          <h4>Q：在哪里查看提现进度和到账情况？</h4>
          <p>A：在集分竞宝APP内点击“头像”进入【我的钱包】，在【我的钱包】中点击【提现记录】即可查看提现历史和提现进度。</p>

          <h4>Q：我提现遇到了问题怎么办？</h4>
          <p>A：如果您在提现过程中遇到了问题，请联系客服。（客服电话：400-9005670；QQ：800825325，微信：weika4009005670）</p>
        </div>
      </div>
    </div>
    <!--奖金提现弹框无用户-->
    <div class="get-box-mask" v-if="bonus">
      <div class="get-box bonus-box">
        <div class="get-box-title align-c"><p>奖金提现</p></div>
        <div class="get-box-close pull-right" @click="bonus = false; setSlide()"></div>
        <h3>￥{{userInfo.use_balance}}</h3>
        <div class="h-tip">
          <p class="p h-pOne">到账金额：￥{{userInfo.real_balance}}</p>
          <p class="p h-pTwo">注：单笔提现{{userInfo.withdrawl.charge_amount}}元以下每笔收{{userInfo.withdrawl.service_charge}}元手续费</p>
        </div>
        <div class="ul-line-bo"></div>
        <ul>
          <li>
            <p class="p t-one">请输入支付宝账号提取现金</p>
            <p class="p t-two">注：未认证的支付宝账号不能接受转账</p>
          </li>
          <li class="li-input-bg">
            <div class="li">
              <input v-model="alipay.alipay_account" type="text" placeholder="请输入支付宝账户" maxlength="36">
              <span class="clear" @click="alipay.alipay_account=''"></span>
            </div>
            <div class="line-bo"></div>
            <div class="li">
              <input v-model="alipay.confirm_alipay_account" type="text" placeholder="确认支付宝账户" maxlength="36">
              <span class="clear" @click="alipay.confirm_alipay_account=''"></span>
            </div>
          </li>
          <li>
            <p class="p t-three" v-if="nameOccupy">支付宝账户被占用请重新输入</p>
            <button @click="alipayBtn">提交</button>
          </li>
        </ul>
      </div>
    </div>
    <!--奖金提现弹框-->
    <div class="get-box-mask " v-if="Withdrawal">
      <div class="get-box moneyBox">
        <div class="get-box-title align-c">奖金提现</div>
        <div class="get-box-close pull-right" @click="Withdrawal = false; setSlide()"></div>
        <div class="align-c moneyBoxMian">
          <p>￥{{userInfo.use_balance}}</p>
          <p class="p h-pOne">到账金额：￥{{userInfo.real_balance}}</p>
          <p>注：单笔提现{{userInfo.withdrawl.charge_amount}}元以下每笔收{{userInfo.withdrawl.service_charge}}元手续费</p>
          <p class="line"></p>
          <p>提现支付宝账号</p>
          <p>{{userInfo.alipay_account}}</p>
          <p class="returnUrl" @click="dePosit">提交</p>
        </div>
      </div>
    </div>
    <!--前往集分竞宝-->
    <div class="get-box-mask" v-if="downAlert">
      <div class="get-box return-downs">
        <div class=" align-c placeholder"></div>
        <div class="get-box-close pull-right" @click="downAlert = false; setSlide()"></div>
        <div class="align-c WithdrawAlert">
          <p class="text-bottom">请前往集分竞宝APP提现</p>
          <p class="returnUrl" @click="goDown">下载集分竞宝</p>
        </div>
      </div>
    </div>
    <div class="bgshow" v-if="bgshow" @click='bgshow=false'>
      <div class="bgtext"></div>
    </div>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  import wx from 'weixin-js-sdk'
  export default {
    data () {
      return {
        imgBaseUrl,
        isIphonex: false,      //是否是iPhonex
        isIos: false,
        prizeList:[],
        userInfo:{
          alipay_account:'',
          alipay_name:'',
          balance:'0',
          is_bind_alipay:'',
          use_balance:'0',
          withdrawals:'0',
          real_balance:'0',
          withdrawl: {
            min_money: 5,
            charge_amount: 100,
            service_charge: 2
          }
        },
        alipay:{
          alipay_account: '',
          confirm_alipay_account: ""
        },
        noEnough:false,//余额不足
        Enough:false,//提现完成
        ruleShow:false,//规则
        bonus:false,//支付宝提现
        Withdrawal:false,//直接提现框
        downAlert:false,//浏览器打开下载弹框
        page:1,
        isHttp:true,
        nameOccupy:false,
        isApp:false, //是否在app打开
        wxShareName: '',
        wxShareTitle: '',
        wxShareImg: '',
        code: '',
        wxUrl: "",
        bgshow: false,     //微信提示是否显示
        token:'',
      }
    },
    created () {
      this.token = this.getCookie('intoToken');
      this.wxpz()
      this.wxShare()
    },
    methods: {
      //提现按钮
      Withdraw:function(){
        if (this.isApp) {
          this.$http({
            method: 'post',
            url: '/card-service-web/user/queryUserByAccessToken',
            headers: {accessToken: this.getCookie('intoToken')}
          }).then(function (res) {
            var data = res.body;
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.execErrCode == 200) {
              if(data.execData.openId){
                //有openid 判断是否有手机号
                if (data.execData.user.mobile.slice(0, 5) == '10000') {
                  this.toast('您还未绑定手机')
                  let _this=this;
                  setTimeout(function(){
                    _this.clientType(function () {
                      window.Android.integralBindingPhone();
                    }, function () {
                      window.webkit.messageHandlers.AppModel.postMessage('integralBindingPhone');
                    })
                  },500)
                } else {
                  //余额
                  if(this.userInfo.use_balance>=this.userInfo.withdrawl.min_money){
                    //绑定
                    if(this.userInfo.is_bind_alipay){
                      this.Withdrawal=true
                      this.setSlide(0)
                    }else{
                      this.bonus = true
                      this.setSlide(0)
                    }
                  }else{
                    this.noEnough=true
                    this.setSlide(0)
                  }
                }
              }else{
                //没有openId调用原生绑定
                this.toast('您还未绑定微信')
                let _this=this;
                setTimeout(function(){
                  _this.clientType(function () {
                    window.Android.phoneBindingWx();
                  },function(){
                    window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx');
                  })
                },500)
              }

            }
          })
        }else{
          //弹框去下载或打开app
          this.downAlert = true;
          this.setSlide(0)
//          //余额
//          if(this.userInfo.use_balance>=this.userInfo.withdrawl.min_money){
//            //绑定
//            if(this.userInfo.is_bind_alipay){
//              this.Withdrawal=true
//              this.setSlide(0)
//            }else{
//              this.bonus = true
//              this.setSlide(0)
//            }
//          }else{
//            this.noEnough=true
//            this.setSlide(0)
//          }
        }
      },
      goDown:function(){
        let url = window.location.href;
        window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down?status=2';
      },
      alipayBtn:function(){
        if(!this.alipay.alipay_account){
          this.toast('账号不能为空')
          return
        }
        if(!this.alipay.confirm_alipay_account){
          this.toast('账号不能为空')
          return
        }
        //绑定提现
        if(this.alipay.alipay_account == this.alipay.confirm_alipay_account){
          this.$http({
            method: 'post',
            url: '/api/withdrawals_orders/bind_alipay',
            headers: {accessToken: this.getCookie('intoToken')},
            body:this.alipay
          }).then(function(data){
            let status=data.body.execErrCode
            if(status==200){
              this.bonus = false;
              this.setSlide()
              this.topInfo()
              this.dePosit()
            }else if(status==403){
              this.nameOccupy=true
            }else if(status==4003){
              this.goLogin();
            }else{
              this.toast(data.body.execMsg);
            }
          })
        }else {
          this.toast("账号不一致")
        }
      },
      //直接提现
      dePosit:function(){
        this.$http({
          method: 'post',
          url: '/api/withdrawals_orders/apply',
          headers: {accessToken: this.getCookie('intoToken')},
          body:{amount:this.userInfo.use_balance}
        }).then(function(data){
          this.Withdrawal=false
          this.setSlide()
          let status=data.body.execErrCode
          if(status==200){
            this.Enough=true
            this.page=1
            this.setSlide(0)
            this.topInfo()
            this.ListHttp()
          }else if(status==403){
            this.noEnough=true
            this.setSlide(0)
          }else if(status==4003){
            this.goLogin();
          }else{
            this.toast(data.body.execMsg);
          }
        })
      },
      //滚动奖金列表
      ListHttp: function () {
        if (this.isHttp) {
          var _this = this;
          _this.isHttp = false;
          this.asyncHttp('get', '/api/withdrawals_orders/balance_list', {page: this.page}, function (data) {
            _this.isHttp = true;
            if (data.execDatas.length < 20) {
              _this.isHttp = false;
            }
            if (_this.page == 1) {
              _this.prizeList = data.execDatas
            } else {
              _this.prizeList = _this.prizeList.concat(data.execDatas);
            }
            _this.page++;
          });
        }
      },
      topInfo:function(){
        //明细
        this.$http({
          method: 'get',
          url: '/api/withdrawals_orders/balance_detail',
          headers: {accessToken: this.getCookie('intoToken')},
        }).then(function(data){
          if(data.body.execErrCode){
            if(data.body.execErrCode ==4003){
              this.goLogin();
            }else{
              this.toast(data.body.execMsg)
            }
          }else{
            this.userInfo = data.body
          }
        })
      },
      /*打开规则弹框*/
      openRule: function () {
        this.ruleShow = true;
        if (!this.isIphonex) {
          let html = document.documentElement, body = document.body, scrollTop = body.scrollTop;
          html.style.overflow = 'hidden';
          body.style.overflow = 'hidden';
          body.className = 'body-fixed';
          body.style.position = 'fixed';
          body.style.top = scrollTop * -1 + 'px';
        }
      },

      /*关闭规则弹框*/
      closeRule: function () {
        this.ruleShow = false;
        this.deleteNoScroll();
      },
      /*取消禁止滑动*/
      deleteNoScroll: function () {
        let _this = this, html = document.documentElement, body = document.body;
        _this.clientType(function () {
          html.style.overflowY = 'scroll';
          body.style.overflowY = 'scroll';
          body.className = '';
          body.scrollTop = body.style.top.slice(0, -2) * -1;
          body.style.top = null;
          body.style.position = null;
        }, function () {
          if (!_this.isIphonex) {
            html.style.overflow = null;
            body.style.overflow = null;
            body.className = '';
            body.style.top = null;
            body.style.position = 'relative';
          }
        })
      },
      /*邀请*/
      invitation: function () {
        if (this.isApp) {
          this.clientType(function () {
            window.Android.InviteFriendWechat();
          }, function () {
            window.webkit.messageHandlers.AppModel.postMessage({type: 'inviteFriends'});
          })
        } else {
          var ua = window.navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.bgshow = true;

          } else {
            let url = window.location.href;
            window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
          }
        }
      },
      wxShare: function () {//微信分享
        let str = localStorage["url"];
        var targetUrl = window.location.href || str;
        this.code = str.substring(str.indexOf("=") + 1, str.indexOf("&"))
        this.$http({
          method: 'post',
          url: '/card-service-web/h5/wxAuthor/getSignature',
          params: {url: window.location.href}
        }).then(function (res) {
          if (res.body.execErrCode == 200) {
            wx.config({
              debug: false,
              appId: 'wx303bd1d29db76d97',
              timestamp: res.body.execData.timestamp,
              nonceStr: res.body.execData.noncestr,
              signature: res.body.execData.signature,
              jsApiList: [
                'onMenuShareAppMessage',
                'onMenuShareTimeline'
              ]
            })
          }
        })
        var _this = this
        wx.ready(() => {
          // 发送给朋友
          wx.onMenuShareAppMessage({
            title: _this.wxShareName,
            desc: _this.wxShareTitle,
            link: _this.wxUrl,
            imgUrl: _this.wxShareImg,
            success: function (res) {
              this.bgshow = false
            },
            cancel: function (res) {
              this.bgshow = false
            }
          })
          // 朋友圈
          wx.onMenuShareTimeline({
            title: _this.wxShareName + _this.wxShareTitle,
            link: _this.wxUrl,
            imgUrl: _this.wxShareImg,
            success: function (res) {
              this.bgshow = false
            },
            cancel: function (res) {
              this.bgshow = false
            }
          })
        })
      },
      wxpz: function () {
        let _this = this;
        //分享配置信息
        this.$http({
          method: 'post',
          url: '/card-service-web/task/invitation',
          headers: {accessToken: _this.token}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            _this.wxUrl = res.body.execData.inviUrl + "?inviIden=" + res.body.execData.inviIden + "&inviInfoIden=" + res.body.execData.inviInfoIden
            _this.wxShareTitle = res.body.execData.copiesList.content
            _this.wxShareName = res.body.execData.copiesList.title
            _this.wxShareImg = _this.imgBaseUrl() + res.body.execData.copiesList.thumbnail
          } else {
            //_this.toast(data.execMsg);
          }
        })
      }
    },
    components: {

    },
    mounted(){
      let _this = this;
      if (navigator.userAgent.indexOf("jfjingbao") > -1) {
        this.isApp = true;
      }
      this.clientType(function(){},function(){
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        }else{
          _this.isIos = true;
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })
      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }
      _this.token = this.getCookie('intoToken');
      _this.topInfo()
      _this.ListHttp()
      /*滑到底部加载下一页*/
      var dom =document.getElementsByClassName('moneyList')[0]
      dom.onscroll = function () {
        let scrollTop = dom.scrollTop,
          scrollHeight = dom.scrollHeight,
          clientHeight = dom.clientHeight;
        if (scrollHeight - scrollTop - clientHeight <= 50) {
          _this.ListHttp();
        }
      }
//      //奖金列表
//      this.$http({
//        method: 'get',
//        url: '/api/withdrawals_orders/balance_list',
//        headers: {accessToken: _this.getCookie('intoToken')},
//        params: {page: this.page}
//      }).then(function(data){
//        _this.prizeList = data.body.execDatas
//      })
    }

  }
</script>
<style scoped>
  .li-input-bg{
    background: url("../../images/mb-bg.png") no-repeat center/100% 100%;
    width: 76%;
    margin: 0 auto;
  }
  .line-bo{
    margin: 0 auto;
    width: 95%;
    height: 1px;
    background: url("../../images/input-border-bg.png") no-repeat center/100% 100%;
  }
  .ul-line-bo{
    margin: 0.4rem auto;
    width: 80%;
    height: 1px;
    background: url("../../images/input-border-bg.png") no-repeat center/100% 100%;
  }
  /* 两端对齐 */
  .hb {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    /*justify-content: left;*/
  }
  /*iphoneX适配*/
  .main.iphonex{
    height: 100%;
    min-height:812px;
  }
  .main.ios{
    height: 100%;
  }
  .main.ios.inputCursor {
    width: 100%;
    position: fixed;
  }
  .topHeight.iphonex{
    position: absolute;
    top:33px;
  }

  .pre-box,.rec-box{
    height: 100%;
  }
  .pre-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10% 5% 9% 5%;
    background: url("../../images/box-bg.jpg");
    background-size: 100% 100%;
  }
  .topHeight{
    position: absolute;
    top: 0;
    left: 0;
    width: 1.8rem;
    height: 1.6rem;
    padding: .2rem 0 0 .4rem;
    z-index: 2;
  }
  .ruleBtn{
    position: absolute;
    top: .3rem;
    right: .6rem;
    width: 1.4rem;
    height: .96rem;
    z-index: 2;
    background: url("../../images/monyHelp.png") no-repeat center/100% 100%;
  }
  .go-back{
    width: 0.9rem;
    height: 0.9rem;
    background: url("../../images/go-back.png");
    background-size: 100% 100%;
  }
  .rec-box{
    position: relative;
    padding: 1.1rem 0.4rem 0.8rem 0.4rem;
    background: url("../../images/brown-bg.png");
    background-size: 100% 100%;
  }
  .rec-box .title{
    position: absolute;
    top: -0.4rem;
    left: 0;
    right: 0;
  }
  .rec-box .title p{
    margin: 0 auto;
    width: 80%;
    height: 1.3rem;
    line-height: 1.04rem;
    font-size: 0.51rem;
    color: #ffe9a6;
    text-align: center;
    background: url("../../images/win-title-bg.png");
    background-size: 100% 100%;
  }
  .rec-content{
    width: 100%;
    height: 100%;
    background: url("../../images/rec-bg.png") no-repeat center/100% 100%;
    overflow: hidden;
  }
  .prizeTop{
    position: absolute;
    left:0;
    right:0;
    text-align: center;
    font-size:0.36rem;
    padding:.5rem 0 0;
  }
  .prizeTopOne{
    font-size:.45rem;
    color: #6e442a;
  }
  .prizeTopNum{
    font-size:1.2rem;
    color: #272420;
    margin:.3rem auto;
  }
  .prizeTopNum > span{
    font-size:.48rem;
  }
  .withdrawNum{
    font-size:.39rem;
    color: #272420;
  }
  .withdrawNum a{
    color: #d44400;
    display: inline-block;
    margin-left:.3rem;
  }
  .withdrawBtn{
    width:3.16rem;
    height:1.08rem;
    background: url("../../images/btn-ok-submit.png") no-repeat center/100% 100%;
    margin:.38rem auto .18rem;
    font-size:0.48rem;
    color: #9e3a1d;
    line-height: 1.08rem;
  }
  .annotation{
    font-size:0.36rem;
    color: #6e442a;
  }
  /*list*/
  .moneyListBox{
    padding:.8rem 0 .26rem;
    border:1px solid #c69452;
    background: #e4d1b8;
    /*position: absolute;*/
    /*top:7.2rem;*/
    /*left: .97rem;*/
    /*right:.97rem;*/
    /*bottom:1.63rem;*/
    top:8.5rem;
    left: 1.57rem;
    right:1.57rem;
    bottom:2.63rem;
    position: fixed;
  }
  .moneyListTitle{
    width:2.76rem;
    height:.54rem;
    line-height: .54rem;
    color: #6e442a;
    font-size:.45rem;
    background: url("../../images/monbg-title.png") no-repeat center -1px/100% 100%;
    margin:0 auto;
    text-align: center;
    position: absolute;
    left:0;
    right:0;
    top:0;
  }
  .moneyList{
    width: 100%;
    height: 100%;
    position:relative;
    z-index:1;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .moneyList li{
    padding: 0.48rem 0.3rem 0 0.3rem;
  }
  .moneyList li:after{
    content:" ";
    width: 100%;
    height: 1px;
    background: url("../../images/border-bottom.png") no-repeat center/100% 100%;
  }

  .moneyList li span{
    display: block;
    margin-bottom: 0.48rem;
    font-size: 0.36rem;
  }
  .moneyList li p{
    margin-bottom: 0.3rem;
  }
  .moneyList .lc>p{
    font-size: 0.48rem;
  }
  .moneyList .lc>span{
    color: rgb(110,68,42)
  }
  .moneyList .rc>p{
    font-size: 0.6rem;
  }
  .moneyList .rc>span{
    width: 100%;
    text-align: right;
  }
  /*弹框*/
  .rule-mask,.get-box-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1115;
    background: rgba(0, 0, 0, .8);
  }
  .get-box-close{
    width: 1.14rem;
    height: 1.14rem;
    background: url("../../images/icon-close.png") 0/100% 100%;
    margin: -.4rem -.72rem 0 0;
  }
  /*奖金弹框*/
  .get-box {
    position: absolute;
    top: 6.7rem;
    left: 1.45rem;
    right: 1.45rem;
    height: 6.9rem;
    background: url("../../images/get-box-bg.png") 0/100% 100%;
  }
  .WithdrawBox{
    height:6rem;
  }

  .get-box-title {
    width: 4.8rem;
    height: 1.11rem;
    line-height: .9rem;
    font-size: .48rem;
    color: #f0c253;
    background: url("../../images/get-box-title.png") 0/100% 100%;
    margin: -.25rem auto;
  }
  .return-downs{
    height:6rem;
  }
  .placeholder{
    width: 4.8rem;
    height: 1.11rem;
    margin: -.25rem auto;
  }
  .text-bottom{
    margin:.8rem auto 1.4rem;
  }

  .get-box-con > div {
    width: 8.32rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .42rem;
    color: #fff;
    margin: .45rem auto;
    padding-left: .48rem;
    background: url("../../images/get-way-bg.png") 0/100% 100%;;
  }

  .get-box-con > div:first-child {
    margin-top: .6rem;
  }

  .get-box-con > div.font {
    font-size: .39rem;
  }

  .get-box-con > div span {
    width: .15rem;
    height: .24rem;
    margin: .48rem .36rem 0 0;
    background: url("../../images/triangle.png") 0/100% 100%;;
  }
  .how-open{

  }
  .WithdrawAlert{
    font-size:.48rem;
    color: #fff;
  }
  .WithdrawAlert span{
    color: #fff500;
  }
  .returnUrl{
    display: block;
    width:3.66rem;
    height:1.08rem;
    background: url("../../images/btn-ok-submit.png") no-repeat center/100% 100%;
    font-size:0.48rem;
    color: #9e3a1d;
    line-height: 1.08rem;
    margin:0 auto;
  }
  .buttons p{
    display: inline-block;
    width:3.66rem;
    height:1.08rem;
    font-size:0.48rem;
    color: #9e3a1d;
    line-height: 1.08rem;
    margin:0 .3rem !important;
  }
  .exchange-props{
    background: url("../../images/cacel-btn.png") no-repeat center/100% 100%;
  }
  .invite{
    background: url("../../images/btn-ok-submit.png") no-repeat center/100% 100%;
  }
  .WithdrawBox .WithdrawAlert {
    margin:.9rem auto 0;
  }
  .WithdrawBox .WithdrawAlert p:nth-child(2){
    margin:.2rem auto .9rem;
  }
  .EnoughMoney .WithdrawAlert{
    margin:.9rem auto 0;
  }
  .EnoughMoney .WithdrawAlert p:nth-child(2){
    margin:.2rem auto;
  }
  .EnoughMoney .WithdrawAlert p:nth-child(3){
    margin-bottom:.9rem;
  }
  /*提现帮助*/
  .rule {
    position: absolute;
    top: 10%;
    left: 1.15rem;
    right: 1.15rem;
    bottom: 13%;
    background: url("../../images/rule-bg.png") 0/100% 100%;
  }

  .rule .rule-title {
    width: 4rem;
    height: 1.11rem;
    background: url("../../images/Withdrawal-title.png") 0/100% 100%;
    margin: -.25rem auto;
  }

  .rule .rule-close, .get-box-close, .get-invented-close, .after-receive .close-btn {
    width: 1.14rem;
    height: 1.14rem;
    background: url("../../images/icon-close.png") 0/100% 100%;
    margin: -.4rem -.72rem 0 0;
  }

  .rule .rule-con {
    padding: 0 .96rem;
    font-size: .36rem;
    line-height: .54rem;
    color: #ead9d1;
    height: 85%;
    overflow-y: auto;
    width: 100%;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .rule .rule-con p {
    margin-bottom: 0.3rem;
  }

  .rule .rule-con h4 {
    margin-bottom: 0.1rem;
  }
  /*奖金弹框start*/
  .bonus-box-bg{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /*background: rgba(0,0,0,0.6);*/
  }
  .bonus-box{
    top:2rem;
    height: 12.6rem;
    background: url("../../images/withdraw-bg.png") 0/100% 100%;
  }
  .bonus-box .tip{
    position: absolute;
    top: -0.3rem;
    left: 0;
    right: 0;
  }
  .bonus-box .tip>p{
    margin: 0 auto;
    height: 1.3rem;
    /*line-height: 1.3rem;*/
    width: 4.3rem;
    font-size: 0.48rem;
    color: rgb(209,160,54);
    text-align: center;
    background: url("../../images/get-box-title.png") no-repeat center/100% 100%;
  }
  .bonus-box i{
    display: block;
    width: 1.4rem;
    height: 1.4rem;
    position: absolute;
    right: -0.9rem;
    top: 0.2rem;
    background: url("../../images/clone1.png") no-repeat center/100% 100%;
  }
  .bonus-box h3{
    position: absolute;
    top: 1.4rem;
    left: 0;
    right: 0;
    font-size: 1.2rem;
    color: rgb(39,36,32);
    text-align: center;
  }
  .bonus-box ul{
    position: absolute;
    top: 5.2rem;
    left: 0;
    right: 0;
  }
  .bonus-box ul:before{
    content:" ";
    width: 100%;
    height: 1px;
    background: url("../../images/border-line.png") no-repeat center/100% 100%;
  }
  .bonus-box ul .li{
    position: relative;
  }
  .bonus-box ul input{
    display: block;
    margin: 0 auto 0.08rem auto;
    padding: 0 0.8rem 0 0.6rem;
    width: 100%;
    height: 1.3rem;
    font-size: 0.42rem;
    background: rgba(0,0,0,0);
    /*background: url("../../images/input-bg-bg.png") no-repeat center/100% 100%;*/
  }
  ul input::-webkit-input-placeholder {
    color: rgba(47,26,16,0.8);
    font-size: .42rem;
  }
  ul input:-moz-placeholder {
    color: rgba(47,26,16,0.8);
    font-size: .42rem;
  }
  ul input::-moz-placeholder {
    color: rgba(47,26,16,0.8);
    font-size: .42rem;
  }
  ul input:-ms-input-placeholder {
    color: rgba(47,26,16,0.8);
    font-size: .42rem;
  }

  .h-tip{
    clear: both;
    margin-top: 2.4rem;
  }
  .h-pOne{
    font-size: 0.48rem;
    color: rgb(39,36,32)
  }
  .h-pTwo{
    margin-top: 0.24rem;
    font-size: 0.39rem;
    color: rgb(176,123,90)
  }
  .p{
    text-align: center;
  }
  .t-one{
    font-size: 0.48rem;
    color: rgb(39,36,32);
    margin-bottom: 0.24rem;
  }
  .t-two{
    font-size: 0.36rem;
    color: rgb(176,123,90);
    margin-bottom: 0.48rem;
  }
  .t-three{
    margin-top: 0.3rem;
    font-size: 0.39rem;
    color: rgb(209,53,27)
  }
  .clear{
    display: block;
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 0.14rem;
    right: 0.1rem;
    background: url("../../images/clear-icon.png") no-repeat center/50% 50%;
  }
  .bonus-box button{
    display: block;
    margin: 0.48rem auto 0 auto;
    width: 3.3rem;
    height: 1rem;
    font-size: 0.48rem;
    color: #9e3a1d;
    background: url("../../images/openBox-bg-receive.png") no-repeat center/100% 100%;
  }
  /*奖金弹框end*/
  /*奖金提现*/
  .moneyBox{
    height:9.6rem;
    top:4.7rem;
    left:1.11rem;
    right:1.11rem;
    background:url("../../images/withdraw-bg.png") no-repeat center/100% 100%;
  }
  .moneyBoxMian{
    font-size: .48rem;
    color: #fff;
  }
  .moneyBoxMian p:nth-child(1){
    font-size:1.2rem;
    color: #272420;
    padding:.4rem 0 .1rem;
    text-align: center;
  }
  .moneyBoxMian p:nth-child(2){
    color: #272420;
    font-size:.48rem;
    margin-bottom:.15rem;
  }
  .moneyBoxMian p:nth-child(3){
    color: #b07b5a;
    font-size:.39rem;
  }
  .moneyBoxMian p:nth-child(5){
     font-size:.54rem;
     color: #272420;
     text-align: center;
   }
  .moneyBoxMian p:nth-child(6){
    font-size:.48rem;
    color: #8a6951;
    text-align: center;
    padding:.3rem 0 .54rem;
  }
  .line{
    width: 94%;
    height: 1px;
    background: url('../../images/border-bottom.png') no-repeat center/100% 100%;
    margin:.64rem auto 0.60rem;
  }
  .noRecord{
    position: absolute;
    left: 0;
    right: 0;
    top: 25%;
    bottom:0;
    margin:0 auto;
  }
  .noRecord span{
    display: block;
    margin: 0 auto;
    width: 3.6rem;
    height: 3.6rem;
    background: url("../../images/no-content-icon.png") no-repeat center/contain;
  }
  .noRecord p{
    margin-top: 0.45rem;
    font-size: 0.35rem;
    color: #ab8a67;
    text-align: center;
  }
</style>
