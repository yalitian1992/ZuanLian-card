<template>
  <div class="bg" :class="{iphonex: isIphonex}">
    <div class="back-btn" @click="goBack()"></div>
    <div class="tips-img"></div>
    <div class="tips-txt align-c">每邀请1位好友注册并绑定微信获得现金红包</div>
    <div class="get-num align-c">
      <div class="fixed-num" @click="draw(fixedNumId)">{{fixedNum}}元</div>
      <div class="txt"></div>
      <div class="random-num" @click="draw(randomNumId)">随机</div>
    </div>
    <div class="invite align-c">
      <div class="txt">可领取<span>{{footerData.left_count}}</span>次</div>
      <div class="invite-btn" @click="invitation"></div>
      <div class="txt">被邀请好友可获得<span>{{registerNum}}</span>元现金奖励</div>
    </div>
    <div class="footer-bar align-c">
      <div>
        <div class="num">{{footerData.total_count}}</div>
        <div class="txt">已成功邀请（人）</div>
      </div>
      <div>
        <div class="num">{{footerData.left_count}}</div>
        <div class="txt">待领取红包（个）</div>
      </div>
      <div>
        <div class="num">{{footerData.used_count}}</div>
        <div class="txt">已领取红包（个）</div>
      </div>
    </div>
    <!--领取成功弹框-->
    <div class="receive-success-mask" :class="{animate: animate}" v-show="successShow"></div>
    <div class="receive-success align-c" v-show="successShow">
      <div class="title">领取成功</div>
      <div class="close pull-right" @click="successShow = false; isCanReceive = true;"></div>
      <div class="money-img"></div>
      <div class="txt1">获得<span><i>{{getMoney}}</i>元</span>现金</div>
      <div class="txt2">可在我的钱包提现</div>
      <router-link class="invite-btn1" tag="div" :to="{path: '/prizeList',query: {native: 0}}">查看钱包</router-link>
    </div>
    <!--领取失败弹框-->
    <div class="receive-fail-mask" v-show="failShow">
      <div class="receive-fail align-c">
        <div class="close pull-right" @click="failShow = false; isCanReceive = true;"></div>
        <div class="text">暂无领取机会<br/>快去邀请好友吧！</div>
        <div class="invite-btn1" @click="invitation">立即邀请</div>
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
        token: '',
        fixedNum: 0,      //固定金额
        fixedNumId: '',   //固定金额抽奖ID
        randomNumId: '',  //随机金额抽奖ID
        registerNum: 0,   //被邀请好友可获得金额
        footerData: {     //底部数据
          left_count: 0,
          total_count: 0,
          used_count: 0
        },
        isIphonex: false, //是否是iphoneX
        isApp: false,     //是否在APP内
        wxShareName: '',
        wxShareTitle: '',
        wxShareImg: '',
        code: '',
        wxUrl: "",
        successShow: false,//领取成功弹框是否显示
        animate: false,    //动画是否执行
        getMoney: 0,       //领取得到的钱数
        failShow: false,   //领取失败弹框是否显示
        bgshow: false,     //微信提示是否显示
        isCanReceive: true //是否能点击红包领取
      }
    },
    created () {
      this.token = this.getCookie('intoToken');
      this.wxpz();
      this.wxShare();
    },
    methods: {
      draw: function (id) {
        if (this.isCanReceive) {
          this.isCanReceive = false;
          this.$http({
            method: 'post',
            url: '/api/chest_boxs/draw_cash',
            headers: {accessToken: this.token},
            params: {id: id}
          }).then(function (res) {
            if (res.body.execErrCode == 200) {
              this.$http({
                method: 'get',
                url: '/card-service-web/h5/chestRecords/getChestPrizes',
                headers: {accessToken: this.token},
                params: {id: res.body.execData.chest_record.id}
              }).then(function (data) {
                if (data.body.execErrCode == 200) {
                  if (data.body.execData.status == 3) {
                    if (data.body.execData.flag == 1) {
                      this.$http({
                        method: 'post',
                        url: '/card-service-web/h5/chestRecords/getRechargeCard',
                        headers: {accessToken: this.token},
                        params: {id: res.body.execData.chest_record.id, productId: res.body.execData.chest_prizes[0].id}
                      }).then(function (datas) {
                        if (datas.body.execErrCode == 200) {
                          if (res.body.execData.chest_prizes[0].prize_type == 10) {
                            this.getMoney = res.body.execData.chest_prizes[0].num;
                            this.successShow = true;
                            let _this = this;
                            setTimeout(function () {
                              _this.animate = true;
                              _this.goldEcptoma();
                            }, 50)
                            this.dataHttp();
                          }
                        } else {
                          this.toast(datas.body.execMsg);
                        }
                      })
                    }
                  }
                } else {
                  this.toast(data.body.execMsg);
                }
              })
            } else if (res.body.execErrCode == 5001) {
              this.failShow = true;
            } else if (res.body.execErrCode == 5003) {
              if (this.footerData.left_count == 0) {
                this.failShow = true;
              } else {
                this.toast(res.body.execMsg);
              }
            } else {
              this.toast(res.body.execMsg);
            }
          })
        }
      },
      dataHttp: function () {
        this.$http({
          method: 'get',
          url: '/api/chest_boxs/draw_cash_index',
          headers: {accessToken: this.token}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            this.fixedNum = data.execData.ensure_amount;
            this.fixedNumId = data.execData.current_boxs['7'].chest_box.id;
            this.randomNumId = data.execData.current_boxs['8'].chest_box.id;
            this.registerNum = data.execData.register_amount;
            this.footerData.left_count = data.execData.left_count;
            this.footerData.total_count = data.execData.total_count;
            this.footerData.used_count = data.execData.used_count;
          } else if (data.execErrCode == 4003) {
            this.goLogin();
          } else {
            this.toast(data.execMsg);
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
      },
      /*金币落下效果*/
      goldEcptoma: function () {
        let _this = this;

        function Coin(opts) {
          //默认参数
          this.defaults = {
            coinSrc: "http://gw.alicdn.com/tps/i3/TB1QJ5DGpXXXXaBXXXXuv2kGFXX-39-39.png_40x40Q50s150.jpg",     //金币图片地址
            audioSrc: "http://download.taobaocdn.com/freedom/26370/media/shake.mp3", //金币音频地址
            coinWidth: 20,           //金币宽度
            coinHeight: 20,          //金币高度
            density: 30
          };
          this.settings = this._extendDeep(this.defaults, opts);   //深拷贝
          this.density = this.settings.density;                   //密度，即金币个数
          this.timeLag = 1000;                                    //金币散落的事件间隔，数字越大表示间隔越大
          this.coinWidth = this.settings.coinWidth;               //金币宽度
          this.coinHeight = this.settings.coinHeight;             //金币高度
          this.wrapWidth = 0;
          this.wrapHeight = 0;
          this._init();
        }

        Coin.prototype = {
          constructor: Coin,
          /**
           * 动画初始化方法
           * @method _init
           **/
          _init: function () {
            //初始化包括尺寸大小
            this.wrapWidth = document.documentElement.clientWidth;
            this.wrapHeight = document.documentElement.clientHeight;
            this._requestAnimationFrame();
            this._createCanvas();
            this._createAudio();
          },
          /**
           * 对象深拷贝方法
           * @method _extendDeep
           * @param  {object} parent 父对象
           {object} child  子对象
           @return {object} child  父对象继承给子对象
           **/
          _extendDeep: function (child, parent) {
            var i,
              toStr = Object.prototype.toString,
              astr = "[object Array]";
            child = child || {};
            for (i in parent) {
              if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                  child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                  extendDeep(parent[i], child[i]);
                } else {
                  child[i] = parent[i];
                }
              }
            }
            return child;
          },
          /**
           * requestAnimationFrame做兼容
           * @method _requestAnimationFrame
           **/
          _requestAnimationFrame: function () {
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
              window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
              window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
              window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                  callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
              };
            }
            if (!window.cancelAnimationFrame) {
              window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
              };
            }
          },
          /**
           * 创建canvas画布
           * @method _createCanvas
           **/
          _createCanvas: function () {
            var _self = this;
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute("data-id", Date.now());
            if (!this.canvas.getContext) {
              alert("您的浏览器不支持canvas");
              return;
            }
            this.context = this.canvas.getContext('2d');
            this.canvas.width = this.wrapWidth;
            this.canvas.height = this.wrapHeight;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = 0;
            this.canvas.style.left = 0;
            this.canvas.style.zIndex = 1125;
            var oBody = document.getElementsByTagName('body')[0];
            oBody.appendChild(this.canvas);
            this._createCacheCanvas();
          },
          _createCacheCanvas: function () {
            var _self = this;
            this.cacheCanvas = document.createElement('canvas');
            this.cacheContext = this.cacheCanvas.getContext('2d');
            this.cacheCanvas.width = this.wrapWidth;
            this.cacheCanvas.height = this.wrapHeight;
            this.coinImg = new Image();
            this.coinImg.src = this.settings.coinSrc;
            this.coinImg.onload = function () {
              _self._startCacheCanvasAnim();
            }
          },
          /**
           * 执行金币绘制动画
           * @method _startCanvasAnim
           **/
          _startCacheCanvasAnim: function () {
            var _self = this;
            var availWidth = this.cacheCanvas.width - this.coinWidth;
            var availHeight = this.cacheCanvas.height - this.coinHeight;
            //var disX=availWidth/this.density;  //每个硬币X轴的间距
            var coinRange = availWidth * this.density / (this.density + 15);
            var rangeStart = (availWidth - coinRange) / 2;
            var g = 9.8 * 280;   //重力加速度
            var bPlayAudio = false;
            var coinAttrArr = [];  //存储金币下落过程中的一些属性参数
            for (var i = 0; i < _self.density; i++) {
              coinAttrArr[i] = {
                rndX: Math.random(),                                    //存储金币开始降落x轴随机值
                rndOrder: Math.round(Math.random() * _self.timeLag / 17),   //存储金币撒落顺序的一个数组
                time: 0,                                                //存储金币绘制的具体时间
                top: 0,                                                 //存储金币绘制距离顶部的距离
                left: 0,                                                //存储金币弹起后距离左边的距离
                endSpeed: 0,                                            //存储金币第一次接触地面的速度
                bEnd: false,                                            //存储金币是否触碰到地面
                reDownSpeed: 0,                                         //存储金币弹起后重新降落的速度
                reDownHDelta: Math.random() * 100 + 250,                    //存储金币弹起的高度参数，随机值250~350之间
                rndOffsetX: Math.random() * 0.06 + 0.97                     //存储金币x轴的偏移量，随机值0.97~1.03之间
              }
            }
            var startTime = Date.now();  //开始绘制前的时间
            function draw() {
              var drawStart = Date.now();  //记录重绘的结束事件
              var diff = (drawStart - startTime) / 1000;  //计算每次重绘所需要的事件，单位为秒
              startTime = drawStart;   //结束事件传给开始事件
              _self.context.clearRect(0, 0, _self.canvas.width, _self.canvas.height);  //清除画布，方便重绘
              _self.cacheContext.clearRect(0, 0, _self.cacheCanvas.width, _self.cacheCanvas.height);  //清除画布，方便重绘
              _self.cacheContext.save();
              //根据金币个数循环绘制金币
              for (var i = 0; i < _self.density; i++) {
                if ((coinAttrArr[i].rndOrder == 0 && coinAttrArr[i].time == 0)) {   //如果顺序为0，表示开始下落，同时下落的初始时间为0时，赋值初始时间
                  coinAttrArr[i].time = diff;
                }
                if (coinAttrArr[i].time > 0) {     //如果初始事件大于0，表示已经在下落过程中,则每次的初始时间递增
                  coinAttrArr[i].time = coinAttrArr[i].time + diff;
                }
                if (coinAttrArr[i].rndOrder == 0) {  //如果顺序为0，开始下落，则开始绘制金币
                  if (!coinAttrArr[i].bEnd) {   //金币下落（过程一），自由落体运动
                    coinAttrArr[i].top = g * Math.pow(coinAttrArr[i].time, 2) / 2 - _self.coinHeight;   //自由落体加速度运动，求下落的高度
                    //coinAttrArr[i].left=disX*coinAttrArr[i].rndX+i*disX;
                    coinAttrArr[i].left = coinRange * coinAttrArr[i].rndX + rangeStart;
                  } else if (coinAttrArr[i].endSpeed == 0) {   //金币弹起后在空中重新下落（过程三）
                    coinAttrArr[i].reDownSpeed = coinAttrArr[i].reDownSpeed * 1.1;
                    coinAttrArr[i].top = coinAttrArr[i].top + coinAttrArr[i].reDownSpeed;
                    coinAttrArr[i].left = coinAttrArr[i].left * coinAttrArr[i].rndOffsetX;
                  } else {   //金币弹起（过程二）
                    coinAttrArr[i].endSpeed = -Math.abs(coinAttrArr[i].endSpeed * 0.96);
                    if (Math.abs(coinAttrArr[i].endSpeed) < 1) coinAttrArr[i].endSpeed = 0;
                    coinAttrArr[i].top = coinAttrArr[i].top + coinAttrArr[i].endSpeed;
                    coinAttrArr[i].left = coinAttrArr[i].left * coinAttrArr[i].rndOffsetX;
                  }
                  //金币第一次降落超过地面时，将其高度设置和地面齐平
                  if (coinAttrArr[i].top > _self.cacheCanvas.height - _self.coinHeight && !coinAttrArr[i].bEnd) {
                    coinAttrArr[i].top = _self.cacheCanvas.height - _self.coinHeight;
                  }
                  //金币落地时，计算落地的速度
                  if (coinAttrArr[i].top == _self.cacheCanvas.height - _self.coinHeight) {
                    coinAttrArr[i].endSpeed = g * coinAttrArr[i].time / coinAttrArr[i].reDownHDelta;
                    coinAttrArr[i].reDownSpeed = coinAttrArr[i].endSpeed / 10;
                    coinAttrArr[i].bEnd = true;
                  }
                  //绘制金币
                  _self.cacheContext.drawImage(_self.coinImg, coinAttrArr[i].left, coinAttrArr[i].top, _self.coinWidth, _self.coinHeight);
                }
                coinAttrArr[i].rndOrder = coinAttrArr[i].rndOrder == 0 ? 0 : coinAttrArr[i].rndOrder - 1;//顺序每一次重绘则递减一次，直到为0时，代表开始下落
              }
              _self.cacheContext.restore();
              _self.context.drawImage(_self.cacheCanvas, 0, 0, _self.canvas.width, _self.canvas.height);
              var firstH = _self._maxNum(coinAttrArr, "top");//求降落过程中高度最大的金币高度
              if (firstH >= _self.cacheCanvas.height - _self.coinHeight && !bPlayAudio) {
                _self._playAudio();
                bPlayAudio = true;
              }
              var lastH = _self._minNum(coinAttrArr, "top");//求降落过程中高度最小的金币高度
              if (lastH <= _self.cacheCanvas.height + _self.coinHeight) { //最后一个金币高度超出canvas的高度停止重绘
                window.requestAnimationFrame(draw);  //重绘，递回调用绘制方法
              } else {
                console.log("金币都撒完了");
                _self._destory();
              }
            }

            window.requestAnimationFrame(draw);  //第一次绘制
          },
          /**
           * 求最小值
           * @method _minNum
           * @param   {arr}    arr  属性数组
           {string} attr 数组下的属性名称
           * @return  {number}      返回数组下属性值最小的值
           **/
          _minNum: function (arr, attr) {
            var tempArr = [];
            for (var i = 0; i < arr.length; i++) {
              tempArr.push(arr[i][attr]);
            }
            return tempArr.sort(function (a, b) {
              return a - b
            })[0];
          },
          /**
           * 求最大值
           * @method _minNum
           * @param   {arr}    arr  属性数组
           {string} attr 数组下的属性名称
           * @return  {number}      返回数组下属性值最大的值
           **/
          _maxNum: function (arr, attr) {
            var tempArr = [];
            for (var i = 0; i < arr.length; i++) {
              tempArr.push(arr[i][attr]);
            }
            return tempArr.sort(function (a, b) {
              return b - a
            })[0];
          },
          /**
           * 创建音频对象
           * @method _createAudio
           **/
          _createAudio: function () {
            this.audio = document.createElement('audio');
            this.audio.setAttribute("preload", "load");
            var oSource = document.createElement('source');
            oSource.setAttribute("src", this.settings.audioSrc);
            oSource.setAttribute("type", "audio/mp3");
            this.audio.appendChild(oSource);
            var oBody = document.getElementsByTagName('body')[0];
            oBody.appendChild(this.audio);
          },
          /**
           * 播放音频
           * @method _playAudio
           **/
          _playAudio: function () {
            this.audio.play();
          },
          /**
           * 销毁canvas和audio
           * @method _destory
           **/
          _destory: function () {
            var oBody = document.getElementsByTagName('body')[0];
            oBody.removeChild(this.canvas);
            oBody.removeChild(this.audio);
            _this.isCanReceive = true;
          }
        }
        var urlList = [require('../../images/gold1.png'), require('../../images/gold2.png'), require('../../images/gold3.png'), require('../../images/gold4.png'), require('../../images/gold5.png')],
          url = urlList[Math.floor(Math.random() * 5)];

        var coin = new Coin({
          coinSrc: url,     //金币图片地址
          audioSrc: "http://download.taobaocdn.com/freedom/26370/media/shake.mp3", //金币音频地址
          coinWidth: 40,           //金币宽度
          coinHeight: 40,          //金币高度
          density: 30
        });
      }
    },
    mounted(){
      let _this = this;
      if (navigator.userAgent.indexOf("jfjingbao") > -1) {
        this.isApp = true;
      }
      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }

      this.token = this.getCookie('intoToken');

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
    padding-top: 1.8rem;
    background: url("../../images/invite-bg.png") 0/100% 100%;
  }

  .bg.iphonex {
    position: static;
    min-height: 812px;
  }

  .tips-img {
    width: 9.03rem;
    height: 6.02rem;
    margin: 0 auto .36rem;
    background: url("../../images/invite-tips.png") 0/100% 100%;
  }

  .get-num {
    display: flex;
    width: 11.01rem;
    margin: .45rem auto .3rem;
  }

  .get-num .fixed-num, .get-num .random-num {
    width: 4.59rem;
    height: 5.91rem;
    line-height: 6.87rem;
    font-size: .72rem;
    color: #fff;
    background: url("../../images/money-bg.png") 0/100% 100%;
  }

  .get-num .txt {
    flex: 1;
    background: url("../../images/or1.png") no-repeat center/.92rem .9rem;
  }

  .invite {
    padding-bottom: 2.25rem;
  }

  .tips-txt, .invite .txt {
    font-size: .5rem;
    color: #af2117;
  }

  .invite .txt span {
    font-size: .8rem;
    color: #ffff25;
    padding: 0 .3rem;
  }

  .invite-btn {
    width: 7.66rem;
    height: 1.68rem;
    margin: .36rem auto 0;
    background: url("../../images/invite-btn.png") 0/100% 100%;
  }

  .footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2.08rem;
    background: url("../../images/footer-bg.png") 0/100% 100%;;
    display: flex;
    padding: .51rem 0 .3rem;
  }

  .footer-bar > div {
    flex: 1;
    font-size: .5rem;
    color: #f8cac8;
  }

  .footer-bar > div:nth-child(2) {
    border-left: 1px solid #e5a393;
    border-right: 1px solid #e5a393;
  }

  .footer-bar .txt {
    font-size: .32rem;
    margin-top: .09rem;
  }

  .receive-success-mask, .receive-fail-mask, .bgshow {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1120;
    background: rgba(0, 0, 0, .8);
  }

  .receive-success-mask {
    background: rgba(0, 0, 0, 0);
  }

  .receive-success-mask.animate {
    animation: animate1 1s;
    animation-fill-mode: forwards;
  }

  @keyframes animate1 {
    0% {
      background: rgba(0, 0, 0, 0);
    }
    100% {
      background: rgba(0, 0, 0, .8);
    }
  }

  .receive-success {
    position: absolute;
    left: 50%;
    bottom: 7.56rem;
    margin-left: -4.18rem;
    width: 8.35rem;
    height: 12.27rem;
    z-index: 1130;
    background: url("../../images/receive-success.png") 0/100% 100%;
    transform: scale(.3, .3);
  }

  .receive-success-mask.animate + .receive-success {
    animation: animate2 1s;
    animation-fill-mode: forwards;
  }

  @keyframes animate2 {
    0% {
      transform: scale(.3, .3);
    }
    80% {
      transform: scale(1.1, 1.1);
    }
    90% {
      transform: scale(.9, .9);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  .receive-success .title {
    width: 7.29rem;
    height: 1.05rem;
    margin: 2.76rem auto 0;
    font-size: .48rem;
    color: #ffe9a6;
    padding-top: .06rem;
    background: url("../../images/money-title.png") 0/100% 100%;
  }

  .receive-success .close, .receive-fail .close {
    width: 1.14rem;
    height: 1.14rem;
    background: url("../../images/icon-close.png") 0/100% 100%;
    margin: -.54rem -.84rem 0 0;
  }

  .receive-success .money-img {
    width: 2.54rem;
    height: 3.62rem;
    margin: .24rem auto 0;
    background: url("../../images/money-bg1.png") 0/100% 100%;
  }

  .receive-success .txt1 {
    margin: .24rem auto .09rem;
    font-size: .48rem;
    color: rgb(94, 58, 37);
  }

  .receive-success .txt1 span {
    color: rgb(212, 68, 0);
  }

  .receive-success .txt1 i {
    font-size: .9rem;
  }

  .receive-success .txt2 {
    font-size: .36rem;
    color: rgb(149, 124, 100);
  }

  .receive-success .invite-btn1, .receive-fail .invite-btn1 {
    width: 3.16rem;
    height: 1.06rem;
    background: url("../../images/sure-btn.png") no-repeat center/100% 100%;
    font-size: .48rem;
    color: #9e3a1d;
    line-height: 1.08rem;
    margin: .6rem auto 0;
  }

  .receive-fail {
    position: absolute;
    top: 7.35rem;
    left: 2.01rem;
    right: 2.16rem;
    height: 5.4rem;
    background: url("../../images/get-box-bg.png") 0/100% 100%;
  }

  .receive-fail .close {
    margin: .21rem -.72rem 0 0;
  }

  .receive-fail .text {
    font-size: .45rem;
    color: #fff;
    line-height: .72rem;
    margin-top: 1.08rem;
  }

  .receive-fail .invite-btn1 {
    margin-top: .75rem;
  }

  .bgtext {
    position: absolute;
    right: 1rem;
    width: 10.26rem;
    height: 9.27rem;
    background: url("../../images/wxshare.png") 0/100% 100%;
  }
</style>
