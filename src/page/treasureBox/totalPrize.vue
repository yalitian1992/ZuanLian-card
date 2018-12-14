<template>
  <div>
    <div class="body">
      <div></div>
    </div>
    <div class="main" :class="{iphonex: isIphonex,ios:isIos}">
      <p class="toplayout" v-if="isIphonex && appOpen"></p>
      <div class="topHeight clearfix" :class="{iphonex: isIphonex&&appOpen}">
        <p class="redLine"></p>
        <div class="back" @click="setCookie('directIn', 'noDirectIn', 1);goBack();">
          <div class="backimg"></div>
        </div>
      </div>
      <div class="PorTop" :class="{iphonex: isIphonex&&appOpen}">
        <p class='ProTitle'>全部商品</p>
      </div>
      <div class="bgTop" :class="{iphonex: isIphonex&&appOpen}"></div>
      <div class="bgCenter" :class="{iphonex: isIphonex&&appOpen}"></div>
      <div class="bgBottom"></div>
      <div class="ProBox clearfix" :class="{iphonex: isIphonex&&appOpen}">
        <div class="ScrollList">
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
                <p class="HotProprice">￥{{mainProducts.price}}</p>
              </div>
            </div>
          </div>
          <ul class="ProList clearfix">
              <li v-for="(item,index) in proList" :class="'list'+index">
                <div @click="profile(item,index)">
                  <div class="ProListImg" :class="[1,4].indexOf(item.level)!=-1? 'level3':item.level==2?'level2':'level1' ">
                    <img :src="imgBaseUrl()+item.t114"  alt="" :onerror="defaultImg(0)">
                    <div class="broughtNum" v-if="item.prize_type ==1 &&item.lottery_num>0 && !(item.left_count<=0)">{{item.lottery_num}}人已领</div>
                  </div>
                  <!--领空-->
                  <div v-if="item.cbp_prize_type!=4 && item.left_count<=0">
                    <div class="layout"></div>
                    <div class="broughtUp">已领空</div>
                  </div>
                </div>
                <div class="Proint" :class="[postionBottom? 'bottom': 'top',postionRight?'right':'left' ]" v-if="profileShow && proindex==index">
                  <p class="ProintName">{{item.name}}</p>
                  <p>
                    <!--<span class="ProintNum" v-if="item.promotion_words">{{item.promotion_words}}</span>-->
                    <!--<span class="ProintPrice" v-if="[2,3,5].indexOf(item.prize_type) != -1">x{{item.num}}</span>-->
                    <span class="ProintPrice" v-if="[2,3,5].indexOf(item.prize_type) == -1">￥{{item.price}}</span>
                  </p>
                </div>
              </li>
              <!--<li class="statement">-->
                <!--据苹果公司免责条款特此声明：该活动与苹果公司无关-->
              <!--</li>-->
            </ul>
        </div>
      </div>
      <div class="Proint nones" style="position: fixed; left:-10000px; top:-7111px; z-index:0;"  >
        <p class="ProintName">商品名字</p>
        <p>
          <span class="ProintNum">8人必得</span>
          <span class="ProintPrice">￥1000</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  export default {
    data () {
      return {
        imgBaseUrl,
        mainProducts:{
          price:'0.0'
        },
        proList:{},
        profileShow:false,
        proindex:'',
        luckyUser:{
          prize_img:'',
          prize_name:'',
          prize_price:'',
          prize_time:'',
          user_name:'',
          user_phone:'123121212122',
        },
        luckyUsers:{},
        luckyNum:'0',
        isHttp: true,      //是否可以请求
        params: {page: 1}, //地址列表请求数据参数
        loadingShow: true, //loading
        isIphonex: false,      //是否是iPhonex
        isIos: false,
        Topheight:'0',
        ProHeight:'0',
        Topwidth:'0',
        PorTopHeight:'0',
        totalHeight:'',
        postionTop:false,
        postionBottom:false,
        postionLeft:false,
        postionRight:false,
        timeFunction:'',
        appOpen:false
      }
    },
    methods: {
      profile:function(item,index,){
        this.end()
        let e = event || window.event;
        let y = e.clientY;
        this.postionTop=false
        this.postionBottom=false
        this.postionLeft=false
        this.postionRight=false
        if(Number(y)- Number(this.totalHeight) >=Number(this.ProHeight)){
          this.postionTop =true;
        }else{
          this.postionBottom =true;
        }
        if (index % 4 == 3){
          this.postionRight =true;
        }else{
          this.postionLeft =true;
        }
        this.profileShow = true;
        this.proindex =index;
        this.start()
      },
      end:function(){
        var _this = this;
        clearTimeout(_this.timeFunction)
      },
      start:function(){
        var _this = this;
        _this.timeFunction = setTimeout(function () {
          _this.profileShow = false;
        }, 3000)
      }
    },
    mounted(){
      let _this = this;
      let agent = navigator.userAgent
      if(agent.indexOf("jfjingbao") !=-1 ){
        _this.appOpen = true
      }else{
        _this.appOpen = false
      }
      let id = _this.$route.query.boxId;
      this.asyncHttp('get', '/api/chest_boxs/prizes',{id:id},function(data){
        _this.mainProducts=data.execData.big_chest_prize;
        _this.proList = data.execData.chest_prizes;
      })

      this.clientType(function(){},function(){
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        }else{
          _this.isIos = true;
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })

      setTimeout(function () {
        _this.Topheight = document.getElementsByClassName('topHeight')[0].clientHeight;
        _this.PorTopHeight = document.getElementsByClassName('PorTop')[0].clientHeight;
        _this.ProHeight = document.getElementsByClassName('nones')[0].clientHeight;
        _this.totalHeight=Number(_this.Topheight)+Number(_this.PorTopHeight)+Number(_this.ProHeight)
      }, 1000)
    }
  }
</script>
<style scoped>
  .body{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    background: url("../../images/box-bg1.jpg") no-repeat center/100% 100%;
  }
  .main.iphonex{
    height: 100%;
    min-height:812px;
  }
  .main.ios{
    height: 100%;
  }
  .redLine{
    width: 100%;
    height: 1.35rem;
    /*background: url("../../images/LineRed.png") no-repeat center/100% 100%;*/
    /*position: relative;*/
    /*z-index:1;*/
  }

  .back{
    position: absolute;
    left:0rem;
    top:0rem;
    z-index:1000;
    padding:0.3rem .2rem 0 0.45rem;
    width:1.3rem;
    height:1.2rem;
    box-sizing: content-box;
    cursor:pointer;
  }
  .backimg{
    width:0.9rem;
    height:0.9rem;
    background: url("../../images/go-back.png") no-repeat center/100% 100%;
  }
  .Luckyleft img{
    width:1.8rem;
    height:1.8rem;
    display: block;
    margin:.16rem;
  }

  .userImg img{
    width:100%;
    height:100%;
    display: block;
    /*margin:.06rem 0.07rem;*/
    border-radius: 50%;
  }

  .topHeight{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    background:url("../../images/bg-top.jpg") no-repeat center/100% 100%;
    z-index:10;
  }
  .topHeight.iphonex{
    top:33px;
  }
  .toplayout{
    height:33px;
    width:100%;
    background: #000;
    position: fixed;
    z-index:1000;
    left:0;
    top:0;
  }
  .ProBox{
    padding:2.3rem .78rem 1.95rem;
    position: relative;
    z-index:1;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    height:100%;
  }
  .ProBox.iphonex{
    margin-top:33px;
  }


  .PorTop{
    position: fixed;
    left:0;
    right:0;
    margin:0 auto;
    top:1.05rem;
    width:5.12rem;
    height:1.08rem;
    z-index:10;
  }
  .PorTop.iphonex{
    margin-top:33px;
  }
  .bgTop{
    position: fixed;
    left:.78rem;
    right:.78rem;
    top:1.28rem;
    height: 1.02rem;
    background:url("../../images/bg-top-wall.png") no-repeat center/100% 100%;
    z-index:2;
  }
  .bgTop.iphonex{
    margin-top:33px;
  }
  .bgCenter{
    position: fixed;
    left:.78rem;
    right:.78rem;
    top:-2rem;
    bottom:1.95rem;
    background: #633d2a;
    z-index:0;
  }
  .bgCenter.iphonex{
    margin-top:33px;
  }
  .bgBottom{
    position: fixed;
    left:0.78rem;
    right:0.78rem;
    bottom: 0;
    height: 1.95rem;
    background:url("../../images/bg-bottom-wall.png") no-repeat center/100.5% 100%;
    z-index:9;
  }
  .ProTitle{
    width:5.12rem;
    height:1.08rem;
    line-height: .9rem;
    background: url("../../images/proTitle.png") no-repeat center/100% 100%;
    margin: 0 auto;
    text-align: center;
    font-size:.45rem;
    color:#fff5d7;
    text-shadow:0px 0px 4px rgba(0,0,0,0.59);
  }
  .HotPro{
    height:4.12rem;
    border:1px solid #855e33;
    background: #492d21;
    margin:0 auto;
  }
  .landscape{
    width:.97rem;
    height:3.7rem;
    background:url("../../images/landscape.png") no-repeat center/100% 100%;
    margin:0 .33rem 0 .48rem;
    font-size:.42rem;
    color:#c24215;
    text-align: center;
    float: left;
    vertical-align: top;
  }
  .landscape p{
    font-size:.42rem;
    color:#c24215;
    text-align: center;
    padding-top:.9rem;
    line-height: .5rem;
  }
  .HotProimg{
    width:3.32rem;
    height:3.32rem;
    background:url("../../images/proWallbor.png") no-repeat center/100% 100%;
    float: left;
    margin-right:.36rem;
    vertical-align: top;
  }
  .HotProimg img{
    width:3.02rem;
    height:3.02rem;
    margin:.16rem 0 0 .16rem;
  }
  .HotProInfoBox{
    padding-top:.43rem;
    float: left;
  }
  .HotProInfo{
    display: inline-block;
    font-size:.45rem;
    vertical-align: top;
    width:4.2rem;
    height: 2.6rem;
    position: relative;
    padding:0.26rem 0 0.24rem;
    box-sizing: content-box;
  }
  .HotProName{
    color:#fff;
    text-shadow: 0 3px 6px #000;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    line-height: .6rem;
  }
  .HotProprice{
    font-size:.48rem;
    line-height: .6rem;
    color:#ffcc50;
    text-shadow: 0 3px 6px #000;
    margin-top:.22rem;
    position: absolute;
    bottom:0px;
    left:0px;
  }
  .ScrollList{
    padding:0 .45rem 0;
    margin:0 auto;
    height:100%;
  }
  .ProList{
    margin:.39rem auto 0;
    text-align: center;
    position: relative;
  }
  .ProList li{
    float: left;
    margin:0 .11rem .11rem 0;
    width:2.4rem;
    height:2.4rem;
    position: relative;
  }
  .level1{
    background:url("../../images/proWallborlevel1.png") no-repeat center/100% 100%;
  }
  .level2{
    background:url("../../images/proWallborlevel2.png") no-repeat center/100% 100%;
  }
  .level3{
    background:url("../../images/proWallbor.png") no-repeat center/100% 100%;
  }
  .ProList li.statement {
    width: 100%;
    height: 1.4rem;
    line-height: .64rem;
    color: #eee;
    font-size: .48rem;
    padding-top: .3rem;
    clear: both;
    float: left;
    background: none;
    text-align: left;
  }
  .ProList li:nth-child(4n){
    margin-right:0;
  }
  .ProListImg{
    width:2.4rem;
    height:2.4rem;
    overflow: hidden;
  }
  .ProListImg img{
    width:2.18rem;
    height:2.18rem;
    margin:.12rem 0 0 .12rem;
  }
  .layout{
    width:2.2rem;
    height:2.2rem;
    position: absolute;
    left:.1rem;
    top:.1rem;
    background: rgba(0,0,0,0.6);
  }
  .broughtUp{
    width:1.6rem;
    height:.5rem;
    background:url("../../images/broughtNum.png") no-repeat center/100% 100%;
    position: absolute;
    right:-.18rem;
    top:.18rem;
    font-size:0.36rem;
    color:#fffffe;
  }
  .broughtNum{
    width:2rem;
    height:.48rem;
    padding-right:0.24rem;
    font-size:0.36rem;
    line-height: .48rem;
    color:#fffffe;
    text-shadow: -1px -1px 3px #920d09,1px 1px 3px #920d09;
    background:url("../../images/broughtNum.png") no-repeat center/100% 100%;
    position: absolute;
    right:-.18rem;
    top:.18rem;
    box-sizing: content-box;
  }
  .Proint{
    width:4.4rem;
    height:2rem;
    background:url("../../images/alertbg.png") no-repeat center/100% 100%;
    position: absolute;
    /*position: fixed;*/
    /*bottom:4rem;*/
    /*left:4rem;*/
    z-index:10000;
    font-size:.36rem;
    overflow: hidden;
  }
  .top{
    top:-1.6rem;
  }
  .left{
    left:.2rem;
  }
  .bottom{
    top:2.1rem;
  }
  .right{
    right:.2rem;
  }
  .ProintName{
    color:#fff;
    text-align: left;
    margin:.1rem .3rem;
    height:1rem;
    line-height: .5rem;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
  .ProintNum{
    color:#ffcc50;
    float: left;
    margin-left:.3rem;
    text-align: left;
  }
  .ProintPrice{
    color:#ffcc50;
    margin-right:.3rem;
    /*float: right;*/
    /*text-align: right;
    margin-right:.3rem;*/
    float: left;
    text-align: center;
    margin-left:.3rem;
  }
  .into{
    position:fixed;
    left:0;
    bottom: 2%;
    z-index:100;
    width:100%;
    height:1.96rem;
  }
  .into .intoBotton{
    width:4.68rem;
    height:1.96rem;
    margin:0 auto;
    background:url("../../images/into.png") no-repeat center/100% 100%;
  }
  .bottomIng{
    width:2.01rem;
    height:.99rem;
    background:url("../../images/garnishLefts.png") no-repeat center/100% 100%;
    position: fixed;
    bottom:1%;
    left:0;
    z-index:2000;
  }
</style>
