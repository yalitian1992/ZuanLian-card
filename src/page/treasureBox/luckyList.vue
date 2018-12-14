<template>
  <div>
    <div class="body">
      <div></div>
    </div>
    <div class="main" :class="{iphonex: isIphonex,ios:isIos}">
      <p class="toplayout" v-if="isIphonex && appOpen"></p>
      <div class="topHeight clearfix" :class="{iphonex: isIphonex && appOpen}">
        <p class="redLine"></p>
        <!--<p class="lamp"></p>-->
        <div class="back" @click="intoToken()"></div>
        <div class="postionTop">
          <p class='LuckyTitle'>宝箱进度</p>
        </div>
        <div class="luckyTop">

          <div class="luckyPro clearfix">
            <div class="BoxTop">
              <img :src="luckyUser.sBoxImg" alt="">
              <p>{{luckyUser.text}}</p>
            </div>
            <div class="progressBox">
              <div class="progressLen" :style="{width:luckyUser.width+'%'}"></div>
              <div class="progressLay"></div>
            </div>
            <div class="Boxtext">
              本期还可开启<span>{{luckyUser.left_count}}</span>次，超值奖品等你来开！
            </div>
          </div>
        </div>
        <!--幸运用户-->
        <!--<div class="luckyTop">-->
        <!--<div class="luckyPro clearfix">-->
        <!--<div>-->
        <!--<div class="Luckyleft">-->
        <!--<img :src="luckyUser.prize_img" alt="" :onerror="defaultImg(0)">-->
        <!--<div class="imgMask"></div>-->
        <!--<div class="snapUp"></div>-->
        <!--</div>-->
        <!--<div class="Luckyright">-->
        <!--<p class="LuckyproName">-->
        <!--{{luckyUser.prize_name}}-->
        <!--</p>-->
        <!--<p class="LuckyproPrice">-->
        <!--￥{{luckyUser.prize_price}}-->
        <!--</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="luckyUser">-->
        <!--<div class="userleft">-->
        <!--<div class="userImg">-->
        <!--<img :src="luckyUser.user_img" alt="" :onerror="defaultImg(0)">-->
        <!--</div>-->
        <!--<div class="userInfo">-->
        <!--<p class="username">{{luckyUser.user_name}}</p>-->
        <!--<p class="userphone">{{luckyUser.user_phone.substr(0,3)+'****'+luckyUser.user_phone.substr(7,11)}}</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="userright">-->
        <!--<p>获奖时间</p>-->
        <!--<p class="userTiem">{{luckyUser.prize_time}}</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="garnish">
          <p class="garnishLeft"></p>
          <p class="garnishCenter"></p>
          <p class="garnishRight"></p>
        </div>
      </div>
      <div class="PorTop" :class="{iphonex: isIphonex && appOpen}">
        <p class='ProTitle'>更多奖品</p>
      </div>
      <div class="wallTop" :class="{iphonex: isIphonex && appOpen}"></div>
      <div class="wallCenter" :class="{iphonex: isIphonex && appOpen}"></div>
      <div class="wallBottom"></div>
      <div class="ProBox clearfix">
        <div class="ScrollList" :class="{iphonex: isIphonex&&appOpen}">
          <div class="HotPro clearfix">
            <div class="landscape">
              <p>
                最<br>热<br>门<br>奖<br>品
              </p>
            </div>
            <div class="HotProInfoBox">
              <div class="HotProimg">
                <img :src="imgBaseUrl()+mainProducts.t267" alt="" :onerror="defaultImg(0)">
              </div>
              <div class="HotProInfo">
                <p class="HotProName">{{mainProducts.name}}</p>
                <p class="HotProNum" v-if="mainProducts.promotion_words">{{mainProducts.promotion_words}}人必得</p>
                <p class="HotProprice">￥{{mainProducts.price}}</p>
              </div>
            </div>
          </div>
          <ul class="ProList clearfix">
            <li v-for="(item,index) in proList" :class="'list'+index">
              <div @click="profile(item,index)">
                <div class="ProListImg">
                  <img :src="imgBaseUrl()+item.t114" alt="" :onerror="defaultImg(0)">
                  <div class="broughtNum" v-if="item.lottery_num>0 && !item.is_over">{{item.lottery_num}}人已领</div>
                </div>
                <!--领空-->
                <div v-if="item.is_over && item.cbp_prize_type!=4">
                  <div class="layout"></div>
                  <div class="broughtUp">已领空</div>
                </div>
              </div>
              <div class="Proint" :class="[postionBottom? 'bottom': 'top',postionRight?'right':'left' ]"
                   v-if="profileShow && proindex==index">
                <p class="ProintName">{{item.name}}</p>
                <p>
                  <span class="ProintNum" v-if="item.promotion_words">{{item.promotion_words}}</span>
                  <span class="ProintPrice">￥{{item.price}}</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="Proint nones" style="position: fixed; left:-10000px; top:-7111px; z-index:0;">
        <p class="ProintName">商品名字</p>
        <p>
          <span class="ProintNum">8人必得</span>
          <span class="ProintPrice">￥1000</span>
        </p>
      </div>
      <div class="bottomHeight" style="height:1.6rem; position: fixed; left:-10000px; top:-7111px; z-index:0; "></div>
      <!--进入按钮-->
      <!--<div class="into" v-if="$route.query.fromBox != 1">-->
      <!--<p class="intoBotton" @click="intoToken()"></p>-->
      <!--</div>-->
      <p class="bottomIng"></p>
    </div>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  export default {
    data () {
      return {
        imgBaseUrl,
        mainProducts: {
          price: '0.0'
        },
        proList: {},
        profileShow: false,
        proindex: '',
        luckyUser: {
          prize_img: '',
          prize_name: '',
          prize_price: '',
          prize_time: '',
          user_name: '',
          user_phone: '123121212122',
          width: 0
        },
        luckyUsers: [],
        luckyNum: '0',
        isHttp: true,      //是否可以请求
        params: {page: 1}, //地址列表请求数据参数
        loadingShow: true, //loading
        isIphonex: false,      //是否是iPhonex
        isIos: false,
        Topheight: '0',
        ProHeight: '0',
        Topwidth: '0',
        PorTopHeight: '0',
        totalHeight: '',
        postionTop: false,
        postionBottom: false,
        postionLeft: false,
        postionRight: false,
        timeFunction: '',
        appOpen: false
      }
    },
    methods: {
      profile: function (item, index,) {
        this.end()
        let e = event || window.event;
        let y = e.clientY;
        this.postionTop = false
        this.postionBottom = false
        this.postionLeft = false
        this.postionRight = false
        if (Number(y) - Number(this.totalHeight) >= this.ProHeight) {
          this.postionTop = true;
        } else {
          this.postionBottom = true;
        }
        if (index % 4 == 3) {
          this.postionRight = true;
        } else {
          this.postionLeft = true;
        }
        this.profileShow = true;
        this.proindex = index;
        this.start()
      },
      end: function () {
        var _this = this;
        clearTimeout(_this.timeFunction)
      },
      start: function () {
        var _this = this;
        _this.timeFunction = setTimeout(function () {
          _this.profileShow = false;
        }, 3000)
      },
      luckySwiper: function () {
        if (this.luckyNum == this.luckyUsers.length) {
          this.luckyNum = 0;
        }
        this.luckyUser = this.luckyUsers[this.luckyNum];
        this.luckyUser.width = this.luckyUser.left_count / this.luckyUser.chest_box.hands * 100
      },
      adderssListHttp: function () {
        if (this.isHttp) {
          var _this = this;
          _this.isHttp = false;
          this.asyncHttp('get', '/api/box_lucky_walls/index.json', _this.params, function (data) {
            _this.loadingShow = false;
            _this.isHttp = true;
            if (data.execDatas.other_products.length < 32) {
              _this.isHttp = false;
            }
            if (_this.params.page == 1) {
              _this.proList = data.execDatas.other_products;
            } else {
              _this.proList = _this.proList.concat(data.execDatas.other_products);
            }
            _this.params.page++;
          });
        }
      },
      //进入
      intoToken: function () {
        if (this.$route.query.fromOpenBox == 1) {
          this.setCookie('directIn', 'noDirectIn', 1);
        }
        this.$router.replace({path: '/openBox'});
      }
    },
    mounted(){
      let _this = this;
      let agent = navigator.userAgent
      if (agent.indexOf("jfjingbao") != -1) {
        _this.appOpen = true
      } else {
        _this.appOpen = false
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
      this.asyncHttp('get', '/api/box_lucky_walls/index.json', {}, function (data) {
        _this.mainProducts = data.execDatas.main_products;
      })
      _this.adderssListHttp();
      /*滑到底部加载下一页*/
      this.scrollMore(function () {
        _this.adderssListHttp();
      }, document.getElementsByClassName('ProBox')[0])

      this.asyncHttp('get', '/api/chest_boxs/index', {}, function (data) {
        let list = data.execData.current_boxs;
        for (let i in list) {
          list[i].type = i;
          switch (i) {
            case '1':
              list[i].sBoxImg = require('../../images/bronze-s.png');
              list[i].text = '青铜宝箱奖品';
              break;
            case '2':
              list[i].sBoxImg = require('../../images/silver-s.png');
              list[i].text = '白银宝箱奖品';
              break;
            case '3':
              list[i].sBoxImg = require('../../images/gold-s.png');
              list[i].text = '黄金宝箱奖品';
              break;
            case '4':
              list[i].sBoxImg = require('../../images/platinum-s.png');
              list[i].text = '铂金宝箱奖品';
              break;
          }
          _this.luckyUsers.push(list[i]);
        }
        _this.luckyUser = _this.luckyUsers[0];
        _this.luckyUser.width = _this.luckyUser.left_count / _this.luckyUser.chest_box.hands * 100
        _this.$nextTick(function () {
          setInterval(function () {
            _this.luckyNum++;
            if (_this.luckyUsers && _this.luckyUsers.length > 0) {
              _this.luckySwiper()
            } else {
              return
            }
          }, 3000)
        })
        //幸运用户
//        _this.luckyUsers=data.execDatas.chest_records;
//        _this.luckyUser=data.execDatas.chest_records[0];
//        _this.$nextTick(function(){
//          setInterval(function () {
//            _this.luckyNum ++;
//            if(_this.luckyUsers.length>0) {
//              _this.luckySwiper()
//            }else{
//              return
//            }
//          }, 3000)
//        })
      })
      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }
      if (_this.$route.query.ihaveuToken) {
        _this.setCookie('ihaveuToken', _this.$route.query.ihaveuToken, 3)
      }
      setTimeout(function () {
        _this.Topheight = document.getElementsByClassName('topHeight')[0].clientHeight;
        _this.Topwidth = document.getElementsByClassName('topHeight')[0].clientWidth;
        _this.PorTopHeight = document.getElementsByClassName('PorTop')[0].clientHeight;
        _this.ProHeight = document.getElementsByClassName('nones')[0].clientHeight;
        _this.totalHeight = Number(_this.Topheight) + Number(_this.PorTopHeight) + Number(_this.ProHeight);
      }, 1000)

      let html = document.documentElement, body = document.body;
      this.clientType(function () {
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
    }
  }
</script>
<style scoped>
  .body {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: url("../../images/box-bg1.jpg") no-repeat center/100% 100%;
  }

  .main.iphonex {
    height: 100%;
    min-height: 812px;
  }

  .main.ios {
    height: 100%;
  }

  .redLine {
    width: 100%;
    height: .75rem;
    background: url("../../images/redLine.png") no-repeat center/100% 100%;
    position: relative;
    z-index: 1;
  }

  /*.lamp{*/
  /*width:2.98rem;*/
  /*height:2.75rem;*/
  /*background: url("../../images/lamp.png") no-repeat center/100% 100%;*/
  /*position: absolute;*/
  /*right:0;*/
  /*top:0;*/
  /*}*/
  .luckyTop {
    width: 10.83rem;
    height: 4.40rem;
    margin: .1rem auto 0;
    background: url("../../images/luckyWood.png") no-repeat center/100% 100%;
    position: relative;
    z-index: 2;
    overflow: hidden;
  }

  .postionTop {
    position: absolute;
    left: 0;
    top: 0.45rem;
    width: 100%;
    height: 1.08rem;
    z-index: 10;
  }

  .LuckyTitle {
    width: 5.12rem;
    height: 1.08rem;
    line-height: .9rem;
    background: url("../../images/luckyTitle.png") no-repeat center/100% 100%;
    margin: 0 auto;
    text-align: center;
    font-size: .45rem;
    color: #fff5d7;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.59);
  }

  .back {
    width: 1.59rem;
    height: 1.17rem;
    background: url("../../images/close-luckyList.png") no-repeat center/100% 100%;
    position: absolute;
    right: .12rem;
    top: .42rem;
    z-index: 100;
  }

  .luckyPro {
    width: 9.27rem;
    margin: .6rem auto 0;
  }

  .BoxTop {
    text-align: center;
    margin-top: 0.06rem;
  }

  .BoxTop img {
    width: 1.96rem;
    height: 2.08rem;
    display: inline;
    vertical-align: middle;
  }

  .BoxTop p {
    display: inline;
    font-size: 0.6rem;
    color: #272420;
    vertical-align: middle;
  }

  .progressBox {
    width: 8.49rem;
    height: 0.39rem;
    margin: 0 auto;
    text-align: center;
    position: relative;
    border-radius: 0.2rem;
    overflow: hidden;
    background: #391e13;
  }

  .progressLen {
    height: 0.29rem;
    width: 90%;
    margin: .05rem 0.04rem;
    float: right;
    background: url("../../images/progress-con.png") no-repeat center/100% 100%;
  }

  .progressLay {
    width: 8.49rem;
    height: 0.39rem;
    background: url("../../images/progress-border.png") no-repeat center/100% 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .Boxtext {
    font-size: 0.42rem;
    color: #5e3a25;
    margin: 0.12rem auto 0;
    text-align: center;
  }

  .Boxtext span {
    color: #e5511d;
  }

  .Luckyleft {
    width: 2.22rem;
    height: 2.22rem;
    float: left;
    position: relative;
    text-align: center;
    margin-right: .36rem;
  }

  .Luckyleft img {
    width: 1.8rem;
    height: 1.8rem;
    display: block;
    margin: .16rem;
  }

  .imgMask {
    width: 2.22rem;
    height: 2.22rem;
    background: url("../../images/LuckyPro.png") no-repeat center/100% 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .snapUp {
    width: 1.39rem;
    height: .48rem;
    background: url("../../images/snapUp.png") no-repeat center/100% 100%;
    position: absolute;
    top: .09rem;
    right: -.09rem;
  }

  .Luckyright {
    float: left;
    font-size: .48rem;
    width: 6.69rem;
    height: 2.22rem;
    position: relative;
  }

  .LuckyproName {
    color: #272420;
    line-height: .54rem;

    position: absolute;
    top: .2rem;
    left: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 6.69rem;
  }

  .LuckyproPrice {
    color: #c24215;
    font-size: .6rem;
    position: absolute;
    bottom: .03rem;
    left: 0;
    height: .7rem;
    line-height: .7rem;
  }

  .luckyUser {
    width: 9.27rem;
    margin: .18rem auto 0;
  }

  .userleft, .userright {
    float: left;
    width: 50%;
  }

  .userleft {
    font-size: .32rem;
  }

  .userImg {
    width: .72rem;
    height: .72rem;
    /*background:#fff url("../../images/userbg.png") no-repeat center/100% 100%;*/
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    margin-right: .18rem;
    border: 1px solid #623318;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .3);
  }

  .userImg img {
    width: 100%;
    height: 100%;
    display: block;
    /*margin:.06rem 0.07rem;*/
    border-radius: 50%;
  }

  .userInfo {
    display: inline-block;
    vertical-align: middle;
  }

  .username {
    font-size: .36rem;
    color: #5e3a25;
  }

  .userphone {
    font-size: .39rem;
    color: #5e3a25;
  }

  .userright {
    font-size: .36rem;
    text-align: right;
    color: #5e3a25;
  }

  .userTiem {
    font-size: .39rem;
  }

  .garnish {
    width: 10.83rem;
    height: .5rem;
    margin: 0 auto;
    position: relative;
  }

  .garnishLeft {
    width: .36rem;
    height: .45rem;
    background: url("../../images/garnishLeft.png") no-repeat center/100% 100%;
  }

  .garnishCenter {
    width: 6.72rem;
    height: .84rem;
    background: url("../../images/garnishCenter.png") no-repeat center/100% 100%;
    position: absolute;
    top: -.3rem;
    left: 2.0rem;
    z-index: 1;
  }

  .garnishRight {
    width: 1.7rem;
    height: .83rem;
    background: url("../../images/garnishRight.png") no-repeat center/100% 100%;
    position: absolute;
    z-index: 10;
    top: -.4rem;
    right: -.79rem;
  }

  .topHeight {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    background: url("../../images/bgTop.png") no-repeat center/100% 100%;
  }

  .topHeight.iphonex {
    top: 33px;
  }

  .toplayout {
    height: 33px;
    width: 100%;
    background: #000;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
  }

  .wallTop {
    position: fixed;
    top: 5.7rem;
    left: 0.78rem;
    right: 0.78rem;
    height: 1.02rem;
    z-index: 4;
    background: url("../../images/wallTop.png") no-repeat center/100% 100%;
  }

  .wallTop.iphonex {
    margin-top: 33px;
  }

  .wallCenter {
    background: #633d2a;
    position: fixed;
    top: 5rem;
    left: 0.78rem;
    right: 0.78rem;
    bottom: 1.35rem;
    z-index: 0;
  }

  .wallBottom {
    position: fixed;
    left: 0.78rem;
    right: 0.78rem;
    bottom: 0;
    height: 1.36rem;
    z-index: 4;
    background: url("../../images/bgBottom.png") no-repeat center/100.5% 100%;
  }

  .ProBox {
    /*background:url("../../images/proWall.png") no-repeat center/100% 100%;*/
    position: relative;
    z-index: 1;
    padding: 6.83rem .78rem .6rem;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .PorTop {
    position: fixed;
    left: 0;
    top: 5.62rem;
    width: 100%;
    height: 1.08rem;
    z-index: 10;
  }

  .PorTop.iphonex {
    margin-top: 33px;
  }

  .ProTitle {
    width: 5.12rem;
    height: 1.08rem;
    line-height: .9rem;
    background: url("../../images/proTitle.png") no-repeat center/100% 100%;
    margin: 0 auto;
    text-align: center;
    font-size: .45rem;
    color: #fff5d7;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.59);
  }

  .HotPro {
    width: 9.93rem;
    height: 4.12rem;
    border: 1px solid #855e33;
    background: #492d21;
    margin: 0 auto;
  }

  .landscape {
    width: .97rem;
    height: 3.7rem;
    background: url("../../images/landscape.png") no-repeat center/100% 100%;
    margin: 0 .33rem 0 .48rem;
    font-size: .42rem;
    color: #c24215;
    text-align: center;
    float: left;
    vertical-align: top;
  }

  .landscape p {
    font-size: .42rem;
    color: #c24215;
    text-align: center;
    padding-top: .9rem;
    line-height: .5rem;
  }

  .HotProimg {
    width: 3.32rem;
    height: 3.32rem;
    background: url("../../images/proWallbor.png") no-repeat center/100% 100%;
    float: left;
    margin-right: .36rem;
    vertical-align: top;
  }

  .HotProimg img {
    width: 3.02rem;
    height: 3.02rem;
    margin: .16rem 0 0 .16rem;
  }

  .HotProInfoBox {
    padding-top: .43rem;
    float: left;
  }

  .HotProInfo {
    display: inline-block;
    font-size: .45rem;
    vertical-align: top;
    width: 4.2rem;
    height: 3.32rem;
    position: relative;
  }

  .HotProName {
    color: #fff;
    text-shadow: 0 3px 6px #000;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .HotProNum {
    font-size: .42rem;
    color: #ffcc50;
    text-shadow: 0 3px 6px #000;
    margin-top: .22rem;
  }

  .HotProprice {
    font-size: .48rem;
    color: #ffcc50;
    text-shadow: 0 3px 6px #000;
    margin-top: .22rem;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }

  .ScrollList {
    margin: 0 auto;
  }

  .ScrollList.iphonex {
    margin: 33px auto;
  }

  .ProList {
    margin: .39rem auto 0.6rem;
    width: 9.93rem;
    text-align: center;
    position: relative;
  }

  .ProList li {
    float: left;
    margin: 0 .11rem .11rem 0;
    width: 2.4rem;
    height: 2.4rem;
    background: url("../../images/proWallbor.png") no-repeat center/100% 100%;
    position: relative;

  }

  .ProList li:nth-child(4n) {
    margin-right: 0;
  }

  .ProListImg {
    width: 2.4rem;
    height: 2.4rem;
    overflow: hidden;
  }

  .ProListImg img {
    width: 2.18rem;
    height: 2.18rem;
    margin: .12rem 0 0 .12rem;
  }

  .layout {
    width: 2.2rem;
    height: 2.2rem;
    position: absolute;
    left: .1rem;
    top: .1rem;
    background: rgba(0, 0, 0, 0.6);
  }

  .broughtUp {
    width: 1.6rem;
    height: .5rem;
    background: url("../../images/broughtNum.png") no-repeat center/100% 100%;
    position: absolute;
    right: -.18rem;
    top: .18rem;
    font-size: 0.36rem;
    color: #fffffe;
  }

  .broughtNum {
    width: 2rem;
    height: .48rem;
    padding-right: 0.24rem;
    font-size: 0.36rem;
    line-height: .48rem;
    color: #fffffe;
    text-shadow: -1px -1px 3px #920d09, 1px 1px 3px #920d09;
    background: url("../../images/broughtNum.png") no-repeat center/100% 100%;
    position: absolute;
    right: -.18rem;
    top: .18rem;
    box-sizing: content-box;
  }

  .Proint {
    width: 4.4rem;
    height: 2rem;
    background: url("../../images/alertbg.png") no-repeat center/100% 100%;
    position: absolute;
    /*position: fixed;*/
    /*bottom:4rem;*/
    /*left:4rem;*/
    z-index: 10000;
    font-size: .36rem;
    overflow: hidden;
  }

  .top {
    top: -1.6rem;
  }

  .left {
    left: .2rem;
  }

  .bottom {
    top: 2.1rem;
  }

  .right {
    right: .2rem;
  }

  .ProintName {
    color: #fff;
    text-align: left;
    margin: .1rem .3rem;
    height: 1rem;
    line-height: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ProintNum {
    color: #ffcc50;
    float: left;
    margin-left: .3rem;
    text-align: left;
  }

  .ProintPrice {
    color: #ffcc50;
    float: right;
    margin-right: .3rem;
    text-align: right;
  }

  .into {
    position: fixed;
    left: 0;
    bottom: .6rem;
    z-index: 100;
    width: 100%;
    height: 1.96rem;
  }

  .into .intoBotton {
    width: 4.68rem;
    height: 1.96rem;
    margin: 0 auto;
    background: url("../../images/into.png") no-repeat center/100% 100%;
  }

  .bottomIng {
    width: 2.01rem;
    height: .99rem;
    background: url("../../images/garnishLefts.png") no-repeat center/100% 100%;
    position: fixed;
    bottom: 1%;
    left: 0;
    z-index: 2000;
  }
</style>
