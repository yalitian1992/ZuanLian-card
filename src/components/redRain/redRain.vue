<template>
<div>
  <div class="readRain" @click.stop="robRedBag" v-show="readRainShow">
    <canvas id="stars" v-show="canvasShow"></canvas>
    <div class="guide" v-if="timeShow">
      <div class="quan">
        <div class="quan1"></div>
        <div class="quan2"></div>
      </div>
      <div class="hand"></div>
      <p>点击开红包</p>
    </div>
    <!-- 剩余时间 -->
    <div class="time" v-if="timeShow">
      {{this.SurplusTime}}
    </div>
    <div class="prediction" v-if="predictionShow" @click.stop="">
      <!-- 红包预报 -->
      <div class="prediction-box" :class="{'down': isHaveRedBag, 'up': isHaveRedBag,}" v-show="predictionboxshow">
        <div class="user-info">
          <div class="user-pic">
            <div class="bg"></div>
            <img :src="imgBaseUrl() + red_packages.user.head_url">
          </div>
          <div class="user-name">{{red_packages.user.nick_name || "无"}}</div>
        </div>
        <div class="pro-pic">
          <div class="bg"></div>
          <img :src="imgBaseUrl() + red_packages.chest_prize.thumbnail">
        </div>
        <p class="pro-name text-overflow">{{red_packages.chest_prize.name || "无"}}</p>
        <p class="txt">我在开宝箱中开到大奖<br>为大家</p>
        <div class="fhb"></div>
      </div>
      <!-- 3秒倒计时 -->
      <div class="go" v-show="countShow">
        <img id="countImg" src="../../images/redbag-3.png">
        <div class="chuo">
        </div>
      </div>
      <div class="open-redbag" v-if="openBag">
        <div class="havebag" v-show="amount!=0">
          <div class="text">
            <p class="p1">恭喜您获得</p>
            <p class="p2"><span class="money">{{amount}}</span>元</p>
          </div>
        </div>
        <div class="nobag" v-show="amount==0">
          <div class="text">
            <p>很遗憾<br>红包被抢空了</p>
          </div>
        </div>
        <button class="sure" @click.stop="sure"></button>
      </div>
    </div>
  </div>
  <div class="red-remind" @click.stop="remind" :class="{active: redremindShow}" v-show = "distanceTime>=0 && $route.path == '/openBox'">{{predictionM}}:{{predictionS}} 后红包雨抵达</div>
</div>
</template>

<script>
  import {imgBaseUrl, mediaUrl} from '../../config/config'
  import $ from 'jquery'
  export default {
    data () {
      return {
        redbagVoice: '', //音效标签
        imgBaseUrl,
        mediaUrl,
        canvasShow: false,
        readRainShow: false,  //红包雨整体界面
        predictionShow: false,   //红包雨预报弹框
        predictionboxshow: false, //红包雨预报弹框
        isHaveRedBag: false,  //是否有红包雨将要出现
        countShow: false,   //倒计时显示
        openBag: false, //拆开红包
        timeShow: false,  //限时红包倒计时
        isStop: true,   // 红包雨是否已停止
        amount: 0, //红包金额
        countImgUrl: 3,
        redremindShow: false, //红包预报倒计时显示
        predictionM: '00', //距离开始实践分
        predictionS: '00', //距离开始实践秒
        redbagId: '', //红包雨
        token: '',           //accessToken
        countDownTimer: '', //红包持续时间倒计时定时器
        red_packages: {     //红包雨数据
          chest_prize: {
            thumbnail: ''
          },
          user: {
            head_url: ''
          },
          end_time: ''},
        SurplusTime: 0, //剩余时间
        distanceTime: -1,  //距离开始时间
      }
    },
    methods: {
      // 动画初始化
      animateInit: function(){
        this.canvasShow = false
        this.readRainShow = false  //红包雨整体界面
        this.predictionShow = false   //红包雨预报弹框
        this.predictionboxshow = false //红包雨预报弹框
        this.isHaveRedBag = false  //是否有红包雨将要出现
        this.countShow = false   //倒计时显示
        this.openBag = false //拆开红包
        this.timeShow = false  //限时红包倒计时
        this.isStop = true // 红包雨是否已停止
        this.countImgUrl = 3
        this.amount = 0, //红包金额
        this.redbagId = '' //红包雨
        this.predictionS = '00'
        this.SurplusTime = 0 //剩余时间
        this.distanceTime = -1  //距离开始时间
      },
      //拆开红包点确定
      sure: function(){
        var _this = this
        this.animateInit()
        if(_this.$route.path == '/prizeList'){
          _this.$router.go(0)
        }
      },
      // 是否有红包雨将要出现
      isPlay: function(){
        var _this = this
        if(_this.readRainShow == false){
          this.$http({
            method: 'get',
            url: '/api/red_packages',
            params: {id: this.boxId},
            headers: {accessToken: this.token}
          }).then(function(res){
            var data = res.body
            if(data.execErrCode==200){

                // 是否有红包雨
                if (data.execData.red_packages.length !=0) {
                  if (data.execData.red_packages[0].id != localStorage.getItem("redbagId")){
                    _this.red_packages = data.execData.red_packages[0]
                    _this.SurplusTime = _this.red_packages.end_count_down - _this.red_packages.begin_count_down
                    _this.distanceTime = _this.red_packages.begin_count_down
                    _this.predictionCountDown()
                    window.localStorage.setItem("redbagId",data.execData.red_packages[0].id)
                    _this.redbagId = data.execData.red_packages[0].id

                  }

                  // 时间矫正
                  // var correctionTimer = setInterval(function(){
                  //   if (_this.distanceTime<=0) {
                  //     clearInterval(correctionTimer)
                  //   };
                  //   _this.isPlay()
                  //   _this.distanceTime = _this.red_packages.begin_count_down
                  //   console.log(_this.distanceTime)
                  // }, 5000)

                };
            }else {

            }
          })
        }
      },
      // 点击开始抢红包
      start: function (){
        var _this = this
          this.isHaveRedBag = false;
          setTimeout(function(){
            _this.countShow = true
            _this.beginning();
          }, 1000)
      },
      //3,2,1,go倒计时开始
      beginning: function(){
        var _this = this
        _this.countImgUrl=3
        var countImg = document.getElementById("countImg")
        countImg.src = require('../../images/redbag-' + _this.countImgUrl +'.png')
        _this.addAudio(_this.mediaUrl + "/media/countdown.mp3")
        var countTimer = setInterval(function(){
          if (_this.countImgUrl==0) {
            _this.countDown()
            _this.timeShow = true;
            _this.predictionShow = false
            _this.predictionboxshow = false;
            _this.countShow = false
            _this.canvasShow = true
            if(_this.SurplusTime == 0){ //如果三秒之后时间一到， 提示已领空
              _this.amount = 0
              _this.timeShow = false;
              _this.predictionShow = true;
              this.predictionboxshow = false;
              _this.openBag = true;
            }else {
              _this.addAudio(_this.mediaUrl + "/media/rain-voice.mp3")  //下雨音效
              _this.init();
            }
            clearInterval(countTimer)
          };
          _this.countImgUrl--
          countImg.src = require('../../images/redbag-' + _this.countImgUrl +'.png')
        }, 1000)
      },
      // 点击屏幕拆红包
      robRedBag: function(){
          var _this = this;
          _this.addAudio()
          clearTimeout(_this.countDownTimer)  //点击确定清除倒计时定时器
          this.$http({
            method: 'post',
            url: '/api/red_packages/draw',
            params: {id: _this.redbagId},
            headers: {accessToken: this.token}
          }).then(function(res){
            var data = res.body
            if(res.body.execErrCode==200){
              _this.addAudio(_this.mediaUrl + "/media/rain-getyes.mp3") //抢到红包音效
              _this.amount = data.execData.amount
            }else {
              _this.addAudio(_this.mediaUrl + "/media/rain-getno.mp3")  //未抢到红包音效
              _this.amount = 0
            }
            _this.timeShow = false;
            _this.predictionShow = true;
            this.predictionboxshow = false;
            _this.openBag = true;
          })
      },
      //时间到了处理办法
      timeOut: function(){
        this.animateInit()
      },
      // 限时红包倒计时
      countDown: function(){
            var _this = this
            if(_this.SurplusTime==0 && _this.isHaveRedBag==true){
              _this.isHaveRedBag = false  //是否有红包雨将要出现
              setTimeout(function(){
                _this.animateInit()
              }, 1000)
            }else if(_this.SurplusTime==0 && _this.readRainShow == true){
              _this.amount = 0
              _this.timeShow = false;
              _this.predictionShow = true;
              this.predictionboxshow = false;
              _this.openBag = true;
              _this.addAudio(_this.mediaUrl + "/media/rain-getno.mp3")  //未抢到红包音效
            }
            if(_this.SurplusTime>=0){
              _this.countDownTimer = setTimeout(function(){
                _this.countDown()
              },1000);
            }
            _this.SurplusTime--
      },
      /*添加音效*/
      addAudio: function (src) {
        // if (this.redbagVoice == '') {
        //   this.redbagVoice = document.createElement("audio")
        //   this.redbagVoice.setAttribute('src', '');
        //   this.redbagVoice.src=src
        //   document.body.appendChild(this.redbagVoice);
        //   this.redbagVoice.play()
        // }else{
        //   this.redbagVoice.src=src
        //   this.redbagVoice.play()
        // };
        var audioNow = document.getElementsByTagName("audio")[0];
        if (audioNow == undefined) {
          var audio = document.createElement('audio');
          audio.setAttribute('src', '');
          document.body.appendChild(audio);
          audioNow = document.getElementsByTagName("audio")[0];
        }
        audioNow.pause();
        audioNow.src = src;
        audioNow.play();

      },
      remind: function(){
        var _this = this
        _this.redremindShow==true ? _this.redremindShow=false : _this.redremindShow=true
      },
      // 红包预报倒计时（只开宝箱页有）
      predictionCountDown: function(){
            var _this = this
            var leftTime = _this.distanceTime*1000;
            //定义变量 d,h,m,s保存倒计时的时间
            if( _this.distanceTime>=0){
              var d,h,m,s;
              if (leftTime>=0) {
                  d = Math.floor(leftTime/1000/60/60/24);
                  h = Math.floor(leftTime/1000/60/60%24);
                  m = Math.floor(leftTime/1000/60%60);
                  s = Math.floor(leftTime/1000%60);
              }
              _this.predictionM = m;
              _this.predictionS = s;
              if(_this.predictionM<10){
                _this.predictionM = '0' + _this.predictionM
              }
              if(_this.predictionS<10){
                _this.predictionS = '0' + _this.predictionS
              }
              var timer = setTimeout(function(){
                _this.predictionCountDown()
              },1000);
            }

            // 动画开始播放
            console.log(_this.distanceTime)
            if(_this.distanceTime == 0){
              _this.readRainShow = true;
              _this.predictionShow = true;
              _this.predictionboxshow = true //红包雨预报弹框
              setTimeout(function(){
                _this.isHaveRedBag = true;
                setTimeout(function(){
                  _this.start()
                }, 1000)
                // _this.timeOut(1)
              }, 1000)
            }

            _this.distanceTime--
      },
      init: function(){
                var _this = this
                var moon = new Image();
                moon.src = require('../../images/redbag.png')
                moon.onload = function(){

                    var context;
                    var arr = new Array();
                    var starCount = 800;

                    var rains = new Array();
                    var rainCount =30;


                    //获取canvas
                    var stars = document.getElementById("stars");
                    var windowWidth = window.innerWidth; //当前的窗口的高度
                    stars.width=windowWidth;
                    stars.height=window.innerHeight;
                    //获取context
                    var context = stars.getContext("2d");

                    /*红包雨开始*/
                      var MeteorRain = function(){
                          this.x = -1;
                          this.y = -1;
                          this.length = -1;//长度
                          this.angle = 90; //倾斜角度
                          this.width = -1;//宽度
                          this.height = -1;//高度
                          this.speed = 1;//速度
                          this.offset_x = 0;//横轴移动偏移量
                          this.offset_y = 0;//纵轴移动偏移量
                          this.alpha = 1; //透明度
                          this.color1 = "";//红包的色彩
                          this.color2 = "";  //红包的色彩
                        /****************初始化函数********************/
                        this.init = function (){ //初始化
                          this.getPos();
                          this.alpha = 1;//透明度
                          // this.getRandomColor();
                          //最小长度，最大长度
                          var x = Math.random() * 80 + 150;
                          this.length = Math.ceil(x);
                          this.angle = Math.random()*50 + 75; //红包倾斜角
                          x = Math.random()+.4;
                          this.speed = x; //红包的速度
                          var cos = Math.cos(this.angle*3.14/180);
                          var sin = Math.sin(this.angle*3.14/180)*5;
                          this.width = this.length*cos ;  //红包所占宽度
                          this.height = this.length*sin ;//红包所占高度
                          this.offset_x = this.speed*cos ;
                          this.offset_y = this.speed*sin;
                        }

                         /***************重新计算红包坐标的函数******************/
                        this.countPos = function () //
                        {
                            //往左下移动,x减少，y增加
                            this.x = this.x - this.offset_x;
                            this.y = this.y + this.offset_y;
                        }

                        /*****************获取随机坐标的函数*****************/
                        this.getPos = function () //
                        {
                            //横坐标200--1200

                            this.x = Math.random() * window.innerWidth; //窗口高度
                            //纵坐标小于600
                            this.y = Math.random() * window.innerHeight;  //窗口宽度
                        }
                         /****绘制红包***************************/
                        this.draw = function () //绘制一个红包的函数
                        {

                            context.drawImage(moon, this.x + this.width,this.y - this.height,59,77);

                            // context.save();
                            // context.beginPath();
                        }
                        this.move = function(){
                            //清空红包像素
                            var x = this.x+this.width-this.offset_x;
                            var y = this.y-this.height;
                            //重新计算位置，往左下移动
                            this.countPos();
                            //透明度增加
                            this.alpha -= 0.002;
                            //重绘
                            this.draw();
                        }

                    }

                    //绘制红包
                    function playRains(){
                        // context.clearRect(0,0, $("#stars").width(), ;
                        stars.height = stars.height
                        for (var n = 0; n < rainCount; n++){
                            var rain = rains[n];
                            rain.move();//移动
                            if(rain.y>window.innerHeight*3){//超出界限后重来
                                rains[n] = new MeteorRain();
                                rains[n].init();
                            }
                        }
                        if(_this.canvasShow==true){
                            var redBagTimer = setTimeout(function(){
                                playRains()
                            },2);
                        }else{
                          $("#stars").fadeOut(0);
                          clearTimeout(redBagTimer)
                        }
                    }


                    //画红包
                    for (var i=0;i<rainCount;i++) {
                        var rain = new MeteorRain();
                        rain.init();
                        rain.draw();
                        rains.push(rain);
                    }
                    playRains();//绘制红包
                }
      }
    },
    mounted(){
      var _this = this
      //  document.addEventListener("pause", function () {
      //     _this.toast("应用从前台切换到后台");
      // }, false);
      // document.addEventListener("resume", function () {
      //     _this.toast("应用从后台切换到前台");
      // }, false);
      // 第一次打开页面先清除保存的id
      window.localStorage.setItem("redbagId",'')
      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }
      this.token = this.getCookie('intoToken');
      _this.isPlay()
      window.rainTimer = setInterval(function(){
        if(_this.readRainShow == false){
          _this.isPlay()
        }else {
          console.log("正在抢红包！")
        }
      }, 20000)
    }
  }
</script>
<style scoped>
.readRain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.7);
}
.guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  right: 1rem;
  bottom: 1rem;
  margin: auto;
  width: 2.3rem;
  height: 2.87rem;
  transform: translateX(1.5rem);
  animation: guide 4s linear infinite;
}
.guide p {
  position: absolute;
  bottom: -.36rem;
  width: 100%;
  text-align: center;
  height: .36rem;
  line-height: .36rem;
  font-size: .36rem;
  color: #f8dd74;
}
.guide .quan {
  position: absolute;
  top: -.35em;
  left: -.35rem;
  width: 1.5rem;
  height: 1.5rem;
}
.guide .quan1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 1.5rem;
  height: 1.5rem;
  opacity: .3;
  background: #fff;
  border-radius: 50%;
  animation: quan 1s .5s linear infinite;
}
.guide .quan2 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: .8rem;
  height: .8rem;
  background: #fff;
  opacity: .5;
  border-radius: 50%;
  animation: quan 1s .5s linear infinite;
}
.guide .hand {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 2.3rem;
  height: 2.87rem;
  background: url(../../images/redbag-hand2.png) no-repeat center/contain;
  animation: hands 1s linear infinite;
}
/*指引整体*/
@keyframes guide {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  51% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
/*小手*/
@keyframes hands {
  0% {
    background: url(../../images/redbag-hand2.png) no-repeat center/contain;
  }
  100% {
    background: url(../../images/redbag-hand1.png) no-repeat center/contain;
  }
}
/*圈圈*/
@keyframes quan {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  100% {
    transform: scale(1.3);
    opacity: 0.3;
  }
}
.prediction {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.prediction-box {
  padding-top: 3.3rem;
  margin: 0 auto;
  width: 9.7rem;
  height: 18.81rem;
  background: url(../../images/redbag-bg-prediction.png) no-repeat center/contain;
  transform: translate(0, -100%);
  transition: all 1s;
}
.prediction-box.down {
  transform: translate(0, 0);
}
.user-info {
  padding-left: .5rem;
  width: 100%;
  height: 3.68rem;
  /* background: pink; */
  /* opacity: 0.4; */
}
.user-info>div {
  height: 3.68rem;
  float: left;
  font-size: .7rem;
  color: #fdd382;
  line-height: 3.68rem;
  text-shadow: .03rem .05rem .05rem #FF0000;
}
.user-info .user-pic {
  position: relative;
  width: 2.94rem;
  height: 3.68rem;
  background: url(../../images/redbag-userpicbg.png) no-repeat center/contain;
}
.user-info .user-pic .bg {
  position: relative;
  z-index: 3;
  width: 2.94rem;
  height: 3.68rem;
  background: url(../../images/redbag-userpicbg.png) no-repeat center/contain;
}
.user-info .user-pic img {
  z-index: 2;
  position: absolute;
  top: .2rem;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 2.24rem;
  height: 2.24rem;
}
.pro-pic {
  position: relative;
  width: 4.05rem;
  height: 4.05rem;
  margin: 0 auto;
}
.pro-pic .bg{
  position: relative;
  width: 4.05rem;
  height: 4.05rem;
  z-index: 3;
  background: url(../../images/redbag-pro-picbg.png) no-repeat center/contain;
}
.pro-pic img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 2;
  width: 3.5rem;
  height: 3.5rem;
}
.pro-name {
  height: .8rem;
  padding: 0 .6rem;
  font-size: .5rem;
  color: #fdd382;
  text-align: center;
}
.prediction .txt {
  padding: .5rem .36rem;
  text-align: center;
  font-size: .8rem;
  color: #fdd382;
  line-height: 1rem;
  text-shadow: .03rem .05rem .05rem #FF0000;
}

.fhb {
  margin: 0 auto;
  width: 6.84rem;
  height: 2.27rem;
  background: url(../../images/redbag-fhb.png) no-repeat center/contain;
}

.go {
  position: fixed;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 7.28rem;
  height: 3rem;

}
.go img {
  margin: 0 auto;
  width: 3.21rem;
  height: 1.46rem;
}
.go .chuo {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 7.28rem;
  height: 1.28rem;
  background: url(../../images/redbag-chuo.png) no-repeat center/contain;
}
.open-redbag {

}
.open-redbag .havebag {
  width: 12.42rem;
  height: 13.9rem;
  margin-bottom: 2.4rem;
  background: url(../../images/redbag-havebag.png) no-repeat center/contain;
}
.open-redbag .havebag .text {
  color: #fc2522;
  font-size: .7rem;
  text-align: center;
  padding-top: 4.5rem;
}
.open-redbag .havebag .text .p1 {

}
.open-redbag .havebag .text .p2 {
  font-size: .5rem;
}
.open-redbag .havebag .text .p2 .money {
  font-size: .8rem;
  font-weight: 800;
  padding-right: .1rem;
}
.open-redbag button.sure {
  display: block;
  margin: 0 auto;
  width: 5.02rem;
  height: 1.13rem;
  background: url(../../images/redbag-btn-sure.png) no-repeat center/contain;
}

.open-redbag .nobag {
  position: relative;
  margin: 0 auto;
  width: 7.92rem;
  height: 13.9rem;
  margin-bottom: 2.4rem;
  background: url(../../images/redbag-nobag.png) no-repeat center/contain;
}
.open-redbag .nobag .text {
  font-size: .8rem;
  color: #ffcf01;
  text-align: center;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}
.time {
  position: fixed;
  right: .2rem;
  top: .2rem;
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  border-radius: 50%;
  font-size: .6rem;
  font-weight: 600;
  color: #ea441c;
  background: #D8C5AB;
  text-indent: -.15rem;
}

.red-remind {
  position: fixed;
  /*top: 3.55rem;*/
  top: 9rem;
  right: -2.8rem;
  width: 4.98rem;
  height: 1.21rem;
  text-indent: .95rem;
  line-height: 1.51rem;
  background: url(../../images/redbag-remind-bg.png) no-repeat center/contain;
  z-index: 99999;
  font-size: .42rem;
  color: #fff7b6;
  text-shadow: 5px 5px 5px #793d25;
  transform: translate(0, 0);
  transition: all 1s;
}
.red-remind.active {
  transform: translate(-2.7rem, 0);
}
</style>
