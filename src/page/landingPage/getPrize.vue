<template>
  <div>
    <div class="main" :class="{iphonex: isIphonex,ios:isIos}">
      <img class="logo" src="../../images/logo-img.png" alt="">
      <img class="topImg" src="../../images/prize-text.png" alt="">
      <!--<div class="topText"></div>-->
      <div class="prizeMian">
        <img class="jd-card" :src="imgBaseUrl()+images" alt="" :onerror="defaultImg(3)">
        <p class="prize-name"><span>{{price}}元</span> 京东卡已放入您的账户</p>
        <div class="btn-bg" @click="down()">打开APP获取京东卡密码</div>
      </div>
      <div class="colorWidth">将撒币坚持到底！</div>
      <div class="prizeOne">
        <p class="textOne">进入APP即送万元奖品宝箱</p>
        <p class="colorRed">需打开APP</p>
      </div>
      <div class="prizeTwo">
        <p class="textOne">注册送300万豪礼宝箱</p>
        <p class="colorRed">需完成上一步</p>
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
        isIphonex: false,      //是否是iPhonex
        isIos: false,
        price: '0',
        images: ''
      }
    },
    methods: {
      down: function () {
        this.downApp()
      }
    },
    components: {
      icpInfo
    },
    mounted(){
      var _this = this;
      //传参
      if(_this.price){
        _this.price = _this.$route.query.price
        _this.images = _this.$route.query.thumbnail
      }else{
        this.$router.replace({path: 'jdbox', query: {type: 1, page_from: "wm", ad_from: ad_from}})
      }

      this.clientType(function () {
      }, function () {
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        } else {
          _this.isIos = true;
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })
      _this.pvCount()
    }
  }
</script>
<style scoped>
  .main {
    /*width: 100%;*/
    /*min-height: 100%;*/
    background: url("../../images/prize-bg.jpg") no-repeat center/100% 100%;
  }

  /*iphoneX适配*/
  .main.iphonex {
    height: 100%;
    /*min-height: 730px;*/
  }

  .main.ios {
    /*min-height: 100%;*/
  }

  .logo {
    width: 3rem;
    margin-left: .3rem;
  }

  .topText {
    width: 12.6rem;
    height: 2.48rem;
    background: url("../../images/prize-text.png") no-repeat center/100% 100%;
    margin: 0 auto;
  }

  .topImg {
    margin: 0 auto;
    width: 100%;
  }

  .prizeMian {
    margin: -.3rem auto 0;
    width: 12rem;
    height: 7.78rem;
    background: url("../../images/prizeMain-bg.png") no-repeat center/100% 100%;
    overflow: hidden;
  }

  .jd-card {
    width: 4.2rem;
    margin: 1.42rem auto 0.1rem;
  }

  .prize-name {
    font-size: .4rem;
    color: #4d4d4d;
    text-align: center;
    margin-bottom: 0.3rem;

  }

  .prize-name span {
    font-size: .5rem;
    color: #bb262f;
  }

  .btn-bg {
    width: 6.11rem;
    height: 1.10rem;
    font-size: .5rem;
    line-height: 1.10rem;
    color: #fff;
    margin: 0 auto;
    text-align: center;
    background: url("../../images/btn-bg.png") no-repeat center/100% 100%;
  }

  .prizeOne {
    width: 12.42rem;
    height: 4.66rem;
    background: url("../../images/prize-one.png") no-repeat center/100% 100%;
    margin: 0 auto;
    text-align: right;
    margin-top: -.2rem;
  }

  .prizeTwo {
    width: 12.42rem;
    height: 4.66rem;
    background: url("../../images/prizeTwo.png") no-repeat center/100% 100%;
    margin: 0 auto;
    text-align: right;
    padding-bottom: 0.63rem;
    margin-top: -.6rem;
  }

  .textOne {
    padding: 1.3rem 1.3rem 0.6rem 0;
    font-size: .5rem;
    color: #4d4d4d;
  }

  .colorRed {
    color: #bb262f;
    font-size: .5rem;
    padding: 0 1.3rem 1.02rem 0;
  }

  .colorWidth {
    font-size: .6rem;
    color: #fff;
    text-align: center;
    margin-top: -.2rem;
  }
</style>
