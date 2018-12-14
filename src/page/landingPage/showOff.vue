<template>
  <div class="bg" :class="{iphonex: isIphonex}">
    <div class="shopImg">
    	<div class="imgs">
    		<img :src="imgBaseUrl() +shophead " alt="" />
    		<div class="top_img"></div>
    	</div>
    	
    </div>
   
    <div class="head">
    	<div class="head_imgs">
    		<img :src="imgBaseUrl() +userhead " alt="" />
    		<div class="headtop_img"></div>
    	</div>
    	<div class="head_text">
    		<p>我在《集分竞宝》成功抢兑{{shopname}}</p>
    	</div>
    </div>
     <div class="userInfo">
    	
    </div>
	<div class="baiwan">
    	
    </div>
   <p class="next_text">
   	还有30台iPhone X和百万豪礼等着你！别说我没告诉你！
   </p>
   <div class="addbtns" @click="down"></div>
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
        isIphonex: false, //是否是iphoneX
        isApp: false,     //是否在APP内
        bgshow: false ,    //微信提示是否显示
        appName:'',
				userhead:'',//用户头像
				shophead:'',
				shopname:''
      }
    },
    created () {
      
    },
    methods: {  
      dataHttp: function () {
        this.$http({
          method: 'get',
          url: '/card-service-web/h5/league/championInfo',
         	params: {gameLeagueId: this.$route.query.gameLeagueId}//gameId
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
          	console.log(data.execData)
	          this.userhead=data.execData.headUrl
        	  this.shophead=data.execData.productThumbnail
        	  this.shopname=data.execData.productName
          } else if (data.execErrCode == 4003) {
//          this.goLogin();
          } else {
            this.toast(data.execMsg);
          }
        })
      },
      down:function(){
      	let url = window.location.href;
				window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
      }
    },
    mounted(){
      let _this = this;
      if (navigator.userAgent.indexOf("jfjingbao") > -1) {
        this.isApp = true;
      }
	  var ua = window.navigator.userAgent.toLowerCase();
	  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		this.isWin=false
		}else{
		this.isWin=true
		}
      this.token = this.getCookie('intoToken');

     
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
    background: url("../../images/xuanyao.png") 0/100% 100%;
  }
  .shopImg{
  	width: 5.72rem;
  	height: 6.76rem;
  	margin: 0 auto;
  	margin-top: -1.2rem;
  }
  .imgs{
  	width: 5.84rem;
  	height: 5.84rem;
  	border-radius: 50%;
  	
  	overflow: hidden;
  }
  .top_img{
  	width: 5.82rem;
  	height: 6.86rem;
  	position: absolute;
  	top: 1.7rem;
  	left: .05;
		background: url("../../images/jiangpin.png") 0/100% 100%;
  }
  .baiwan{
  	width: 10rem;
  	height: 5.98rem;
  	background: url("../../images/baiwan.png") 0/100% 100%;
  	margin: 0 auto;
  	margin-top: .2rem;
  }
  .head{
  	width: 8.83rem;
  	height: 3.16rem;
  	margin: 0 auto;
  	/*position: absolute;
  	top: 8.5rem;
  	left: 1.88rem;*/
  }
  .head_imgs{
  	width: 1.92rem;
  	height: 2.02rem;
  	float: left;
  	position: relative;
  	border-radius: 50%;
  	
		
  }
  .headtop_img{
  	width: 2.62rem;
  	height: 3.16rem;
  	position: absolute;
  	top: -0.8rem;
  	right: -.3rem;
		background: url("../../images/redbag-userpicbg.png") 0/100% 100%;
  }
  .head_text p{
  	width: 6.18rem;
  	font-size: .6rem;
  	color: #fff;
  }
  .head_text{
  	padding-top: .3rem;
  	margin-left: .3rem;
  	float: left;
  }
  .next_text{
  	font-size: .45rem;
  	color: #CC0019;
  	margin: 0 auto;
  	width: 8.87rem;
  	text-align: center;
  	margin-top: .1rem;
  }
  .addbtns{
  	width: 6.45rem;
  	height: 1.50rem;
  	background: url("../../images/qiangdui.png") 0/100% 100%;
  	margin: 0 auto;
  	margin-top: .3rem;
  }
</style>
