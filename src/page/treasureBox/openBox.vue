<template>
  <div :class="{'active': isShake, iphonex: isIphonex, 'inputCursor':exchangeShow}" class="shake" id="shake">
    <!--背景图-->
    <div class="bg"></div>
    <!--返回按钮-->
    <div class="back-btn" v-if="backBtnShow" @click="goBack()"></div>
    <!--头部-->
    <div class="top-bar clearfix" :class="{iphonex: isIphonex}">
      <div class="notice pull-left" v-if="noticeShow">
        <ul class="notice-list">
          <li class="notice-item" v-for="item in notice" @touchstart.prevent="" @touchmove.prevent="">{{item.content}}
          </li>
          <li class="notice-item" v-for="item in notice" @touchstart.prevent="" @touchmove.prevent="">{{item.content}}
          </li>
        </ul>
      </div>
      <div class="btn rule-btn pull-right" @click="openRule">
        <div class="img"></div>
        <div class="txt">规则</div>
      </div>
      <div class="btn exchange-btn pull-right" @click="exchangeShow = true; setSlide(0)">
        <div class="img"></div>
        <div class="txt">兑换</div>
      </div>
    </div>
    <!--奖品列表-->
    <div class="box-type" :class="{iphonex: isIphonex}">
      <div class="background align-c">
        <div class="type-top">
          <div>{{typeName}}宝箱奖品</div>
          <div class="issue">本期期号：<span>{{issue}}</span></div>
        </div>
        <div class="progress-bar">
          <div class="border clearfix">
            <div class="pull-right" :style="{width: leftCount*100/hands + '%'}"></div>
          </div>
          <div class="text">剩余<span>{{leftCount}}</span>次，超值奖品等你来开！</div>
        </div>
        <div class="bg-middle">
          <swiper class="type-list" :options="swiperOption" ref="mySwiper">
            <swiper-slide class="award-list" v-for="(item, index) in typeList" :key="index">
              <template v-if="item.big_chest_prize">
                <div class="big-award">
                  <div class="pic">
                    <img :src="imgBaseUrl() + item.big_chest_prize.t267" alt="">
                    <div class="pic-mask" v-if="item.big_chest_prize.left_count <= 0">
                      <img src="../../images/receive-empty.png" alt="">
                    </div>
                  </div>
                  <div class="name align-c text-overflow-multi">{{item.big_chest_prize.name}}</div>
                </div>
                <ul class="small-award clearfix">
                  <li class="pull-left"
                      :class="{entity: item1.level == 1 || item1.level == 4, rare: item1.level == 2, ordinary: item1.level == 3}"
                      v-for="item1 in item.chest_prizes.slice(0,6)">
                    <div class="img-border ">
                      <img :src="imgBaseUrl() + item1.t114" alt="">
                      <div class="pic-mask" v-if="item1.left_count <= 0">
                        <img src="../../images/receive-empty.png" alt="">
                      </div>
                    </div>
                    <div class="name text-overflow">{{item1.name}}</div>
                  </li>
                </ul>
              </template>
              <div class="no-box" v-else>当前暂无宝箱，敬请期待</div>
            </swiper-slide>
          </swiper>
          <div class="see-more" v-show="moreBtnShow" @click="goAllAward">查<br/>看<br/>更<br/>多</div>
        </div>
      </div>
    </div>
    <!--宝箱-->
    <div class="box" :class="{'special':isOpen}">
      <div class="ston-bg"></div>
      <div class="keyamount align-c">我的宝箱符：<span></span>{{treasureTotalAmount}}
        <div @click="goYZ"></div>
      </div>
      <!--<div class="keyamount align-c" v-if="!isBronzeBox">我的宝箱符：<span></span>{{treasureTotalAmount}}
        <div @click="goYZ"></div>
      </div>
      <div class="keyamount align-c" v-else>我的开启机会：{{freeTreasureAmount}}
        <div @click="invitation"></div>
      </div>-->
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
        <div>开启</div>
        <!--<div class="num" v-show="isBronzeBox">{{freeTreasureAmount}}次机会</div>-->
        <!--<box-bubble-notice :boxId="boxId" :boxType="boxType"></box-bubble-notice>-->
      </div>
      <div class="box-tips">
        <div><span></span>1 开启1次</div>
      </div>
      <!--<ul class="treasure-box-small align-c">
        <li :class="{active: item.isActive}" v-for="(item, index) in typeList" @click="toggleBox(index)">
          <div class="img-border">
            <img :src="item.sBoxImg" alt="">
          </div>
          <div class="num">
            <div v-if="item.type==2"><span></span>×{{item.chest_box.treasure_amount}}</div>
            <div v-if="item.type==3 && freeTreasureAmount > 0">可开启{{freeTreasureAmount}}次</div>
            <div v-if="item.type==3 && freeTreasureAmount <= 0">邀请好友开启</div>
          </div>
        </li>
      </ul>-->
    </div>
    <!--底部按钮-->
    <div class="footer-bar align-c" :class="{iphonex: isIphonex}">
      <router-link :to="{path: '/winningRecord', query: {native: 0}}" tag="div" class="my-award">
        <div class="icon"></div>
        <div class="txt">我的奖品<span v-show="noReceive"></span></div>
      </router-link>
      <!--<div class="lucky-list-btn" @click="goLuckyList">
        <div class="icon"></div>
        <div class="txt">宝箱动态</div>
      </div>-->
      <router-link :to="{path: '/prizeList', query: {native: 0}}" tag="div" class="purse-btn">
        <div class="icon"></div>
        <div class="txt">钱包</div>
      </router-link>
      <router-link :to="{path: '/exchange', query: {native: 0}}" tag="div" class="prop-exchange-btn">
        <div class="icon"></div>
        <div class="txt">道具回收</div>
      </router-link>
      <!--<div class="get-box-btn" @click="getBoxShow = true; setSlide(0)">
        <div class="icon"></div>
        <div class="txt">获取开启机会</div>
      </div>-->
    </div>
    <!--规则说明弹窗-->
    <div class="rule-mask" v-show="ruleShow">
      <div class="rule">
        <div class="rule-title"></div>
        <div class="rule-close pull-right" @click="closeRule"></div>
        <div class="rule-con">
          <h4>Q：怎么才能开宝箱？</h4>
          <p>A：使用【宝箱符】可以开启白银宝箱。</p>

          <h4>Q：怎么才能得到【宝箱符】？</h4>
          <p>A：1）您在优众网购买商品或者服务即可获赠宝箱符；</p>
          <p>2）在开启宝箱时随机获得。</p>

          <h4>Q：我在宝箱中开到奖品啦，怎么领奖？</h4>
          <p>A：获奖后，您需在集分竞宝APP的宝箱页面中，进入“我的奖品”进行领奖操作。<br/>各类奖品领取办法：</p>
          <p>
            ●	实物奖品：填写收货地址并支付运费即可领取，客服核实后会将奖品发出；<br/>
            ●	话费充值卡：经客服核实后，话费将自动充值到您“集分竞宝”注册手机号中；<br/>
            ●	电子购物卡：客服向您核实收取卡密的手机号，核实后以短信通知形式发放；<br/>
            ●	优众网红包：直接发放至与集分竞宝注册手机号对应的优众账户中；<br/>
            ●	入场券、兑奖券及宝箱符：无需手动领取，自动添加到您的“集分竞宝”账户中。<br/>
          </p>

          <h4>Q：我不想要获得的奖品怎么办？</h4>
          <p>A：除“入场券”、“兑奖券”、“宝箱符”、“优众网红包”以外，其他奖品可通过“献祭”转化为一定数额的“兑奖券”（具体可以献祭的奖品以APP中显示的为准）。</p>

          <h4>Q：领奖需要付费吗？</h4>
          <p>A：奖品均为赠送，您不需为奖品本身支付费用。但实物奖品的快递费需由您承担。</p>

          <h4>Q：为什么有时会落下一大堆红包？</h4>
          <p>A：恭喜您遇到了“红包雨”，当有用户在白银宝箱中开到全场大奖或指定商品时，就会落下“红包雨”。在落下“红包雨”期间，您点击屏幕便可获得现金红包。</p>
        </div>
      </div>
    </div>
    <!--兑换宝箱符弹框-->
    <div class="exchange-mask" v-show="exchangeShow">
      <div class="exchange align-c">
        <div class="exchange-title">输入兑换码</div>
        <div class="exchange-close" @click="exchangeShow = false; setSlide()"></div>
        <div class="input">
          <input type="text" v-model="exchangeCode">
        </div>
        <div class="text">关注公众号，领取兑换码</div>
        <div class="sure-btn align-c" @click="exchangeBox">确定</div>
      </div>
    </div>
    <!--获取开启机会弹框-->
    <div class="get-box-mask" v-show="getBoxShow">
      <div class="get-box">
        <div class="get-box-title align-c">获取开启机会</div>
        <div class="get-box-close pull-right" @click="getBoxShow = false; setSlide()"></div>
        <div class="get-box-con">
          <div @click="invitation">黄金宝箱：每成功邀请1位好友赠1次<span class="pull-right"></span></div>
          <div @click="goYZ">白银宝箱：获取【宝箱符】无限抽<span class="pull-right"></span></div>
          <div @click="qrCodeShow = true; setSlide(0)">白银宝箱：关注公众号赠1个宝箱符<span class="pull-right"></span></div>
        </div>
      </div>
    </div>
    <!--获取虚拟物品弹框-->
    <!--<div class="get-invented-mask" v-if="getInventedShow">
      <div class="get-invented align-c">
        <div class="get-invented-close pull-right" @click="getInventedShow = false"></div>
        <div class="get-invented-title" :class="{another :awardDataList[0].prize_type == 5}"></div>
        <div class="get-invented-tips">{{awardDataList[0].win_copy}}</div>
        <div class="get-invented-info">
          <img :src="imgBaseUrl() + awardDataList[0].t114" class="pic"/>
          <div class="name">{{awardDataList[0].name}}</div>
        </div>
        <div class="get-invented-btn" v-if="awardDataList[0].prize_type == 2" @click="closeView">抢兑奖品</div>
        <div class="get-invented-btn" v-if="awardDataList[0].prize_type == 3" @click="goMall">兑奖阁</div>
        <div class="get-invented-btn" v-if="awardDataList[0].prize_type == 5" @click="getInventedShow = false">确认</div>
      </div>
    </div>-->
    <!--左边气泡通知-->
    <bubble-notice></bubble-notice>
    <!--签到弹框-->
    <!--<div class="sign-mask" v-if="signShow">
      <div class="sign align-c">
        <div class="light"></div>
        <div class="main">
          <div class="title">恭喜获得</div>
          <div class="open-num">开启次数+{{signGetNum}}</div>
          <ul class="sign-days">
            <li v-for="(item, index) in signList" :class="{'al-sign': item.isSign, 'cur-day': item.isCurDay}">
              <div class="tips" v-show="item.isMain">开启次数+{{item.amount}}</div>
              <div class="line" v-show="index > 0"><span></span></div>
              <div class="circle"></div>
              <div class="txt"><span v-show="item.isCurDay">连续</span>{{index + 1}}天</div>
            </li>
          </ul>
          <div class="button" @click="signReceive">领取</div>
        </div>
      </div>
    </div>-->
    <!--全部领取后的弹框-->
    <div class="after-receive-mask" v-show="afterReceiveShow">
      <div class="after-receive align-c">
        <div class="close-btn pull-right" @click="afterReceiveShow = false; setSlide()"></div>
        <div class="tips-txt text-overflow-multi">{{receiveEndInfo.msg}}</div>
        <div class="btn" @click="goTo">前往</div>
      </div>
    </div>
    <div class="bgshow" v-if="bgshow" @click='bgshow=false'>
      <div class="bgtext"></div>
    </div>
    <!-- 全屏透明遮罩 -->
    <div class="screenMask" v-if="screenMaskShow" @click.stop=""></div>
    <!--关注二维码0-->
    <div class="qr-code-mask" v-show="qrCodeShow" @click.self="qrCodeShow = false; setSlide()">
      <div>
        <div class="logo"></div>
        <div class="qr-code">
          <img src="../../images/qr-code.png" alt="">
        </div>
        <div class="name align-c">微信号：jfjb888</div>
      </div>
    </div>
    <!--黄金宝箱开启条件弹框-->
    <div class="get-box-mask" v-show="howOpenShow">
      <div class="get-box">
        <div class="get-box-title align-c">开启条件</div>
        <div class="get-box-close pull-right" @click="howOpenShow = false; setSlide()"></div>
        <div class="how-open align-c">
          <div class="tips">拥有开启机会<br/>才可开启<span>黄金宝箱</span></div>
          <div class="line"></div>
          <div class="way">获取方式：<br/><span>每成功邀请1名好友注册，获赠1次开启机会</span></div>
          <div class="btn" @click="invitation">邀请好友</div>
        </div>
      </div>
    </div>
    <!--邀请页面入口-->
    <div class="invite-entry">
      <router-link class="package" :to="{path: '/inviteFriends', query: {native: 0}}" tag="div"></router-link>
      <div class="txt" v-show="inviteTipShow">瓜分500万现金红包，立即去领！</div>
    </div>
  </div>
</template>

<script>
  import {imgBaseUrl, yZBaseUrl, mediaUrl} from '../../config/config'
  import bubbleNotice from '../../components/bubbleNotice/bubbleNotice.vue'
  import boxBubbleNotice from '../../components/boxBubbleNotice/boxBubbleNotice.vue'
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import wx from 'weixin-js-sdk'
  export default {
    data () {
      return {
        imgBaseUrl,
        yZBaseUrl,
        mediaUrl,
        noticeShow: false,   //头部通知是否显示
        notice: [],          //头部获奖通知
        backBtnShow: false,  //返回按钮是否显示
        typeList: [],        //各种宝箱奖品列表
        swiperOption: {},    //swiper配置
        typeName: '',        //宝箱类型名字
        issue: '',           //期号
        leftCount: 0,        //剩余手数
        hands: 0,            //总手数
        bBoxTopImg: require('../../images/nomalImg.gif'),      //大宝箱顶部图片
        bBoxBottomImg: require('../../images/nomalImg.gif'),   //大宝箱底部图片
        treasureTotalAmount: 0,//用户拥有宝箱符数量
        freeTreasureAmount: 0, //用户拥有免费次数
        moreBtnShow: true,   //查看更多按钮是否显示
        curIndex: 0,         //当前滑块下标
        noReceive: false,    //是否有未领取宝箱
        isBronzeBox: false,  //是否是青铜或黄金宝箱
        signShow: false,     //签到弹框是否显示
        signList: [],        //签到弹框列表
        afterReceiveShow: false,//领取完成后的弹框是否显示
        signGetNum: 0,       //签到获得次数
        boxId: 0,            //宝箱ID
        boxType: '',         //宝箱类型
        ruleShow: false,     //规则说明是否显示
        exchangeShow: false, //兑换宝箱符弹框是否显示
        exchangeCode: '',    //兑换宝箱符兑换码
        getBoxShow: false,   //获取宝箱符弹框是否显示
        getInventedShow: false,//得到虚拟物品弹框是否显示
        receiveEndInfo: {},  //领取完成后的信息
        goToBoxIndex: '',     //前往宝箱类型
        isShake: false,      //是否抖动
        screenMaskShow: false,    //全屏遮罩是否显示
        awardDataList: [],   //奖品列表数据
        awardRecord: {    //奖品纪录数据
          id: ''
        },
        isCanOpen: true,     //开启按钮是否能点
        isOpen: false,    //宝箱是否动画执行
        isCardListShow: false,//翻牌列表显示
        CardListBox: false,  //翻牌模块显示
        isCardListHide: false,//翻牌列表隐藏
        hasVoucher: false,   //宝箱券提示
        noVoucher: false,    //宝箱券提示
        cardIdx: '',
        isIos: false,        //是否是iphone
        isIphonex: false,    //是否是iPhoneX
        isApp: false,        //是否是APP内部打开页面
        token: '',           //accessToken
        ihaveuToken: '',     //ihaveuToken
        wxShareName: '',
        wxShareTitle: '',
        wxShareImg: '',
        code: '',
        wxUrl: "",
        bgshow: false,
        qrCodeShow: false,   //二维码是否显示
        isHttpOk: false,     // 接口是否正常（包括500/404）
        sureBtn: true,       //领取奖品的确定按钮是否显示
        howOpenShow: false,  //黄金宝箱开启条件弹框是否显示
        inviteTipShow: true  //邀请提示是否显示
      }
    },
    created () {
      this.token = this.getCookie('intoToken');
      this.wxpz()
      this.wxShare()
    },
    methods: {
      //切换宝箱
      toggleBox: function (index) {
        this.curIndex = index;
        this.swiper.slideTo(index, 1000);
        this.imgNameChange(this.typeList[index].type);
        for (let i = 0, len = this.typeList.length; i < len; i++) {
          let item = this.typeList[i];
          if (item.isActive) {
            item.isActive = false;
          }
        }
        this.typeList[index].isActive = true;
        this.boxId = this.typeList[index].chest_box.id;
        this.boxType = this.typeList[index].type;
        this.issue = this.typeList[index].chest_box.period;
        this.leftCount = this.typeList[index].left_count;
        this.hands = this.typeList[index].chest_box.hands;
      },
      /*切换宝箱图片和名字变化*/
      imgNameChange: function (i) {
        /*switch (i) {
          case '1':
            this.bBoxTopImg = require('../../images/bronze-top.png');
            this.bBoxBottomImg = require('../../images/bronze-bottom.png');
            this.typeName = '青铜';
            this.isBronzeBox = true;
            break;
          case '2':
            this.bBoxTopImg = require('../../images/silver-top.png');
            this.bBoxBottomImg = require('../../images/silver-bottom.png');
            this.typeName = '白银';
            this.isBronzeBox = false;
            break;
          case '3':
            this.bBoxTopImg = require('../../images/gold-top.png');
            this.bBoxBottomImg = require('../../images/gold-bottom.png');
            this.typeName = '黄金';
            this.isBronzeBox = true;
            break;
          case '4':
            this.bBoxTopImg = require('../../images/platinum-top.png');
            this.bBoxBottomImg = require('../../images/platinum-bottom.png');
            this.typeName = '铂金';
            this.isBronzeBox = false;
            break;
        }*/
        this.bBoxTopImg = require('../../images/gold-top.png');
        this.bBoxBottomImg = require('../../images/gold-bottom.png');
        this.typeName = '';
        this.isBronzeBox = true;
      },
      //跳到查看更多
      goAllAward: function () {
        this.$router.push({path: 'totalPrize', query: {boxId: this.boxId, native: 0}})
      },
      //抽奖成功更新免费次数和宝箱符数量
      updateData: function () {
        this.$http({
          method: 'get',
          url: '/api/chest_boxs/index',
          headers: {accessToken: this.token}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            this.treasureTotalAmount = data.execData.treasure_total_amount;
            this.freeTreasureAmount = data.execData.free_treasure_amount;
            let list = data.execData.current_boxs, boxList = [];
            for (let i in list) {
              boxList.push(list[i]);
            }
//            this.typeList[this.curIndex].left_count = boxList[this.curIndex].left_count;
//            this.leftCount = boxList[this.curIndex].left_count;
            this.typeList[this.curIndex].big_chest_prize.left_count = boxList[this.curIndex].big_chest_prize.left_count;
            for (let j = 0; j < 6; j++) {
              this.typeList[this.curIndex].chest_prizes[j].left_count = boxList[this.curIndex].chest_prizes[j].left_count;
            }
          }
        })
      },
      // 是否有未领取奖品
      isHaveNoReseive: function () {
        var _this = this
        this.$http({
          method: 'get',
          url: '/api/chest_records/awards',
          headers: {accessToken: this.token},
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            if (data.execData.unclaimed_count > 0) {
              _this.noReceive = true;
            } else {
              _this.noReceive = false;
            }
          }
        })
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
            method: 'post',
            url: '/api/chest_boxs/draw',
            params: {id: this.boxId},
            headers: {accessToken: this.token}
          }).then(function (res) {
            _this.isHttpOk = true;
            if (res.body.execErrCode == 200) {
              _this.updateData();
              _this.typeList[_this.curIndex].left_count--;
              _this.leftCount--;
              _this.isOpen = true;
              _this.receiveEndInfo = res.body.execData.draw_message;
              _this.awardRecord = res.body.execData.chest_record;
              this.$http({
                method: 'post',
                url: '/card-service-web/h5/chestRecords/getChestPrizes',
                params: {id: _this.awardRecord.id},
                headers: {accessToken: _this.token}
              }).then(function (res) {
                if (res.body.execErrCode != 200) {
                  _this.toast(res.body.execMsg)
                }
              })
              _this.addAudio(_this.mediaUrl + "/media/openbox.mp3");
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
            } else if (res.body.execErrCode == 4003) {
              _this.screenMaskShow = false;
              _this.goLogin();
              _this.isCanOpen = true;
            } else if (res.body.execErrCode == 5001) {
              _this.screenMaskShow = false;
              _this.isCanOpen = true;
              if (_this.typeList[_this.curIndex].type == '3') {
                if (_this.freeTreasureAmount <= 0) {
                  _this.howOpenShow = true;
                }
              } else {
                if (_this.treasureTotalAmount < _this.typeList[_this.curIndex].chest_box.treasure_amount) {
                  _this.goYZ();
                }
              }
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
        this.isOpen = false;
        var _this = this;
        this.isCanOpen = true;
        var audioNow = document.getElementsByTagName("audio")[0];
        if (audioNow) {
          audioNow.src = this.mediaUrl + '/media/Receive-all.mp3';
          audioNow.play();
        }
        this.CardListBox = false;
        this.isCardListHide = true;
        this.isCardListShow = false;
        this.afterReceiveShow = !this.receiveEndInfo.is_draw;
        if (this.afterReceiveShow) {
          this.setSlide(0);
          if (this.receiveEndInfo.msg_type == 4) {
            this.receiveEndInfo.msg = '宝箱符数量不足，获取优众优惠券可得海量宝箱符！大奖正等着您！赶快前往获取！';
            this.goToBoxIndex = 999;
          } else {
            for (let i = 0, len = this.typeList.length; i < len; i++) {
              if (this.typeList[i].chest_box.id == this.receiveEndInfo.chest_box_id) {
                this.goToBoxIndex = i;
                break;
              }
            }
          }
        }
        this.isHaveNoReseive()  //是否有未领取奖品
      },
      /*领取完成后前往*/
      goTo: function () {
        if (this.goToBoxIndex == 999) {
          this.goYZ();
        } else {
          this.handleSwiper(this.goToBoxIndex);
          this.afterReceiveShow = false;
          this.setSlide();
        }
      },
      /*连续签到领取*/
      signReceive: function () {
        this.signShow = false;
        this.addAudio(mediaUrl + '/media/sign.mp3');
        this.updateData();
        this.setSlide();
      },
      /*滑动滑块相关操作*/
      handleSwiper: function (i) {
        for (let j = 0, len = this.typeList.length; j < len; j++) {
          this.typeList[j].isActive = false;
        }
        this.typeList[i].isActive = true;
        this.imgNameChange(this.typeList[i].type);
        this.boxId = this.typeList[i].chest_box.id;
        this.boxType = this.typeList[i].type;
        this.issue = this.typeList[i].chest_box.period;
        this.leftCount = this.typeList[i].left_count;
        this.hands = this.typeList[i].chest_box.hands;
        this.swiper.slideTo(i);
      },
      /*去抢兑奖品*/
      closeView: function () {
        if (this.isApp) {
          this.clientType(function () {
            window.Android.goToFightList();
          }, function () {
            window.webkit.messageHandlers.AppModel.postMessage('openGameList');
          })
        } else {
          let url = window.location.href;
          window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
        }
      },
      /*去兑奖阁*/
      goMall: function () {
        if (this.isApp) {
          let url = window.location.href;
          window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/mallIndex?native=0';
        } else {
          let url = window.location.href;
          window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
        }
      },
      /*兑换码兑换*/
      exchangeBox: function () {
        this.$http({
          method: 'post',
          url: '/api/box_lucky_walls/exchange_prize_code',
          params: {code: this.exchangeCode},
          headers: {accessToken: this.token}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            this.updateData();
            this.toast('兑换成功');
            this.addAudio(this.mediaUrl + '/media/sign.mp3');
            this.exchangeShow = false;
            this.setSlide();
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
            this.bgshow = true

          } else {
            let url = window.location.href;
            window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
          }
        }
      },
      /*跳到优众*/
      goYZ: function () {
        if (this.isApp) {
          this.$http({
            method: 'post',
            url: '/card-service-web/user/queryUserByAccessToken',
            headers: {accessToken: this.token}
          }).then(function (res) {
            var data = res.body;
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.execErrCode == 200) {
              if (data.execData.user.mobile.slice(0, 5) == '10000') {
                this.clientType(function () {
                  window.Android.integralBindingPhone();
                }, function () {
                  window.webkit.messageHandlers.AppModel.postMessage('integralBindingPhone');
                })
              } else {
                this.clientType(function () {
                  window.Android.turnToPay();
                }, function () {
                  window.webkit.messageHandlers.AppModel.postMessage('recharge');
                })
              }
            }
          })
        } else {
          if (this.ihaveuToken) {
            window.location.href = yZBaseUrl + '/auction/voucher_trades/new?AUTHTOKEN=' + this.ihaveuToken;
          } else {
            let _this = this;
            this.toast("登录失效，请重新登录！")
            setTimeout(function () {
              _this.goLogin();
            }, 2000)
          }
        }
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
      /*跳转到幸运名单*/
      goLuckyList: function () {
        this.$router.replace({path: '/luckyList', query: {fromOpenBox: 1}});
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
      bubbleNotice,
      boxBubbleNotice,
      swiper,
      swiperSlide
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
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
      let _this = this;
      if (navigator.userAgent.indexOf("jfjingbao") > -1) {
        this.isApp = true;
        this.backBtnShow = true;
      }
      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }
      if (_this.$route.query.ihaveuToken) {
        _this.setCookie('ihaveuToken', _this.$route.query.ihaveuToken, 3)
      }
      if (_this.$route.query.ad_from) {
        _this.setCookie('ad_from', _this.$route.query.ad_from, 3)
      }
      if (_this.$route.query.inviIden) {
        _this.setCookie('inviIden', _this.$route.query.inviIden, 3)
      }
      this.token = this.getCookie('intoToken');
      this.ihaveuToken = this.getCookie('ihaveuToken');

      this.swiper.on('slideChangeTransitionEnd', function () {
        _this.toggleBox(this.activeIndex);
        if (_this.typeList[this.activeIndex].big_chest_prize) {
          _this.moreBtnShow = true;
        } else {
          _this.moreBtnShow = false;
        }
      })

      this.$http({
        method: 'get',
        url: '/api/chest_boxs/index',
        headers: {accessToken: this.token}
      }).then(function (res) {
        let data = res.body;
        if (data.execErrCode == 200) {
          let list = data.execData.current_boxs, boxList = [];
          for (let i in list) {
            list[i].type = i;
            list[i].isActive = false;
            switch (i) {
              case '1':
                list[i].sBoxImg = require('../../images/bronze-s.png');
                list[i].chest_box.treasure_amount = 0;
                break;
              case '2':
                list[i].sBoxImg = require('../../images/silver-s.png');
                break;
              case '3':
                list[i].sBoxImg = require('../../images/gold-s.png');
                list[i].chest_box.treasure_amount = 0;
                break;
              case '4':
                list[i].sBoxImg = require('../../images/platinum-s.png');
                break;
            }
            boxList.push(list[i]);
          }
          let isHaveBox = false;//是否有可开宝箱类型
          for (let i = boxList.length - 1; i >= 0; i--) {
            if (boxList[i].big_chest_prize) {
              if (boxList[i].type == '3' && data.execData.free_treasure_amount > 0) {
                isHaveBox = true;
                boxList[i].isActive = true;
                this.imgNameChange(boxList[i].type);
                this.curIndex = i;
                this.boxId = boxList[i].chest_box.id;
                this.boxType = boxList[i].type;
                this.issue = boxList[i].chest_box.period;
                this.leftCount = boxList[i].left_count;
                this.hands = boxList[i].chest_box.hands;
                this.swiper.slideTo(i);
                break;
              } else if (data.execData.treasure_total_amount >= boxList[i].chest_box.treasure_amount) {
                isHaveBox = true;
                boxList[i].isActive = true;
                this.imgNameChange(boxList[i].type);
                this.curIndex = i;
                this.boxId = boxList[i].chest_box.id;
                this.boxType = boxList[i].type;
                this.issue = boxList[i].chest_box.period;
                this.leftCount = boxList[i].left_count;
                this.hands = boxList[i].chest_box.hands;
                this.swiper.slideTo(i);
                break;
              }
            }
          }
          /*如果没有可开宝箱,默认显示第一个*/
          if (!isHaveBox && boxList.length != 0) {
            boxList[0].isActive = true;
            this.boxId = boxList[0].chest_box.id;
            this.boxType = boxList[0].type;
            this.issue = boxList[0].chest_box.period;
            this.leftCount = boxList[0].left_count;
            this.hands = boxList[0].chest_box.hands;
            this.imgNameChange(boxList[0].type);
          }
          this.typeList = boxList;
          this.treasureTotalAmount = data.execData.treasure_total_amount;
          this.freeTreasureAmount = data.execData.free_treasure_amount;

          if (this.token) {
            this.isHaveNoReseive() //是否有未领取
            let treasureAmountEnough = false;  //宝箱符数量是否充足
            for (let i = 0, len = this.typeList.length; i < len; i++) {
              if (this.typeList[i].type !== '3' && this.treasureTotalAmount >= this.typeList[i].chest_box.treasure_amount) {
                treasureAmountEnough = true;
              }
            }
            if ((!treasureAmountEnough) && this.freeTreasureAmount <= 0 && !this.getCookie('directIn')) {
              this.afterReceiveShow = true;
              this.setSlide(0);
              this.receiveEndInfo.msg = '获取优众优惠券可得海量宝箱符！大奖正在等着您！赶快前往获取！';
              this.goToBoxIndex = 999;
            }
            this.setCookie('directIn', '', -1);


            /*this.$http({  //连续登录天数
             method: 'post',
             url: '/api/sign_records/sign_records',
             headers: {accessToken: this.token}
             }).then(function (res) {
             let data = res.body;
             if (data.execErrCode == 200) {
             this.signShow = true;
             this.setSlide(0);
             this.signGetNum = data.execDatas.free_treasure_amount;
             } else {
             let treasureAmountEnough = false;  //宝箱符数量是否充足
             for (let i = 0, len = this.typeList.length; i < len; i++) {
             if (this.typeList[i].type !== '1' && this.treasureTotalAmount >= this.typeList[i].chest_box.treasure_amount) {
             treasureAmountEnough = true;
             }
             }
             if ((!treasureAmountEnough) && this.freeTreasureAmount <= 0 && !this.getCookie('directIn')) {
             this.afterReceiveShow = true;
             this.setSlide(0);
             this.receiveEndInfo.msg = '获取优众优惠券可得海量宝箱符！大奖正在等着您！赶快前往获取！';
             this.goToBoxIndex = 999;
             }
             this.setCookie('directIn', '', -1);
             }
             })

             this.$http({  //签到奖励列表
             method: 'get',
             url: '/api/sign_records/setting_list',
             headers: {accessToken: this.token}
             }).then(function (res) {
             let data = res.body;
             if (data.execErrCode == 200) {
             let signList = [];
             for (let k = 0; k < 7; k++) {
             signList.push({isSign: false, isCurDay: false, isMain: false, amount: 0});
             }
             for (let i = 0, len = signList.length; i < len; i++) {
             if (data.execDatas.user_days > i) {
             signList[i].isSign = true;
             if (data.execDatas.user_days - 1 == i) {
             signList[i].isCurDay = true;
             }
             }
             let signDay = data.execDatas.sign_days[i];
             signList[i].isMain = signDay.is_main;
             signList[i].amount = signDay.amount;
             }
             this.signList = signList;
             }
             })*/
          }
        } else {
          _this.toast(data.execMsg);
        }
      })

      _this.asyncHttp('get', '/api/chest_broadcasts', {}, function (data) {
          _this.notice = data.execData.chest_broadcasts;
          if (_this.notice.length > 0) {
            _this.noticeShow = true;
            _this.$nextTick(function () {
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
        }
      )

      this.clientType(function () {
      }, function () {
        if (window.screen.height == 812) {
          if (_this.isApp) {
            _this.isIphonex = true;
          }
        } else {
          _this.isIos = true;
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })
      this.deleteNoScroll();

      window.getIhaveuToken = function (res) {
      }

      window.timer20 = setInterval(function () {
        _this.inviteTipShow = false;
        setTimeout(function () {
          _this.inviteTipShow = true;
        }, 5000)
      }, 11000)
    },
    beforeDestroy: function () {
      clearInterval(window.timer20)
    }
  }
</script>
<style>
  @import '../../style/treasurebox.css';
</style>
<style scoped>
  .inputCursor {
    width: 100%;
    position: fixed;
  }

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
    right: .2rem;
    height: 1.66rem;
  }

  .top-bar.iphonex {
    position: absolute;
    top: 33px;
  }

  .top-bar .notice {
    width: 7.33rem;
    height: .63rem;
    line-height: .63rem;
    margin: .51rem .39rem 0 2.04rem;
    font-size: .36rem;
    color: #ffdd00;
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

  .top-bar .btn {
    width: 1.16rem;
    height: 1.66rem;
    padding: .33rem .2rem 0 .2rem;
  }

  .top-bar .exchange-btn .img {
    height: .76rem;
    background: url("../../images/exchange-btn.png") 0/100% 100%;
  }

  .top-bar .rule-btn .img {
    height: .76rem;
    background: url("../../images/rule-btn.png") 0/100% 100%;
  }

  .top-bar .btn .txt {
    font-size: .36rem;
    color: #fff;
    margin-top: -.21rem;
  }

  /*奖品列表*/
  .box-type {
    height: 8.8rem;
    padding: 1.66rem .6rem 0;
  }

  .box-type.iphonex {
    padding-top: 84px;
    height: 324px;
  }

  .box-type .background {
    margin-top: .54rem;
    height: 6.6rem;
    padding: .48rem 0;
    background: url("../../images/type-bg-top.png") no-repeat top/100% .52rem, url("../../images/type-bg-bottom.png") no-repeat bottom/100% .52rem;
    position: relative;
  }

  .box-type .background .type-top {
    position: absolute;
    top: -.66rem;
    height: 1.26rem;
    left: .54rem;
    right: .54rem;
    background: url("../../images/type-top.png") 0 /100% 100%;
    font-size: .42rem;
    color: #fff;
    padding: .15rem 0;
    line-height: 1;
  }

  .box-type .type-top .issue {
    font-size: .3rem;
    color: #fae020;
    margin-top: .03rem;
  }

  .box-type .type-top .issue span {
    font-size: .33rem;
  }

  .box-type .progress-bar {
    height: 1.14rem;
    padding-top: .3rem;
    background: url("../../images/type-bg-middle.png") 0/100%;
  }

  .box-type .progress-bar .border {
    width: 8.49rem;
    height: .39rem;
    margin: 0 auto;
    padding: .09rem .06rem;
    background: url("../../images/progress-border.png") no-repeat 0/100% 100%;
  }

  .box-type .progress-bar .border > div {
    height: 100%;
    border-radius: .11rem;
    background: url("../../images/progress-con.png") no-repeat 0/100% 100%;
  }

  .box-type .progress-bar .text {
    font-size: .42rem;
    color: #fff;
  }

  .box-type .progress-bar .text span {
    color: #00ffd2;
  }

  .box-type .background .bg-middle {
    height: 4.5rem;
    background: url("../../images/type-bg-middle.png") 0/100%;
  }

  .type-list {
    height: 100%;
    padding-top: .45rem;
  }

  .type-list .award-list {
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

  .big-award .pic .pic-mask {
    position: absolute;
    top: .27rem;
    left: .27rem;
    right: .27rem;
    bottom: .27rem;
    background: rgba(0, 0, 0, .7);
  }

  .big-award .pic .pic-mask img, .small-award li .img-border .pic-mask img {
    position: absolute;
    top: .21rem;
    right: -.42rem;
    width: 1.61rem;
    height: .5rem;
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

  .small-award li .img-border .pic-mask {
    position: absolute;
    top: .09rem;
    left: .09rem;
    right: .09rem;
    bottom: .09rem;
    background: rgba(0, 0, 0, .7);
  }

  .small-award li .img-border .pic-mask img {
    top: .12rem;
    left: .12rem;
    right: auto;
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

  .no-box {
    line-height: 4.5rem;
    font-size: .48rem;
    color: #ca813f;
    margin: -.45rem auto;
  }

  /*底部按钮*/
  .footer-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2.06rem;
    padding: 0 .69rem .3rem 1.32rem;
    display: flex;
    font-size: .48rem;
    color: #fef4c4;
    line-height: 1;
    justify-content: space-between;
    background: url('../../images/openBox-bottom-bg.png') no-repeat bottom/100% auto;
  }

  .footer-bar {
    padding: 0 1.5rem 2.1rem;
  }

  .footer-bar.iphonex {
    height: 2.66rem;
    background-size: 100% 2.4rem;
  }

  .footer-bar .icon {
    height: 1.28rem;
    margin: 0 auto;
  }

  .footer-bar .my-award .icon {
    width: 1.24rem;
    background: url("../../images/my-award.png") 0/100% 100%;
  }

  .footer-bar .my-award .txt {
    position: relative;
  }

  .footer-bar .my-award span {
    position: absolute;
    top: -.36rem;
    right: -.48rem;
    width: .62rem;
    height: .62rem;
    background: url("../../images/red-dot.png") 0/100% 100%;
  }

  .footer-bar .lucky-list-btn .icon {
    width: 1.79rem;
    background: url("../../images/lucky-list-btn.png") 0/100% 100%;
  }

  .footer-bar .purse-btn .icon {
    width: 1.31rem;
    background: url("../../images/purse-btn.png") 0/100% 100%;
  }

  .footer-bar .prop-exchange-btn .icon {
    width: 1.79rem;
    background: url("../../images/prop-exchange.png") 0/100% 100%;
  }

  .footer-bar .get-box-btn .icon {
    width: 1.2rem;
    background: url("../../images/get-box-btn.png") 0/100% 100%;
  }

  /*规则说明弹框*/
  .rule-mask, .exchange-mask, .get-box-mask, .get-invented-mask, .sign-mask, .after-receive-mask, .qr-code-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1115;
    background: rgba(0, 0, 0, .8);
  }

  .rule {
    position: absolute;
    top: 8%;
    left: 1.15rem;
    right: 1.15rem;
    bottom: 6%;
    background: url("../../images/rule-bg.png") 0/100% 100%;
  }

  .rule .rule-title {
    width: 4rem;
    height: 1.11rem;
    background: url("../../images/rule-title.png") 0/100% 100%;
    margin: -.25rem auto;
  }

  .rule .rule-close, .get-box-close, .get-invented-close, .after-receive .close-btn {
    width: 1.14rem;
    height: 1.14rem;
    background: url("../../images/icon-close.png") 0/100% 100%;
    margin: -.4rem -.72rem 0 0;
  }

  .rule .rule-con {
    padding: .54rem .96rem;
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

  /*兑换宝箱符弹框*/
  .exchange {
    position: absolute;
    top: 6.44rem;
    left: 2.04rem;
    right: 2.04rem;
    height: 5.31rem;
    background: url("../../images/receive-way-bg.png") 0/100% 100%;
  }

  .exchange-title {
    width: 4.02rem;
    height: 1.13rem;
    line-height: .96rem;
    font-size: .48rem;
    color: #f0c253;
    background: url("../../images/exchange-title.png") 0/100% 100%;
    margin: -.25rem auto;
  }

  .exchange-close {
    position: absolute;
    top: .06rem;
    right: -.75rem;
    width: 1.58rem;
    height: 1.17rem;
    background: url("../../images/close.png") 0/100% 100%;
  }

  .exchange .input {
    width: 5.92rem;
    height: .81rem;
    margin: .75rem auto .28rem;
    padding: 0 .42rem;
    background: url("../../images/input-bg.png") 0/100% 100%;
  }

  .exchange .input input {
    display: block;
    width: 100%;
    height: 100%;
    background: transparent;
    font-size: .48rem;
    color: #272420;
  }

  .exchange .text {
    font-size: .39rem;
    color: #9e3a1d;
  }

  .sure-btn {
    width: 2.37rem;
    height: 1.08rem;
    line-height: 1.11rem;
    background: url("../../images/sure-btn.png") 0/100% 100%;
    font-size: .54rem;
    color: #9e3a1d;
    margin: .54rem auto 0;
  }

  /*获取宝箱符弹框*/
  .get-box {
    position: absolute;
    top: 6.7rem;
    left: 1.45rem;
    right: 1.45rem;
    height: 6.9rem;
    background: url("../../images/get-box-bg.png") 0/100% 100%;
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

  /*获取虚拟物品弹框*/
  .get-invented {
    position: absolute;
    top: 5.91rem;
    left: .72rem;
    right: .72rem;
    height: 8.49rem;
    background: url("../../images/get-invented-bg.png") 0/100% 100%;
  }

  .get-invented-close {
    margin-top: .2rem;
  }

  .get-invented-title {
    width: 7.17rem;
    height: .72rem;
    margin: .87rem auto .54rem;
    background: url("../../images/get-invented-title-1.png") 0/100% 100%;
  }

  .get-invented-title.another {
    background: url("../../images/get-invented-title-2.png") 0/100% 100%;
  }

  .get-invented-tips {
    font-size: .42rem;
    line-height: .54rem;
    color: #fcf2d5;
    padding: 0 1.65rem;
  }

  .get-invented-info {
    width: 8.15rem;
    height: 2.4rem;
    margin: .48rem auto .57rem;
    background: url("../../images/get-invented-info-bg.png") 0/100% 100%;
    display: flex;
  }

  .get-invented-info img {
    width: 1.98rem;
    height: 1.98rem;
    margin: .21rem .57rem 0 1.74rem;
  }

  .get-invented-info .name {
    line-height: 2.4rem;
    font-size: .54rem;
    color: #fff;
  }

  .get-invented-btn {
    width: 4.5rem;
    height: 1.08rem;
    line-height: 1.08rem;
    font-size: .48rem;
    color: #9d3a1d;
    margin: 0 auto;
    background: url("../../images/get-invented-btn-bg.png") 0/100% 100%;;
  }

  /*签到弹框*/
  .sign-mask .light {
    width: 8.35rem;
    height: 3.11rem;
    background: url("../../images/sparkle.png") no-repeat center/100% 100%;
    margin: 0 auto;
  }

  .sign-mask .sign {
    position: absolute;
    top: 16%;
    left: 50%;
    transform: translateX(-50%);
  }

  .sign-mask .main {
    width: 10.46rem;
    padding-bottom: 1rem;
    background: url("../../images/get-invented-bg.png") no-repeat center/100% 100%;
  }

  .sign-mask .title {
    width: 4rem;
    height: 1.11rem;
    line-height: .85rem;
    margin: 0 auto;
    font-size: .54rem;
    color: #f0c253;
    position: relative;
    top: -.21rem;
    background: url("../../images/title.png") no-repeat center/100% 100%;
  }

  .sign-mask .open-num {
    font-size: .6rem;
    color: #ffff50;
    margin-top: .78rem;
  }

  .sign-mask .sign-days {
    margin: 2rem .72rem 0;
    height: 1.08rem;
    display: flex;
  }

  .sign-mask .sign-days li {
    position: relative;
  }

  .sign-mask .sign-days li:not(:first-child) {
    flex: 1;
    display: flex;
  }

  .sign-mask .sign-days li .tips {
    width: 2.48rem;
    height: .79rem;
    line-height: .6rem;
    background: url("../../images/bubble.png") no-repeat center/100% 100%;
    font-size: .36rem;
    color: #af482b;
    position: absolute;
    top: -.9rem;
    left: -.72rem;
  }

  .sign-mask .sign-days li .circle {
    width: .54rem;
    height: .54rem;
    border: .09rem solid transparent;
    background-clip: padding-box;
    background-color: #6a4522;
    border-radius: 50%;
    position: relative;
    z-index: 106;
  }

  .sign-mask .sign-days li:last-child .circle {
    border-color: #6a4522;
  }

  .sign-mask .sign-days li.al-sign .circle {
    background-color: #f3c562;
  }

  .sign-mask .sign-days li.cur-day .circle {
    border-color: #f3c562;
    background-color: #fff;
  }

  .sign-mask .sign-days li .line {
    flex: 1;
    height: .12rem;
    margin-top: .21rem;
    position: relative;
  }

  .sign-mask .sign-days li .line span {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -.12rem;
    right: -.12rem;
    background: #6a4522;
    z-index: 105;
  }

  .sign-mask .sign-days li.al-sign .line span {
    background: #f3c562;
  }

  .sign-mask .sign-days li .txt {
    position: absolute;
    bottom: 0;
    right: 20%;
    transform: translateX(50%);
    white-space: nowrap;
    color: #6a4522;
    font-size: .36rem;
  }

  .sign-mask .sign-days li:first-child .txt {
    right: 55%;
  }

  .sign-mask .sign-days li.al-sign .txt {
    color: #f3c562;
  }

  .sign-mask .sign-days li.cur-day .txt {
    color: #fff;
  }

  .sign-mask .button {
    width: 3.16rem;
    height: 1.06rem;
    background: url("../../images/sure-btn.png") no-repeat center/100% 100%;
    font-size: .48rem;
    color: #9e3a1d;
    line-height: 1.08rem;
    margin: 0.75rem auto 0;
  }

  /*领取完成后的弹框*/
  .after-receive {
    width: 8.61rem;
    height: 5.19rem;
    background: url("../../images/ex-succ-bg.png") 0/100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: .96rem;
    font-size: .48rem;
  }

  .after-receive .tips-txt {
    color: #fff;
    -webkit-line-clamp: 3;
  }

  .after-receive .btn, .how-open .btn {
    width: 3.16rem;
    height: 1.05rem;
    line-height: 1.08rem;
    color: #9e3a1d;
    position: absolute;
    bottom: .96rem;
    left: 50%;
    margin-left: -1.58rem;
    background: url("../../images/ex-sure.png") 0/100% 100%;
  }

  .after-receive .close-btn {
    margin: -.72rem -1.62rem 0 0;
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

  .bgtext {
    position: absolute;
    right: 1rem;
    width: 10.26rem;
    height: 9.27rem;
    background: url("../../images/wxshare.png") 0/100% 100%;
  }

  /*关注二维码*/
  .qr-code-mask > div {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
  }

  .qr-code-mask .logo {
    width: 7.54rem;
    height: 4.1rem;
    background: url("../../images/logo-img.png") no-repeat 0/100% 100%;
  }

  .qr-code-mask .qr-code {
    width: 4.8rem;
    height: 4.8rem;
    margin: 0 auto .54rem;
  }

  .qr-code-mask .qr-code img {
    height: 100%;
  }

  .qr-code-mask .name {
    font-size: .45rem;
    color: #ffc945;
  }

  /*黄金宝箱开启条件弹框*/
  .how-open {
    padding: .6rem .36rem;
    font-size: .48rem;
    color: #fff;
  }

  .how-open .tips span {
    color: #fafd3e;
  }

  .how-open .line {
    height: .06rem;
    margin: .48rem auto .42rem;
    background: url("../../images/line2.png") no-repeat 0/100% 100%;
  }

  .how-open .way {
    font-size: .39rem;
    line-height: .54rem;
  }

  .how-open .way span {
    color: #ffc945;
  }

  .how-open .btn {
    bottom: .84rem;
  }

  .invite-entry {
    position: fixed;
    bottom: 3.72rem;
    right: 0;
  }

  .invite-entry .package {
    width: 2.72rem;
    height: 2.6rem;
    background: url(../../images/redbag-remindbag.png) no-repeat center/contain;
  }

  .invite-entry .txt {
    position: absolute;
    right: 1.08rem;
    top: -1.1rem;
    width: 3.49rem;
    height: 1.85rem;
    font-size: .36rem;
    color: #623a19;
    padding: .2rem .3rem .2rem .36rem;
    line-height: .48rem;
    background: url(../../images/redbag-remind-talk.png) no-repeat center/contain;
  }
</style>
