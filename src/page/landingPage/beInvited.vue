<template>
  <div class="bg" :class="{iphonex: isIphonex}">
    <!--<div class="back-btn" @click="goBack()"></div>-->
	<div class="inv_box">
		<div class="title">
			瓜分现金500万
		</div>
		<div class="name_text">
			<p>您的好友<img :src=" headImg"/>{{name}}</p>
			<p>正在【集分竞宝】瓜分现金500万</p>
			<p>邀您一起参与，并送您<span>{{jine}}</span>元现金红包</p>
		</div>
		<div class="red_box">
			<p>{{jine}}元</p>
		</div>
		<div class="phoneNum" v-if='isWin'>
			<input type="phone" placeholder="输入手机号领取红包" v-model="phone"/>
		</div>
		<div class="add_btn" @click="adds">
			立即领取
		</div>
		<div class="tishi">红包可在【我的钱包】提现</div>
	</div>
    <div class="bgshow" v-if="bgshow" >
      <div class="okText" v-if="okText">
      	<div class="okTeitl">恭喜</div>
      	<p style="color: #fff;">成功领取<span>0.5</span>元现金</p>
      	<p >下载集分竞宝</p>
      	<p style="color: #ffde9;">参与瓜分现金500万</p>
      	<div class="down" @click="down">下载集分竞宝</div>
      	<p class="tishi">现金可在【我的钱包】提现</p>
      	<div class="clonse" @click="cloneBox"></div>
      </div>
      <div class="okText" v-if="chongfu">
      	<p style="color: #fff;">不能重复领取</p>
      	<p>下载集分竞宝</p>
      	<p style="color: #ffde9;">参与瓜分现金500万</p>
      	<div class="down"  @click="down">下载集分竞宝</div>
      	<p class="tishi">现金可在【我的钱包】提现</p>
      	<div class="clonse" @click="cloneBox"></div>
      </div>
      <div class="okText" v-if="notext">
      	<p style="color: #fff;">您已注册无法领取</p>
      	<p>下载集分竞宝</p>
      	<p style="color: #ffde9;">参与瓜分现金500万</p>
      	<div class="down"  @click="down">下载集分竞宝</div>
      	<p class="tishi">现金可在【我的钱包】提现</p>
      	<div class="clonse" @click="cloneBox"></div>
      </div>
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
        token: '',
        headImg:'',//头像
        name:'',//昵称
        isWin:false,
        phone:'',//手机号
        jine:'0.5',//金额
        isIphonex: false, //是否是iphoneX
        isApp: false,     //是否在APP内
        bgshow: false ,    //微信提示是否显示
        okText:false,//成功
        chongfu:false,//重复
        notext:false,//已注册
        appName:''
      }
    },
    created () {
      
    },
    methods: {  
      dataHttp: function () {
        this.$http({
          method: 'get',
          url: '/card-service-web/task/queryInvition',
         params: {inviInfoIden: this.$route.query.inviInfoIden,appName:this.appName}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            this.name=data.execData.inviInfo.nickName
            this.headImg=data.execData.inviInfo.headUrl
          } else if (data.execErrCode == 4003) {
            this.goLogin();
          } else {
            this.toast(data.execMsg);
          }
        })
      },
      cloneBox:function(){
      	this.okText=false
      	this.chongfu=false
      	this.notext=false
      	this.bgshow=false
      },
      adds:function(){
			var ua = window.navigator.userAgent.toLowerCase();
		  if (ua.match(/MicroMessenger/i) != 'micromessenger') {
		  	if (!this.phone) {
          this.toast('请输入手机号');
          return false;
        } else if (!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.phone)) {
          this.toast('手机号码格式不正确');
          return false;
        }else{
        	this.$http({
		          method: 'post',
		          url: '/card-service-web/user/checkMobile',
		          params: {mobile: this.phone}
		        }).then(function (res) {
		          let data = res.body;
		          if (data.execErrCode == 200) {
		            if(data.execData==1){
		            	this.notext=true
		            	this.bgshow=true
		            }else{
			            	this.$http({
					          method: 'post',
					          url: '/card-service-web/task/bookKeeping',
					          params: {mobile: this.phone,inviIden:this.$route.query.inviIden}
					        }).then(function (res) {
					          let data = res.body;
					          if (data.execErrCode == 200) {
					            if(data.execData==1){
					            	this.okText=true
					            	this.bgshow=true
					            }else if(data.execData==2){
					            	this.chongfu=true
					            	this.bgshow=true
					            }
					           }else if(data.execErrCode == 906){
					           		this.chongfu=true
					            	this.bgshow=true
					           
					           }else{
					           		this.toast(data.execMsg);
					           }
					        })
		            }
		    				}
		       
		        })
        	}
				}else{
					if(this.$route.query.state==undefined){
						let url = window.location.origin + '/card/#/transitionNext'+'?inviInfoIden='+this.$route.query.inviInfoIden;
								//console.log(url)
	    		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx303bd1d29db76d97&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect';
      		}
				
				}
      	
      },
      down:function(){
      	let url = window.location.href;
				window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
      }
    },
    mounted(){
      let _this = this;
      
      //console.log(this.$route.query.state)
      if(_this.$route.query.state==200){
      	_this.okText=true
      	_this.bgshow=true
      }else if(_this.$route.query.state==357){
      	_this.chongfu=true
      	_this.bgshow=true
      }else if(_this.$route.query.state==311){
      	_this.notext=true
      	_this.bgshow=true
      }
      if (navigator.userAgent.indexOf("jfjingbao") > -1) {
        this.isApp = true;
      }
		  var ua = window.navigator.userAgent.toLowerCase();
		  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				this.isWin=false
				console.log(_this.$route.query.state==undefined)
				
			}else{
				this.isWin=true
				
			}
    	

     
		 let u = navigator.userAgent;
	      if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
	        this.appName = 'ios';
	        if (window.screen.height == 812) {
	          this.isIphonex = true;
	        }
	      } else {
	        this.appName = 'Android';
	      }
	       this.dataHttp();
      _this.clientType(function () {
      }, function () {
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        }
      })
      
    }
  }
</script>
<style scoped>
  .bg {
    min-height: 22.08rem;
    padding-top: 3rem;
    background: url("../../images/chakan.png") 0/100% 100%;
  }
  .bgshow {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1120;
    background: rgba(0, 0, 0, .8);
  }
  .clonse{
    	width: .9rem;
    	height: 1.1rem;
    	background: url("../../images/clone1.png") 0/100% 100%;
    	position: absolute;
    	right: -.3rem;
    	top: .2rem;
    }
  .inv_box{
  	width: 10.88rem;
  	padding-bottom: 2rem;
  	background: url("../../images/chakan_bg.png") 0/100% 100%;
  	position: absolute;
  	top: 2.5rem;
  	left: 6%;
  }
  .title{
  	color: #FFD05E;
  	font-size: .72rem;
  	text-shadow: 6px 12px 70%;
  	text-align: center;
  	width: 9.34rem;
  	height: 1.43rem;
  	line-height: 1rem;
  	margin: 0 auto;
  	margin-top: -.5rem;
  	background: url("../../images/caidai.png") 0/100% 100%;
  }
  .name_text{
  	margin-top: .57rem;
  }
  .name_text p{
  	text-align: center;
  }
  .name_text p:nth-child(1){
  	color: #4a2a0f;
  	font-size: .45rem;
  	
  }
  .name_text p:nth-child(1) img{
  	display: inline-block;
  	width: .9rem;
  	height: .9rem;
  	border-radius: 50%;
  	overflow: hidden;
  }
  .name_text p:nth-child(2){
  	color: #d1312b;
  	font-size: .54rem;
  	margin-top: .25rem;
  }
  .name_text p:nth-child(3){
  	color: #4a2a0f;
  	font-size: .45rem;
  	margin-top: .25rem;
  }
  .name_text p:nth-child(3) span{
  	color: #d1312b;
  }
  .red_box{
  	width: 4.17rem;
  	height: 5.52rem;
  	margin: 0 auto;
  	margin-top: .51rem;
  	padding-top: 2.94rem;
  	margin-bottom: .8rem;
  	background: url("../../images/ren_box.png") 0/100% 100%;
  }
  .red_box p{
  	width: 100%;
  	text-align: center;
  	color: #fff;
  	font-size: .81rem;
  	text-shadow: #fffBA7 0px 9px 80%;
  }
  .phoneNum {
  	width: 7.87rem;
  	height: 1.20rem;
  	padding-left: 1.74rem;
  	margin: 0 auto;
  	background: url("../../images/tianxie.png") 0/100% 100%;
  }
  .phoneNum input{
  	background: none;
  	height: 1.2rem;
  	position: absolute;
  	font-size: .48rem;
  }
  .add_btn{
  	width: 4.82rem;
  	height: 1.06rem;
  	margin: 0 auto;
  	font-size: .51rem;
  	line-height: 1.06rem;
  	text-align: center;
  	color: #9E3A1D;
  	margin-top: 1.02rem;
  	margin-bottom:.3rem ;
  	background: url("../../images/way-btn.png") 0/100% 100%;
  }
  .tishi{
  	font-size: .39rem;
  	color: #D3984A;
  	text-align: center;
  }
  .okText{
  	width: 9.9rem;
  	height: 6.44rem;
  	position: absolute;
  	top: 30%;
  	left: 10%;
  	z-index: 1000;
  	background: url("../../images/ex-succ-bg.png") 0/100% 100%;
  }
  .okText .okTeitl{
  	width: 3.08rem;
  	height: 1.15rem;
  	text-align: center;
  	margin: 0 auto;
  	margin-top: -.2rem;
  	color: #F6B842;
  	font-size: .54rem;
  	line-height: .95rem;
  	background: url("../../images/title.png") 0/100% 100%;
  }
  .okText p{
  	text-align: center;
  }
  .okText p:nth-child(1){
  	font-size: .6rem;
  	margin-top: .17rem;
  	margin-top: .65rem;
  }
  .okText p:nth-child(2){
  	font-size: .45rem;
  	color: #ffde98;
  	margin-top: .45rem;
  }
  .okText p:nth-child(3){
  	font-size: .45rem;
  	color: #ffde98;
  }
  .okText p:nth-child(4){
  	font-size: .36rem;
  	color: #ffde98;
  }
  .down{
  	width: 4.82rem;
  	height: 1.06rem;
  	margin: 0 auto;
  	font-size: .51rem;
  	line-height: 1.06rem;
  	text-align: center;
  	color: #9E3A1D;
  	margin-top: .45rem;
  	margin-bottom:.3rem ;
  	background: url("../../images/way-btn.png") 0/100% 100%;
  }
</style>
