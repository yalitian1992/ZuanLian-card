<template>
  <div :class="{'active': isShake, iphonex: isIphonex}" class="shake" id="shake">
    <!--背景图-->
    <div class="bg"></div>
    <!--返回按钮-->
    <!--<div class="back-btn" @click="goBack()"></div>-->
    <!--头部-->
    <div class="top-bar clearfix" :class="{iphonex: isIphonex}">
      <div class="notice pull-left" v-if="noticeShow">
        <ul class="notice-list">
          <li class="notice-item" v-for="item in notice" @touchstart.prevent=""
              v-if="item.user && item.chest_prizes.length>0">
            恭喜<span>{{item.user.nick_name}}</span>在{{item.time}}前获得<span>【{{item.chest_prizes[0].name}}】</span></li>
          <li class="notice-item" v-for="item in notice" @touchstart.prevent=""
              v-if="item.user && item.chest_prizes.length>0">
            恭喜<span>{{item.user.nick_name}}</span>在{{item.time}}前获得<span>【{{item.chest_prizes[0].name}}】</span></li>
        </ul>
      </div>
    </div>
    <!--奖品列表-->
    <div class="box-type" :class="{iphonex: isIphonex}">
      <div class="background align-c">
        <div class="type-top">
          <div>开宝箱可获得</div>
        </div>
        <div class="bg-middle">
          <div class="award-list">
            <div class="big-award">
              <div class="pic">
                <img :src="imgBaseUrl() + boxCon.big_chest_prize.t267" alt="">
              </div>
              <div class="name align-c text-overflow-multi">{{boxCon.big_chest_prize.name}}</div>
            </div>
            <ul class="small-award clearfix">
              <li class="pull-left"
                  :class="{entity: item.level == 1 || item.level == 4, rare: item.level == 2, ordinary: item.level == 3}"
                  v-for="item in boxCon.chest_prizes.slice(0,6)">
                <div class="img-border ">
                  <img :src="imgBaseUrl() + item.t114" alt="">
                </div>
                <div class="name text-overflow">{{item.name}}</div>
              </li>
            </ul>
          </div>
          <div class="see-more" @click="goAllAward">查<br/>看<br/>更<br/>多</div>
        </div>
      </div>
    </div>
    <!--宝箱-->
    <div class="box" :class="{'special':isOpen}">
      <div class="ston-bg"></div>
      <ul class="treasure-box" :class="{open: isOpen}">
        <li :class="{active: isOpen}" @click="openBox">
          <div class="mask"></div>
          <img src="../../images/openBox-light-hou.png" alt="" class="lightyellow">
          <img src="../../images/openBox-bg-back.png" alt="" class="card1">
          <img src="../../images/openBox-bg-back.png" alt="" class="card2">
          <img src="../../images/openBox-bg-back.png" alt="" class="card3">
          <div class="boxall">
            <img class="top" :class="{active: isOpen}" :src="bBoxTopImg" alt="">
            <img class="bottom" :src="bBoxBottomImg" alt="">
          </div>
          <img src="../../images/openBox-light-qian.png" alt="" class="lightwhite">
        </li>
      </ul>
      <ul class="cardList" id="cardList"
          :class="{'show': isCardListShow, 'hide': isCardListHide}" v-show="CardListBox">
        <li id="liCard"></li>
        <li v-for="(item, index) in awardDataList" class="prizeCard"
            :class="{'active': item.isClick,'level1': item.level=='1' || item.level=='4','level2': item.level=='2','level3': item.level=='3'}"
            @click="luckDraw(index)">
          <span class="light-behind"></span>
          <span class="nomalBg"></span>
          <span class="light-front"></span>
          <img :src="imgBaseUrl() + item.thumbnail" alt="" :onerror="defaultImg(0)"/>
          <span class="prizeBg"></span>
          <div class="award-detail">
            <p class="text-overflow-multi">{{item.name}}</p>
          </div>
        </li>
        <li class="receive"><span @click="reseiveAll" v-if="sureBtn">确定</span></li>
      </ul>
      <div class="open-btn align-c" :class="{active: !isCanOpen}" @click="openBox">
        <div>开启必中</div>
      </div>
    </div>
    <div class="award-record" v-if="awardRecordShow">
      <div>
        <div>
          <div class="title align-c">看其他用户中了什么</div>
          <ul class="record-list">
            <li v-for="item in awardRecord"
                v-if="item.user && item.chest_prizes.length>0 && item.user.login_name.slice(0,5) != '10000'">
              <div class="name align-c"><span>{{item.user.nick_name}}</span>开启宝箱获得</div>
              <div class="goods">
                <div class="img-border">
                  <img :src="imgBaseUrl() + item.chest_prizes[0].thumbnail" alt="">
                </div>
                <div class="info">
                  <div class="goods-name text-overflow-multi">{{item.chest_prizes[0].name}}</div>
                  <div class="price">￥{{item.chest_prizes[0].price}}</div>
                </div>
              </div>
              <div class="user">
                <div class="user-info">
                  <div class="img">
                    <img :src="item.user.head_url" alt="">
                  </div>
                  <div class="phone">{{cutPhone(item.user.login_name)}}</div>
                </div>
                <div class="time">获奖日期：{{format(item.created_at)}}</div>
              </div>
            </li>
          </ul>
          <div class="go-open-box align-c" @click="goTop">去开宝箱</div>
        </div>
      </div>
    </div>
    <!-- 全屏透明遮罩 -->
    <div class="screenMask" v-if="screenMaskShow" @click.stop=""></div>
  </div>
</template>

<script>
  import {imgBaseUrl, mediaUrl} from '../../config/config'
  export default {
    data () {
      return {
        imgBaseUrl,
        mediaUrl,
        noticeShow: false,   //头部通知是否显示
        notice: [],          //头部获奖通知
        awardRecordShow: false, //底部获奖列表是否显示
        awardRecord: [],      //底部获奖列表
        boxCon: {            //宝箱内容
          big_chest_prize: {
            t267: '',
            name: ''
          },
          chest_prizes: []
        },
        bBoxTopImg: require('../../images/nomalImg.gif'),      //大宝箱顶部图片
        bBoxBottomImg: require('../../images/nomalImg.gif'),   //大宝箱底部图片
        isShake: false,      //是否抖动
        screenMaskShow: false,    //全屏遮罩是否显示
        awardDataList: [],   //奖品列表数据
        awardId: '',         //奖品ID
        awardSign: '',       //奖品标记
        isCanOpen: true,     //开启按钮是否能点
        isOpen: false,    //宝箱是否动画执行
        isCardListShow: false,//翻牌列表显示
        CardListBox: false,  //翻牌模块显示
        isCardListHide: false,//翻牌列表隐藏
        isIphonex: false,    //是否是iPhoneX
        isHttpOk: false,    // 接口是否正常（包括500/404）
        sureBtn: true,   //领取奖品的确定按钮是否显示
      }
    },
    methods: {
      //跳到查看更多
      goAllAward: function () {
        this.$router.push({path: 'totalPrize', query: {boxId: this.boxCon.chest_box.id, native: 0}})
      },
      // 打开宝箱
      openBox: function () {
        var _this = this;
        _this.addAudio();
        if (this.isCanOpen) {
          this.isCanOpen = false;
          this.screenMaskShow = true;
          setTimeout(function () {
            _this.screenMaskShow = false;
            _this.isCanOpen = true;
          }, 3500)
          this.$http({
            method: 'get',
            url: '/api/chest_boxs/app_landing_box'
          }).then(function (res) {
            _this.isHttpOk = true;
            if (res.body.execErrCode == 200) {
              _this.isOpen = true;
              _this.addAudio(_this.mediaUrl + "/media/openbox.mp3");
              _this.awardId = res.body.execData.chest_record_tmp.id;
              _this.awardSign = res.body.execData.sign;

              _this.clientType(function () {
                let html = document.documentElement, body = document.body, scrollTop = body.scrollTop;
                html.style.overflow = 'hidden';
                body.style.overflow = 'hidden';
                body.className = 'body-fixed';
                body.style.top = scrollTop * -1 + 'px';
              }, function () {
                document.body.addEventListener('touchmove', function (e) {
                  if (e.target.className.indexOf('cardList') > -1) {
                    e.preventDefault();
                  } else {
                    e.stopPropagation();
                  }
                })
              })

              var data = res.body.execData.chest_prizes;
              for (var i = 0; i < data.length; i++) {
                data[i].isClick = false;
              }
              _this.awardDataList = data
              _this.CardListBox = true;
              _this.isCardListHide = true;
              setTimeout(function () {
                if (_this.awardDataList.length <= 0) {
                  _this.isOpen = false;
                  _this.isCanOpen = true;
                  _this.toast("本宝箱获取已达上限，请等待刷新")
                  _this.CardListBox = false;
                  _this.isCardListHide = true;
                  _this.isCardListShow = false;
                } else {
                  _this.sureBtn = false;
                  _this.isCardListHide = false;
                  _this.isCardListShow = true;
                  var cardList = document.getElementById("cardList");
                  var scrollHeight = cardList.scrollHeight
                  var clientHeight = cardList.clientHeight
                  cardList.scrollTop = scrollHeight - clientHeight
                  var startTop = cardList.scrollTop
                  var nomalScroll = (document.getElementById("liCard").offsetHeight * 2) / 4
                  var up = false;
                  var down = true;
                  var timerCard = setInterval(function () {
                    if (up == true && down == true) {
                      startTop += 5
                      if (startTop >= 30) {
                        startTop = 30
                        down = false
                        up = false;
                      }
                    } else if (startTop > 0 && up == false && down == true) {
                      startTop -= 50
                      if (startTop <= 0) {
                        startTop = 0
                        up = true
                      }
                    }
                    if (down == false) {
                      startTop -= 5
                      if (startTop <= 0) {
                        startTop = 0
                        _this.sureBtn = true;
                        clearInterval(timerCard);
                      }
                    }
                    cardList.scrollTop = startTop + nomalScroll
                  }, 17);
                }
              }, 2540)
              this.clientType(function () {
                window.Android.registOpenBox(_this.awardId, _this.awardSign);
              }, function () {
                window.webkit.messageHandlers.AppModel.postMessage({
                  type: 'registOpenBox',
                  id: _this.awardId,
                  sign: _this.awardSign
                });
              })
            } else {
              _this.screenMaskShow = false;
              _this.addAudio(_this.mediaUrl + "/media/disopenbox.mp3");
              _this.isCanOpen = true;
              _this.toast(res.body.execMsg)
            }
          })
          setTimeout(function () {
            if (_this.isHttpOk == false) {
              _this.toast("网络异常， 请稍后重试！")
            }
          }, 3000)
        }
      },
      // 翻牌抽奖
      luckDraw: function (index) {
        var _this = this;
        this.isShake = false;
        if (_this.awardDataList[index].isClick == false) {
          var audioNow = document.getElementsByTagName("audio")[0];
          if (audioNow) {
            if (this.awardDataList[index].level == 1) {
              this.isShake = true;
              audioNow.src = this.mediaUrl + "/media/award-level1.mp3"
            } else if (this.awardDataList[index].level == 2) {
              audioNow.src = this.mediaUrl + "/media/award-level2.mp3"
            } else {
              audioNow.src = this.mediaUrl + "/media/award-level3.mp3"
            }
            audioNow.play();
          }
        }
        var windowHeight = document.getElementById("liCard").offsetHeight * 2; // 屏幕的高度
        var scrollHeight = (windowHeight / 2) * index + windowHeight / 4; // 滚动区域的高度
        var cardList = document.getElementById("cardList")
        var startTop = cardList.scrollTop
        var timer = setInterval(function () {
          if (startTop > scrollHeight) {
            startTop -= 15
            cardList.scrollTop = startTop
            if (startTop <= scrollHeight) {
              cardList.scrollTop = scrollHeight
              _this.awardDataList[index].isClick = true;
              clearInterval(timer);
            }
          } else {
            startTop += 15
            cardList.scrollTop = startTop
            if (startTop >= scrollHeight) {
              cardList.scrollTop = scrollHeight
              _this.awardDataList[index].isClick = true;
              clearInterval(timer);
            }
          }
        }, 17);
      },
      // 领取奖品
      reseiveAll: function () {
        let _this = this;
        this.isOpen = false;
        this.isCanOpen = true;
        this.setSlide();
        var audioNow = document.getElementsByTagName("audio")[0];
        if (audioNow) {
          audioNow.src = this.mediaUrl + '/media/Receive-all.mp3';
          audioNow.play();
        }
        this.CardListBox = false;
        this.isCardListHide = true;
        this.isCardListShow = false;
        this.clientType(function () {
          window.Android.registPrize(_this.awardId, _this.awardSign);
        }, function () {
          window.webkit.messageHandlers.AppModel.postMessage({
            type: 'registPrize',
            id: _this.awardId,
            sign: _this.awardSign
          });
        })
      },
      /*添加音效*/
      addAudio: function (src) {
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
      /*返回顶部*/
      goTop: function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {},
    mounted(){
      setTimeout(function () {
        var bodyElm = document.body
        var myElm = document.getElementById("shake")
        var wHeight = bodyElm.clientHeight;
        var elmHeight = myElm.clientHeight
        var finishHeight = elmHeight - wHeight
        if (finishHeight > 0) {
          var bodyStart = 1;
          var bodyTimer = setInterval(function () {
            bodyStart += 1
            bodyElm.scrollTop = bodyStart
            if (bodyStart >= finishHeight) {
              bodyElm.scrollTop = finishHeight
              clearInterval(bodyTimer);
            }
          }, 17)
        }
      }, 1000)

      this.$http({
        method: 'get',
        url: '/api/chest_boxs/app_landing_box_detail'
      }).then(function (res) {
        let data = res.body;
        if (data.execErrCode == 200) {
          this.boxCon = data.execData;
          this.bBoxTopImg = require('../../images/gold-top.png');
          this.bBoxBottomImg = require('../../images/gold-bottom.png');
        } else {
          this.toast(data.execMsg);
        }
      })

      let _this = this;
      this.$http({
        method: 'get',
        url: '/api/chest_boxs/notice?q[prize_type_in][]=1&q[prize_type_in][]=7'
      }).then(function (res) {
        let data = res.body;
        if (data.execErrCode == 200) {
          this.notice = data.execData.chest_records;
          this.awardRecord = data.execData.chest_records;
          if (this.notice.length > 0) {
            this.noticeShow = true;
            this.awardRecordShow = true;
            this.$nextTick(function () {
              let list = document.getElementsByClassName('notice-list')[0],
                width = list.clientWidth,
                scrollWidth = list.scrollWidth,
                scrollX = 0;
              setInterval(function () {
                scrollX++;
                if (scrollWidth - scrollX - width <= 100) {
                  let firstLiWidth = list.getElementsByClassName('notice-item')[0].clientWidth,
                    noticeFirst = _this.notice[0];
                  _this.notice.shift();
                  _this.notice.push(noticeFirst);
                  scrollX -= firstLiWidth;
                }
                list.scrollLeft = scrollX;
              }, 17)
            })
          }
        } else {
          this.toast(data.execMsg);
        }
      }, function () {

      })

      this.clientType(function () {
      }, function () {
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        } else {
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })

      this.pvCount();
    }
  }
</script>
<style>
  @import '../../style/treasurebox.css';
</style>
<style scoped>
  .shake.iphonex {
    min-height: 816px;
  }

  /*背景图*/
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: url("../../images/box-bg.jpg") 0/100% 100%;
  }

  /*头部*/
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 1.66rem;
  }

  .top-bar.iphonex {
    position: absolute;
    top: 33px;
  }

  .top-bar .notice {
    width: 100%;
    height: .63rem;
    line-height: .63rem;
    margin-top: .51rem;
    font-size: .36rem;
    color: #fff;
    background: url("../../images/notice-bg.png") 0/100% 100%;
    overflow: hidden;
  }

  .top-bar .notice .notice-list {
    overflow-x: scroll;
    white-space: nowrap;
  }

  .top-bar .notice .notice-item {
    display: inline-block;
    padding-right: 2.1rem;
  }

  .top-bar .notice .notice-item span {
    color: #ffdd00;
  }

  /*奖品列表*/
  .box-type {
    height: 7.66rem;
    padding: 1.66rem .6rem 0;
  }

  .box-type.iphonex {
    padding-top: 84px;
    height: 264px;
  }

  .box-type .background {
    margin-top: .54rem;
    height: 5.46rem;
    padding: .48rem 0;
    background: url("../../images/type-bg-top.png") no-repeat top/100% .52rem, url("../../images/type-bg-bottom.png") no-repeat bottom/100% .52rem;
    position: relative;
  }

  .box-type .background .type-top {
    position: absolute;
    top: -.54rem;
    height: 1.08rem;
    left: .54rem;
    right: .54rem;
    background: url("../../images/type-top.png") 0 /100% 100%;
    font-size: .42rem;
    color: #fff5d7;
    padding-top: .24rem;
    line-height: 1;
  }

  .box-type .background .bg-middle {
    height: 4.5rem;
    padding-top: .45rem;
    background: url("../../images/type-bg-middle.png") 0/100%;
  }

  .bg-middle .award-list {
    display: flex;
    padding: 0 .66rem 0 .9rem;
  }

  .big-award {
    position: relative;
    width: 3rem;
  }

  .big-award .pic {
    height: 3rem;
    padding: .33rem;
    background: url("../../images/big-award-border.png") 0/100% 100%;
    position: relative;
  }

  .big-award .pic img, .small-award li .img-border img {
    height: 100%;
  }

  .big-award .name {
    margin-top: .06rem;
    font-size: .39rem;
    line-height: .48rem;
    color: #ffC945;
  }

  .small-award {
    flex: 1;
    margin-left: .24rem;
  }

  .small-award li {
    width: 2.1rem;
  }

  .small-award li .img-border {
    width: 1.42rem;
    height: 1.42rem;
    margin: 0 auto;
    padding: .15rem;
    position: relative;
  }

  .small-award li.ordinary .img-border {
    background: url("../../images/ordinary.png") 0/100% 100%;
  }

  .small-award li.rare .img-border {
    background: url("../../images/rare.png") 0/100% 100%;
  }

  .small-award li.entity .img-border {
    background: url("../../images/big-award-border.png") 0/100% 100%;
  }

  .small-award li .name {
    font-size: .36rem;
    color: #ffc945;
    line-height: 1;
    padding: .06rem 0;
  }

  .see-more {
    position: absolute;
    top: 1.05rem;
    right: -.15rem;
    z-index: 10;
    width: .88rem;
    height: 2.28rem;
    background: #f3eacd;
    border: .06rem solid #c24215;
    font-size: .42rem;
    line-height: .48rem;
    color: #c24215;
    padding-top: .15rem;
  }

  .box {
    padding: 1.87rem 0 1.2rem;
  }

  .award-record {
    padding: .6rem;
    position: relative;
    z-index: 10;
  }

  .award-record > div {
    background: url("../../images/record-t.png") no-repeat top/100% .39rem, url("../../images/record-b.png") no-repeat bottom/100% .39rem;
    padding: .3rem 0;
  }

  .award-record > div > div {
    padding: .36rem 0;
    background: url("../../images/record-m.png") 0/100% auto;
  }

  .award-record .title {
    width: 8.04rem;
    margin: 0 auto;
    font-size: .39rem;
    line-height: 1;
    color: #e8bb53;
    background: url("../../images/title-line.png") no-repeat 0/100% .06rem;
  }

  .award-record .record-list {
    margin: .48rem .45rem;
  }

  .award-record .record-list li {
    height: 4.19rem;
    margin-bottom: .45rem;
    padding: 0 .48rem;
    background: url("../../images/award-info.png") no-repeat 0/100% 100%;
  }

  .award-record .record-list li:last-child {
    margin: 0;
  }

  .award-record .name {
    font-size: .45rem;
    color: #fff;
    height: 1.02rem;
    line-height: 1.02rem;
    border-bottom: 1px solid #f0c253;
  }

  .award-record .name span {
    color: #ffdd00;
  }

  .award-record .goods {
    display: flex;
    padding-top: .3rem;

  }

  .award-record .goods .img-border {
    width: 1.98rem;
    height: 1.98rem;
    padding: .12rem;
    background: url("../../images/pro-border.png") no-repeat 0/100% 100%;
  }

  .award-record .goods .img-border img {
    height: 100%;
  }

  .award-record .goods .info {
    flex: 1;
    position: relative;
    padding: .15rem 0 .15rem .33rem;
  }

  .award-record .goods .info .goods-name {
    font-size: .42rem;
    color: #fff;
    line-height: 1.2;
  }

  .award-record .goods .info .price {
    font-size: .39rem;
    color: #ffdd00;
    position: absolute;
    bottom: .15rem;
  }

  .award-record .user {
    display: flex;
    justify-content: space-between;
    font-size: .36rem;
    color: #ffc46e;
    height: .89rem;
    line-height: .89rem;
  }

  .award-record .user .user-info {
    display: flex;
  }

  .award-record .user .img {
    width: .72rem;
    height: .72rem;
    border-radius: 50%;
    overflow: hidden;
    margin: .06rem .15rem 0 0;
  }

  .award-record .go-open-box {
    width: 3.6rem;
    height: 1.08rem;
    line-height: 1.08rem;
    background: url(../../images/deta_btn.png) no-repeat center/100% 100%;
    font-size: .45rem;
    color: #9E3A1D;
    margin: 0 auto;
  }
</style>
