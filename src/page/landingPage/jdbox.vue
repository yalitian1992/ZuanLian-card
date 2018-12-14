<template>
  <div>
    <div class="jd-body"></div>
    <div class="jd-box">
      <img class="logo" src="../../images/logo-img.png" alt="">
      <h3 class="unReceived" v-show="unReceived"></h3>
      <h3 class="receiving" v-show="receiving"></h3>
      <div class="card">
        <img class="card-pic" :src="imgBaseUrl() + imgUrl" alt="" :onerror="defaultImg(3)">
        <p>{{jdName}}</p>
      </div>
      <p class="count-down"><count-down  :callback="clearCookie" endText="超出领取时间，请"></count-down><span v-if="timeShow" @click="TimeShow" style="color: #2450bf;">重新领取</span></p>
      <ul>
        <li class="phone"><input type="number" placeholder="输入手机号领取" v-model="phone" oninput="if(value.length>11)value=value.slice(0,11)"></li>
        <li class="verification-code">
          <input type="number" placeholder="输入验证码" v-model="code" oninput="if(value.length>6)value=value.slice(0,6)">
          <button :disabled="disabled" @click="Send">{{codeText}}</button>
        </li>

      </ul>
      <button class="receive-btn" @click="jdReceived"></button>

      <!--弹框提示-->
      <div class="fair-box" v-if="tankShow">
        <div class="fair-txt">
          <h3>领取失败</h3>
          <p v-html="tankTxt"></p>
          <button v-show="btnOver" @click="btnClickOver">{{tankBtn}}</button>
          <button v-show="ClickRe" @click="btnClickRe">{{tankBtn}}</button>
          <span class="close" @click="tankShow = false"></span>
        </div>
      </div>
    </div>
    <icpInfo></icpInfo>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  import countDown from '../../components/time/time.vue'
  import icpInfo from '../../components/icpInfo/icpInfo.vue'

  export default {
    data () {
      return {
        imgBaseUrl,
        btnOver: false,
        ClickRe: false,
        overTime: false,
        tankShow: false,
        tankTxt: '',
        tankBtn: '',
        timeShow: false,
        callback:null,
        phone: '',
        code: '',
        productId: '',
        codeText: '发送验证码',
        disabled: false,
        jdt114: '',
        jdt267: '',
        imgUrl: '',
        jdName: '',
        jdID: '',
        jdPrice: '',
        unReceived: false,
        receiving: false,
        ad_from: '',
        recing:false
      }
    },
    methods: {
      clearCookie: function(){
        this.timeShow=true
      },
      TimeShow: function(){
      	this.upDats()
      	if(this.recing=true){
          localStorage.setItem('time', "");
					location.reload()
      	}
      },
      btnClickOver: function(){
//        console.log(this.tankShow)
        this.tankShow = false
      },
      btnClickRe: function(){
        this.downApp()
        this.tankShow = false
      },
      /*获取验证码*/
      Send: function(){
        if(this.overTime == false){
          if(!this.phone) {
            this.toast('请输入手机号');
            return false;
          } else if(!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.phone)) {
            this.toast('手机号码格式不正确');
            return false;
          }

          this.$http({
            method: 'post',
            url: '/api/sms_message/send_sms',
            params: {mobile: this.phone}
          }).then(function(res){
            var data = res.body
            data = typeof data == 'string' ? JSON.parse(data) : data;

            if(data.execErrCode == 200){
              this.disabled = true;
              var _this=this;
              var num = 60,
                time = setInterval(function() {
                  num--;
                  _this.codeText = num+"s" ;
                  if(num <= 0) {
                    clearInterval(time);
                    _this.codeText = '重新发送';
                    _this.disabled = false;
                  }
                }, 1000);
            }
          })
        }else{
          this.tankShow = true
          this.tankTxt = "超过时限，领取失效，<br/>请重新开启宝箱！"
          this.tankBtn = "重新开启"
        }

      },
      /*JD领取*/
      jdReceived: function(){
        if(this.overTime == false){
          if(!this.phone) {
            this.toast('请输入手机号');
            return false;
          } else if(!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.phone)) {
            this.toast('手机号码格式不正确');
            return false;
          }

          this.$http({
            method: 'get',
            url: '/api/chest_boxs/h5_landing_binding_mobile',
            headers: {accessToken: this.getCookie('intoToken')},
            params: {mobile: this.phone,code: this.code,chest_record_tmp_id: this.jdID}
          }).then(function(res){
            var data = res.body
            if(data.execErrCode == 200){
              this.$router.replace({
                path: '/getPrize',
                query: {thumbnail: this.imgUrl,t114: this.jdt114,t267: this.jdt267,price: this.jdPrice,ad_from: this.ad_from}
              })
            }else if(data.execErrCode == 501){
//            奖品已领过
              this.tankShow = true
              this.tankTxt = "该手机号已领取过京东卡，<br/>请前往下载APP领取！"
              this.tankBtn = "下载APP"
              this.btnOver = false
              this.ClickRe = true
            }else if(data.execErrCode == 500){
//            奖品已经过期
              this.overTime = true
              this.btnOver = true
              this.ClickRe = false
            }else if(data.execErrCode == 502){
              this.toast(data.execMsg)
            }else{
              this.toast(data.execMsg)
            }

            /*if(data.execMsg == "验证码不正确"){
             this.toast(data.execMsg)
             }else{
             this.toast(data.execMsg)
             this.$router.replace({
             path: '/wmbox',
             query: {type: this.$route.query.type, page_from: this.$route.query.page_from, ad_from: this.ad_from}
             })
             }
             }*/
          })
        }else{
          this.tankShow = true
          this.tankTxt = "超过时限，领取失效，<br/>请重新开启宝箱！"
          this.tankBtn = "重新开启"
        }
      },
      upDats:function(){
      	this.$http({
        method: 'get',
        url: '/api/chest_boxs/h5_landing_box',
        headers: {accessToken: this.getCookie('intoToken')},
        params: {type: this.$route.query.type }
      }).then(function(res){
        if(res.body.execErrCode == 200){
        	this.recing=true
          var data1 = res.body.execData.chest_record_tmp
          this.jdID = data1.id
//          console.log(this.jdID)
          var data = res.body.execData.chest_prizes
          for(let i=0;i<data.length;i++){
            if(data[i].prize_type == 9){
              this.jdt114 = data[i].t114
              this.jdt267 = data[i].t267
              this.imgUrl = data[i].thumbnail
              this.jdName = data[i].name
              this.jdPrice = data[i].price
            }
          }
        }else if(res.body.execErrCode == 500){
        	this.recing=false
          this.$router.replace({
            path: '/emptybox',
            query: {type: this.$route.query.type, page_from: this.$route.query.page_from, ad_from: this.ad_from}
          })
        }
      })
      }
    },
  components: {
    countDown,
      icpInfo
  },
    mounted(){
      let _this = this;
      document.getElementsByTagName("html")[0].style.backgroundColor = "#fff"

      this.ad_from = this.$route.query.ad_from
      if (this.$route.query.token) {
        this.setCookie('intoToken', this.$route.query.token, 3)
      }

      if(this.$route.query.page_from == "wm"){
        this.unReceived = false
        this.receiving = true
      }else{
        this.unReceived = true
        this.receiving = false
      }
      this.upDats()
      this.pvCount()
    }
  }
</script>
<style scoped>
  .jd-body{
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    z-index: -1;
    background: #260302;
  }
  .fair-txt .close{
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    top: 0rem;
    right: -0.8rem;
    background: url("../../images/close-bg.png") no-repeat center/100% 100%;
  }
  .fair-txt>button{
    display: block;
    margin: 0.4rem auto 0 auto;
    width: 3rem;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.4rem;
    color: #bb1f1c;
    background: url("../../images/tank-btn-bg.png") no-repeat center/100% 100%;
  }
  .fair-txt>p{
    font-size: 0.4rem;
    color: #5f2d01;
    text-align: center;
    margin-top: 0.6rem;
  }
  .fair-txt h3{
    font-size: 0.7rem;
    color: #020000;
    opacity: 0.7;
    text-align: center;
    padding-top: 0.5rem;
  }
  .fair-txt{
    position: relative;
    margin: 50% auto 0 auto;
    width: 7rem;
    height: 5rem;
    background: url("../../images/tank-bg.png") no-repeat center/100% 100%;
  }
  .fair-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(0,0,0,0.6);
  }
  .logo{
    width: 3rem;
    margin-left: 0.1rem;
  }
  html,body{
    background: #991103 !important;
  }
  .jd-box{
    border: 0.1px solid #bd3924;
    border-bottom: 0;
    /*padding-top: 2rem;*/
    height: 100%;
    background: url("../../images/jdbox-bg.jpg") no-repeat center/100% 100%;
  }
  .jd-box>h3{
    margin: 0 auto 0 auto;
    /*width: 8.28rem;*/
    height: 3.06rem;
  }
  .jd-box>h3.unReceived{
    background: url("../../images/header-txt-unre.png") no-repeat center/contain;
  }
  .jd-box>h3.receiving{
    background: url("../../images/header-txt.png") no-repeat center/contain;
  }
  .card{
    margin: 1rem auto 0 auto;
    padding-top: 0.3rem;
    width: 7.4rem;
    height: 6rem;
    background: url("../../images/card-bg.png") no-repeat center/100% 100%;
  }
  .card>p{
    height: 1rem;
    line-height: 1rem;
    width: 80%;
    margin: 0.2rem auto;
    text-align: center;
    font-size: 0.5rem;
    color: #fff5f5;
    background: url("../../images/red-bg.png") no-repeat center/100% 100%;
  }
  .card-pic{
    margin: 0 auto;
    width: 6.4rem;
    height: 4.34rem;
    /*background: url("../../images/card-pic.png") no-repeat center/100% 100%;*/
  }
  .count-down{
    margin-top: 0.3rem;
    color: #fff;
    font-size: 0.48rem;
    text-align: center;
  }
  .receive-btn{
    display: block;
    margin: 1rem auto;
    width: 65%;
    height: 3rem;
    background: url("../../images/jd-receive-btn.png") no-repeat center/100% 100%;
  }
  ul{
    width: 65%;
    margin: 0.3rem auto 0 auto;
  }
  ul li{
    margin-bottom: 0.3rem;
  }
  ul input{
    height: 1.4rem;
    padding-left: 0.4rem;
    font-size: 0.5rem;
    color: #a06d32;
    background: url("../../images/num-bg.png") no-repeat center/100% 100%;
    background-position: 0 0.06rem;
  }

  ul input::-webkit-input-placeholder {
    color:#a06d32;
    font-size: .4rem;
  }
  ul input:-moz-placeholder {
    color:#a06d32;
    font-size: .4rem;
  }
  ul input::-moz-placeholder {
    color:#a06d32;
    font-size: .4rem;
  }
  ul input:-ms-input-placeholder {
    color:#a06d32;
    font-size: .4rem;
  }



  ul .phone input{
    width: 100%;
  }
  .verification-code input{
    width: 60%;
  }
  .verification-code button{
    width: 36%;
    height: 1.4rem;
    font-size: 0.4rem;
    color: #8b1f1c;
    line-height: .4rem;
    background: url("../../images/code-bg.png") no-repeat center/100% 100%;
    background-position: 0 0.1rem;
  }
</style>
