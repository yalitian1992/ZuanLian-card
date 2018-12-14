<template>
  <div class="main" :class="{iphonex: isIphonex,ios:isIos}" @click=hide()>
    <div class="Box-bg">
      <div class="topHeight" :class="{iphonex: isIphonex&&appOpen}" @click="returnBack">
        <p class="go-back"></p>
      </div>
      <div class="win-record-box vc">
        <div class="title">
          <p>我的奖品</p>
        </div>
        <div class="tabBox hide" :class="{tabfixed: isTabfixed == true}">
          <ul class="record-tab">
            <li :class="{active: type_idx==index}" v-for="(item, index) in recordTab" @click="recordTabChange(index)">
              <div>
                <p class="statuName">{{item.name}}</p>
                <p class="num">{{item.num}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="win-txt" id="scrollBox" :class="{'no-open-record':isOpenRecord,'no-slide': noSlide}">
          <prize-record @openRecord="openRecord"></prize-record>
          <div class="record-tit">获奖记录</div>
          <div class="tabBox" id="recordTab">
            <ul class="record-tab">
              <li :class="{active: type_idx==index}" v-for="(item, index) in recordTab" @click="recordTabChange(index)">
                <div>
                  <p class="statuName">{{item.name}}</p>
                  <p class="num">{{item.num}}</p>
                </div>
              </li>
            </ul>
          </div>
          <ul class="recordList">
            <li class="re-box" v-for="(item,$index) in list" v-if="item.chest_prizes.length!=0" @click=hide()>
              <p class="open-time"><span>开启时间</span><span>{{item.created_at.slice(0,10)}} {{item.created_at.slice(11,19)}}</span></p>
              <div class="pro-box" v-for="(item2,$index1) in item.chest_prizes" v-if="item2.prize_type == 1 || item2.prize_type == 7 || item2.prize_type == 9 || item2.prize_type == 10">
                <div class="real">
                  <div class="fl pro"><img :src="imgBaseUrl() + item2.t267" alt=""></div>
                  <div class="fl pro-c">
                    <p class="pro-name">{{item2.name}}</p>
                    <div v-if="item2.prize_type == 1">
                      <p class="pro-state" v-if="item.status == 0 || item.status == 1">待领取</p>
                      <p class="pro-state" v-if="item.ship_status == 3">待发放</p>
                      <p class="pro-state" v-if="(item.ship_status == 0 || item.ship_status == 2) && item.status == 2 && item.status != 4">待支付</p>
                      <p class="pro-state" v-if="item.ship_status == 1">已发货</p>
                    </div>
                    <div v-if="item2.prize_type == 10">
                      <p class="pro-state" v-if="item.status == 0 || item.status == 1">待领取</p>
                      <p class="pro-state" v-if="item.status == 2">已发放至钱包</p>
                    </div>
                    <p class="pro-state" v-if="item.status == 4">已献祭</p>
                    <div v-if="item2.prize_type == 7">
                      <p class="pro-state" v-if="item.phonecard_prizes_status != 3 && item.phonecard_prizes_status != 0 && item.status !=4">待充值</p>
                      <p class="pro-state" v-if="item.phonecard_prizes_status == 3">已充值</p>
                    </div>
                  </div>
                  <div class="fl pro-r">
                    <button class="Receive" v-if="item.status == 0 || item.status == 1 || item.status == 3" @click="winPrize($index)">领取</button>
                    <button class="Receive" v-if="item.status == 2 && item2.prize_type == 9" @click="JDInfo($index)">查看</button>
                    <button class="xjBtn" v-for="(item3,$index1) in item.chest_prizes" v-if="(item3.prize_type == 1 || item3.prize_type == 7) && (item.status == 0 || item.status == 1 || item.status == 3) && xjBtn && item3.exchange > 0" @click="recBoxOpen($index,$index1)">献祭</button>
                    <div v-if="item.status == 2">
                      <button class="Receive" v-if="item.prize_type == 1 && item2.prize_type == 1 && (item.ship_status == 0 || item.ship_status == 2) && item.status != 4" @click="Paid($index)">待支付</button>
                      <button class="gray" v-if="(item.ship_status != 0 && item.ship_status != 2) || item2.prize_type == 7 || item2.prize_type == 10">已领取</button>
                    </div>
                    <button class="gray" v-if="item.status == 4">已献祭</button>
                  </div>
                </div>
                <!--jd卡弹框-->
                <div class="jd-card-box" v-if="jdShow">
                  <div class="jd-card">
                    <div class="right" @click="jdShow = false, noSlide = false"></div>
                    <p class="JDtitle">{{JDprice}}元京东卡</p>
                    <p>卡号：{{JDcode}}</p>
                    <p>密码：{{JDpassword}}</p>
                    <button class="copyBtn" :data-clipboard-text = "JDpassword" type="text" @click="toast('复制成功！'),jdShow = false, noSlide = false">复制密码</button>
                  </div>
                </div>
              </div>

              <!--虚物-->
              <div class="pro-box Virtual" v-if="item.chest_prizes.length>1 || (item.chest_prizes.length!=0 && !(item.chest_prizes[0].prize_type == 1 || item.chest_prizes[0].prize_type == 7 || item.chest_prizes[0].prize_type == 9 || item.chest_prizes[0].prize_type == 10))">
                <div class="state">
                  <span v-if="item.status != 0">已发放</span>
                  <span v-if="item.status == 0">未领取</span>
                </div>
                <div class="quan-box hb">
                  <div class="li" v-for="(item1,$index1) in item.chest_prizes" v-if="!(item1.prize_type == 1 || item1.prize_type == 7 || item1.prize_type == 9)" @click="Cash($index,$index1)">
                    <p class="p vc"><img :src="imgBaseUrl() + item1.t114" alt=""></p>
                    <span class="pro-name">{{item1.name}}</span>
                    <!--优众现金券弹框-->
                    <div class="cash-box" v-if="cashId == $index && cashShow" @click.stop="">
                      <div class="cash">
                        <div v-if="txtShow1">
                        <p class="cash-title">{{item1.name}}</p>
                        <p>有效期限：{{item1.memo}}</p>
                        <p>优惠券直接发放至您的账户中，可前往“道具回收”销毁获得现金。</p>
                      </div>
                        <div v-if="txtShow2">
                          <p class="txtShow2">{{txt}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="BTN Receive" v-if="item.status == 0" @click="winPrize($index)">领取</button>
              </div>

              <!--add_column :chest_records, :phonecard_prizes_status, :integer, default: 0, comment: "电话卡充值状态 0 不需要充值 1 代充值  2 充值中  3 充值成功"
              add_column :chest_records, :voucher_prizes_status, :integer, default: 0, comment: "优众现金券 状态 0 不需要充值 1 待发券  3 发券成功"-->

            </li>

            <div :class="{noRecord: true, display: display}">
              <span></span>
              <p>暂无获奖记录</p>
            </div>
          </ul>
        </div>

      </div>
      <div class="bomb" @click="Bomb" v-if="bomb"></div>
      <!--献祭弹框-->
      <div class="receive-way-mask ios" v-if="recBox">
        <div class="receive-way">
          <div class="title"></div>
          <div class="feats-num">献祭获得：<span></span>{{Math.floor(recPercent * recPrice)}}</div>
          <p class="font-white">前往“兑奖阁”可兑换丰富奖品哦</p>
          <div class="btn-group align-c">
            <div @click="recBoxClose">再想想</div>
            <div @click="Sacrificial(idx)">献祭</div>
          </div>
        </div>
      </div>
      <!--献祭成功-->
      <div class="receive-way-mask ios" v-if="xjS">
        <div class="receive-way receive-success">
          <div class="light"></div>
          <div class="title"></div>
          <div class="feats-num">获得：<span></span>{{Math.floor(recPercent * recPrice)}}</div>
          <div class="btn-group">
            <div @click="xjS = false,noSlide = false">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../components/common/public.js'
  import {imgBaseUrl} from '../../config/config'
  import prizeRecord from '../../components/prizeRecord/prizeRecord.vue'
  import Clipboard from 'clipboard'
  let clipboard = new Clipboard('.copyBtn')   //复制密码

  export default {
    data () {
      return {
        JDid: '',
        JDlist: [],
        JDcode: '',
        JDpassword: '',
        JDprice: '',
        PsdTxt: 'sssssssss',    //复制密码
        jdShow: false,
        noSlide: false,
        total: '',
        recordTab: [
          {name: "全部", type: 0,num: 0},
          {name: "待领取", type: 1,num: 0},
          {name: "待发货", type: 2,num: 0},
          {name: "已领取", type: 3,num: 0},
        ],
        isTabfixed: false, //  是否tab栏固定
        type_idx: 0,
        xjBtn: false,
        recPrice: 0,
        recPercent: 0,
        recTotal: '',
        xjS: false,
        idx: '',
        recBox: false,       //献祭弹框
        isIphonex: false,      //是否是iPhonex
        isIos: false,
        appOpen:false,
        imgBaseUrl,
        params:{page: 1},
        cardPara:{
          id: 1
        },
        productId: {
          productId : '',
          recordId: ''
        },
        phoneId: '',
        list: [],
        cashList: [],       //现金券
        cashShow: false,
        cashId: '',
        bomb: false,
        display: false,
        godis: true,
        isHttp: true,      //是否请求
        isHttpXJ: true,
        index: '',
        pic: '',
        name: '',
        price: '',
        txt: '',      //弹框文本
        txtShow1: false,
        txtShow2: false,
        id: '',
        currentH: null,
        isOpenRecord: true
      }
    },
    methods: {
      /*返回*/
      returnBack:function(){
        if(this.$route.query.native == 0){
          this.setCookie('directIn', 'noDirectIn', 1);
        }
        this.goBack();
      },
      /*JD卡*/
      JDInfo: function(index){
        var _this = this
        this.$http({
          method: 'get',
          url: '/api/chest_records/jd_info',
          headers: {accessToken: _this.getCookie('intoToken')},
          params: {id: _this.list[index].id}
        }).then(function(res){
          var data = res.body
          if(data.execErrCode == 200){
            _this.jdShow = true
            _this.noSlide = true
            _this.JDlist = data
            _this.JDcode = data.execData.jd_card.code
            _this.JDpassword = data.execData.jd_card.password
            _this.JDprice = data.execData.jd_card.price
          }else if(data.execErrCode == 1707){
//            绑定微信
            _this.clientType(function(){window.Android.phoneBindingWx();},function(){ window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx'); })
          }else{
            _this.toast(data.execMsg)
          }
        })
      },

      openRecord:function(msg){
        this.isOpenRecord = msg;
      },
      recordTabChange: function(index){
        this.display = false
        var elm = document.getElementById("scrollBox")
        if (elm.scrollTop>this.currentH){
          elm.scrollTop = this.currentH
        }else{
          elm.scrollTop = elm.scrollTop
        }
        this.type_idx = index;
        this.params.page = 1
        this.isHttp = true;
        this.winHttp(index)
      },
      recBoxClose: function(){
        this.recBox = false
        this.noSlide = false
      },
      recBoxOpen: function(ind,ind1){
        this.recBox = true
        this.noSlide = true
        this.idx = ind
        this.recPrice = this.list[ind].chest_prizes[ind1].price
        this.recPercent = this.list[ind].chest_prizes[ind1].exchange /100
      },
//      待支付
      Paid: function(index){
//        console.log(index)
        var _this = this
//        console.log(_this.list)
//      显示邮费
        _this.asyncHttp('get', '/api/chest_records/pay_amount', {
          id: _this.list[index].id
        }, function (data) {
          _this.chestRecord = data.execDatas.total_amount

          _this.$router.replace({
            path: '/payment',
            query: {from: 3, token: _this.getToken(), native: 0, Postage: _this.chestRecord, id: _this.list[index].id}
          })
        })
      },

//      微信浏览器判断
      InFo: function(){
        var _this = this
        _this.godis = true
        _this.isWachat(function(){
          /*_this.bomb = true;
           this.setSlide(0);*/
          let url = window.location.href;
          window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down?status=1';
        },function(){
          let url = window.location.href;
          window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down?status=1';
        }, function(){
          let url = window.location.href;
          window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down?status=1';
        })
      },
//      微信分享弹框
      Bomb: function(){
        bomb=!bomb
        this.setSlide();
      },
//      现金券
      Cash: function(id,ids){
//        console.log(this.txtShow1,this.txtShow2)
        this.cashList = this.list[id].chest_prizes[ids]
        event.stopPropagation();
        if(this.cashList.prize_type == 6){
          this.txtShow1 = true
          this.txtShow2 = false
        }else{
          this.txtShow2 = true
          this.txtShow1 = false
          switch(this.cashList.prize_type){
            case 2: this.txt = "入场券用于报名抢兑奖品";
                    break;
            case 3: this.txt = "兑奖券可在兑奖阁兑换奖品";
                    break;
            case 5: this.txt = "宝箱符用于开启宝箱";
                    break;
          }
        }
        this.cashShow = true        //弹框显示
        this.cashId = id
      },

      hide: function(){
        this.cashShow = false
      },
//      献祭
      Sacrificial: function(index){
        this.noSlide = false
        if(this.isHttpXJ){
          this.isHttpXJ = false;
          var _this = this
          for(let i=0;i<_this.list[index].chest_prizes.length;i++){
            if(_this.list[index].chest_prizes[i].prize_type == 1 || _this.list[index].chest_prizes[i].prize_type == 7){
              _this.productId.productId = _this.list[index].chest_prizes[i].id
              break
            }
          }
          _this.productId.recordId = _this.list[index].id
          _this.xjS = false
          _this.recBox = false
          if(navigator.userAgent.indexOf("jfjingbao") > -1){
            this.$http({
              method: 'post',
              url: '/card-service-web/h5/chestRecords/sacrifice',
              headers: {accessToken: _this.getCookie('intoToken')},
              params: {productId: _this.productId.productId, recordId: _this.productId.recordId}
            }).then(function(res){
              var data = res.body
              if(data.execErrCode == 200){
                _this.isHttpXJ = true;
                _this.xjS = true
                _this.noSlide = true

                _this.list[index].status = 4
                _this.params.page = 1
                _this.winHttp(_this.type_idx)
                _this.prizeNum()

              }else if(data.execErrCode == 1707){
//              _this.toast("请绑定微信")
                _this.isHttpXJ = true;
                _this.clientType(function(){window.Android.phoneBindingWx();},function(){ window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx'); })

              }else if(data.execErrCode == 1708){
//              _this.toast("请绑定手机号")
                _this.isHttpXJ = true;
                _this.clientType(function(){window.Android.wxBindingPhone();},function(){ window.webkit.messageHandlers.AppModel.postMessage('wxBidingMobile');})

              }else{
                _this.isHttpXJ = true;
                _this.toast(data.execMsg)
              }
            })
          }else{
            _this.InFo()
          }
        }
      },
//      领取奖品
      winPrize: function(index){
        var _this = this
        _this.index = index
        _this.cardPara.id = _this.list[index].id
        for(let i=0;i<_this.list[index].chest_prizes.length;i++){
          if(_this.list[index].chest_prizes[i].prize_type == 7 || _this.list[index].chest_prizes[i].prize_type == 9 || _this.list[index].chest_prizes[i].prize_type == 10){
            _this.phoneId = _this.list[index].chest_prizes[i].id
            _this.JDid = i
          }
        }
        if(_this.list[index].prize_type == 0 && _this.list[index].status == 0){
//          虚物领取失败
          this.$http({
            method: 'get',
            url: '/card-service-web/h5/chestRecords/getChestPrizes',
            headers: {accessToken: _this.getCookie('intoToken')},
            params: {id: _this.cardPara.id }
          }).then(function(res){
            let data = res.body
            if(data.execErrCode == 200){
              if(data.execData.status == 2){
                _this.toast("领取成功！")
                _this.list[index].status =2
                /*_this.list.splice(index,1)
                _this.recordTab[1].num--*/
                _this.params.page = 1
                _this.winHttp(_this.type_idx)
                _this.prizeNum()
              }
            }else{
              _this.toast(data.execMsg)
            }
          })
        }else{
//          实物或手机卡
          if(navigator.userAgent.indexOf("jfjingbao") > -1){
            this.$http({
              method: 'get',
              url: '/card-service-web/h5/chestRecords/getChestPrizes',
              headers: {accessToken: _this.getCookie('intoToken')},
              params: {id: _this.cardPara.id }
            }).then(function(res){
              let data = res.body
              if(data.execErrCode == 200){
                if(data.execData.status == 2){
                  _this.toast("领取成功！")
                  _this.list[index].status =2

                  _this.params.page = 1
                  _this.winHttp(_this.type_idx)
                  _this.prizeNum()
                }else{
//                  _this.list[index].status = 2;
                  _this.name = _this.list[index].chest_prizes[0].name
                  _this.pic = _this.list[index].chest_prizes[0].thumbnail
                  _this.price = _this.list[index].chest_prizes[0].price

                  if(data.execData.status == 3){
//                    奖品有手机卡
                    if(data.execData.flag == 1){
//                      手机卡充值
                      this.$http({
                        method: 'post',
                        url: '/card-service-web/h5/chestRecords/getRechargeCard',
                        headers: {accessToken: _this.getCookie('intoToken')},
                        params: {id: _this.cardPara.id, productId: _this.phoneId }
                      }).then(function(res){
                        var data = res.body
                        if(data.execErrCode == 200){
                          if(_this.list[index].chest_prizes[_this.JDid].prize_type == 7){
                            _this.toast("我们会在1~5个工作日内<br/>将话费充值到您的注册手机号中")
                            _this.list[index].status = 2;
                          }else if(_this.list[index].chest_prizes[_this.JDid].prize_type == 10){
                            _this.toast(data.execMsg)
                            _this.list[index].status = 2;
                          }else if(_this.list[index].chest_prizes[_this.JDid].prize_type == 9){
//                           JD卡信息
                            _this.JDInfo(index)
                            _this.list[index].status = 2;
                          }
                          _this.params.page = 1
                          _this.winHttp(_this.type_idx)
                          _this.prizeNum()
                        }else if(data.execErrCode == 1707){
//                _this.toast("请绑定微信")
                          _this.clientType(function(){window.Android.phoneBindingWx();},function(){ window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx'); })
                        }else if(data.execErrCode == 1708){
//                _this.toast("请绑定手机号")
                          _this.clientType(function(){window.Android.wxBindingPhone();},function(){ window.webkit.messageHandlers.AppModel.postMessage('wxBidingMobile');})
                        }else{
                          _this.toast(data.execMsg)
                        }
                      })

                      /*this.asyncHttp('post', '/card-service-web/h5/chestRecords/getRechargeCard', {id: _this.cardPara.id, productId: _this.phoneId}, function (data){
                        _this.toast("我们会在1~5个工作日内<br/>将话费充值到您的注册手机号中")

                        /!*_this.list.splice(index,1)
                        _this.recordTab[1].num--*!/
                        _this.params.page = 1
                        _this.winHttp(_this.type_idx)
                        _this.prizeNum()
                      })*/
                    }else{
                      _this.toast("参加任意3场抢兑奖品或朋友赛即可领取！")
                    }
                  }else{
//                    奖品有实物
                    if(data.execData.flag == 1) {
                      if(navigator.userAgent.indexOf("jfjingbao") > -1){
                        if(_this.list[index].prize_type == 1){
                          for(let i=0;i<_this.list[index].chest_prizes.length;i++){
                            if(_this.list[index].chest_prizes[i].prize_type == 1){
                              _this.name = _this.list[index].chest_prizes[i].name
                              _this.pic = _this.list[index].chest_prizes[i].thumbnail
                              _this.price = _this.list[index].chest_prizes[i].price
                              break;
                            }
                          }
                        }
                        var receiveInfo = {id: _this.cardPara.id,name: _this.name,pic: _this.pic}
                        window.localStorage.setItem("receiveInfo",JSON.stringify(receiveInfo))   //本地存储
                        let url = window.location.href;
                        window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/addressChange?from=3&backHref=1';
                      }else{
                        _this.InFo()
                      }
                    }else{
                      _this.toast("参加任意3场抢兑奖品或朋友赛即可领取！")
                    }
                  }
                }
              }else if (data.execErrCode == 4003){
                _this.goLogin()
              }else if(data.execErrCode == 1707){
//                _this.toast("请绑定微信")
                _this.clientType(function(){window.Android.phoneBindingWx();},function(){ window.webkit.messageHandlers.AppModel.postMessage('mobileBidingWx'); })
              }else if(data.execErrCode == 1708){
//                _this.toast("请绑定手机号")
                _this.clientType(function(){window.Android.wxBindingPhone();},function(){ window.webkit.messageHandlers.AppModel.postMessage('wxBidingMobile');})
              }else{
                _this.toast(data.execMsg)
              }
            })
          }else{
            _this.InFo()
          }
        }
      },
//      奖品列表
      winHttp: function(type){
        if(this.isHttp){
          this.isHttp = false;
          var _this = this;
          _this.type = type
          this.$http({
            method: 'get',
            url: '/api/chest_records/index',
            headers: {accessToken: _this.getCookie('intoToken')},
            params: {page: this.params.page, type: _this.type }
          }).then(function(res){
            let data = res.body;
            if (data.execErrCode == 200){
              _this.isHttp = true;
              for(let i;i<data.execData.chest_records.length;i++){
                data.execData.chest_records[i].isShow = false
              }
              if (data.execData.chest_records.length < 15){
                _this.isHttp = false;
              }
              if (_this.params.page == 1) {
                _this.list = data.execData.chest_records
                if(data.execData.chest_records.length == 0 /*|| data.execData.chest_records[0].chest_prizes == ''*/){
                  _this.display = true
                }else{
                  _this.display = false
                }
              } else {
                _this.list = _this.list.concat(data.execData.chest_records);
              }
              _this.params.page++;
//              _this.isPhone()
            }else if(data.execErrCode == 4003){
              _this.goLogin()
            }else{
              _this.display = true
            }
          })
        }
      },
//        奖品数量
      prizeNum: function () {
        var _this = this
        this.$http({
          method: 'get',
          url: '/api/chest_record_items/total',
          headers: {accessToken: _this.getCookie('intoToken')}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            let list = data.execDatas.record_total_count, prizeList = [];

            for (let i in list) {
              list[i] = {id: i, num: list[i]}
              _this.recordTab[i].num = list[i].num;
              prizeList.push(list[i]);
              this.prizeList = prizeList;
            }
          } else if (data.execErrCode == 4003) {
            this.goLogin();
          } else {
            this.toast(data.execMsg);
          }
        })
      },
//      是否电话卡
      isPhone: function(){
        var _this = this
        for(let i=0;i<_this.list.length;i++){
          _this.list[i].isShow=false;
          for(let j=0;j<_this.list[i].chest_prizes.length;j++){
            if(_this.list[i].chest_prizes[j].prize_type == 7){
              _this.list[i].status = 1
            }
            if(_this.list[i].chest_prizes[j].prize_type == 1){
              _this.list[i].isShow = true
            }
          }
        }
      }
    },
    components: {
      prizeRecord
    },
    mounted(){

      var _this = this
      this.clientType(function(){},function(){
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        }else{
          _this.isIos = true;
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })

      if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }

      if(navigator.userAgent.indexOf("jfjingbao") > -1){
        _this.godis=false
        _this.xjBtn = true
      }else{
        _this.xjBtn = false
        _this.godis=true
      }


      _this.winHttp(_this.type_idx)
      _this.prizeNum()


      var boxElm = document.getElementById("scrollBox")
      var tabElm = document.getElementById("recordTab")
      // var currentH = 1
      boxElm.onscroll=function(){
        if(_this.currentH == null) {
          _this.currentH = tabElm.offsetTop - boxElm.offsetTop
        }
        if(boxElm.scrollTop>_this.currentH){
          _this.isTabfixed = true;
        }else{
          _this.isTabfixed = false;
        }

        if(boxElm.scrollHeight - boxElm.scrollTop - boxElm.clientHeight <= 50) {
          _this.winHttp(_this.type_idx);
        }
      }
    }
  }
</script>

<style scoped>
  .copyBtn{
    display: block;
    margin: 0.4rem auto;
    width: 2.6rem;
    height: 0.8rem;
    border-radius: 0.1rem;
    background: url("../../images/bg-btn-add-opretion.png") no-repeat center/100% 100%;
  }
  .jd-card-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 10;
  }
  .jd-card{
    position: relative;
    margin: 60% auto 0 auto;
    padding: 0 0.4rem;
    width: 7.8rem;
    height: 4.4rem;
    background: url("../../images/cash-bg.png") no-repeat center/100% 100%;
  }
  .jd-card .right{
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 0.24rem;
    right: -0.5rem;
    background: url("../../images/clone1.png") no-repeat center/100% 100%;
  }
  .jd-card .JDtitle{
    padding-top: 0.2rem;
    text-align: center;
  }
  .jd-card p{
    font-size: 0.4rem;
    margin-top: 0.3rem;
    color: #fff;
  }

  .no-slide{
    overflow: hidden !important;
  }
  .BTN.Receive{
    margin: 0.4rem auto 0.16rem auto;
    display: block;
    width: 1.98rem;
    height: 0.84rem;
    font-size: 0.45rem;
    color: #9e3a1d;
    background: url("../../images/win-goweb-btn.png") no-repeat center/100% 100%;
  }
  .recordList{
    position: relative;
  }
  .envelopes-btn{
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    display: block;
    width: 5.2rem;
    height: 1.3rem;
    background: url("../../images/bag-bg.png") no-repeat center/100% 100%;
  }
  /*iphoneX适配*/
  .main.iphonex{
    height: 100%;
    min-height:812px;
  }
  .main.ios{
    height: 100%;
  }
  .topHeight.iphonex{
    position: absolute;
    top:33px;
  }

  .txtShow2{
    padding: 0.3rem 0;
  }
  .font-white{
    color: #fff;
  }

  .receive-success .btn-group > div{
    margin: 0 auto;
  }

  /* 垂直居中 */
  .vc {
    display: flex;
    align-items: center;
  }
  /* 两端对齐 */
  .hb {
    display: flex;
    flex-wrap: wrap;
    /*justify-content: space-between;*/
    flex-direction: row;
    justify-content: left;
  }
  /* 左右居中对齐 */
  .ha {
    display: flex;
    justify-content: space-around;
  }

  .show{
    display: none;
  }
  .display{
    display: block !important;
  }
  /*.noRecord-box{
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
  }*/
  .noRecord{
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 2rem;
  }
  .noRecord span{
    display: block;
    margin: 0 auto;
    width: 3.6rem;
    height: 3.6rem;
    background: url("../../images/no-record.png") no-repeat center/contain;
  }
  .noRecord p{
    margin-top: 0.45rem;
    font-size: 0.35rem;
    color: #ab8a67;
    text-align: center;
  }
  /*弹框*/
  .bomb{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: url("../../images/text2.png") no-repeat 70% 3%/75% rgba(0,0,0,0.8);
    z-index: 10;
  }
  .topHeight{
    position: absolute;
    top: 0;
    left: 0;
    width: 1.8rem;
    height: 1.6rem;
    padding: .2rem 0 0 .4rem;
    z-index: 2;

    /*position: absolute;
    top: 0.2rem;
    left: 0.4rem;
    width: 1.4rem;
    height: 1.4rem;*/
  }
  .go-back{
    width: 0.9rem;
    height: 0.9rem;
    background: url("../../images/go-back.png");
    background-size: 100% 100%;
  }
  .Box-bg,.win-record-box{
    height: 100%;
  }
  .Box-bg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    /*position: relative;*/
    padding: 10% 5% 9% 5%;
    background: url("../../images/box-bg.jpg");
    background-size: 100% 100%;
  }
  .win-record-box{
    position: relative;
    padding: 1.1rem 0.4rem 0.8rem 0.4rem;
    background: url("../../images/brown-bg.png");
    background-size: 100% 100%;
  }
  .win-txt{
    width: 100%;
    height: 100%;
  }
  .win-txt.no-open-record{
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
  }
  .win-record-box .title{
    position: absolute;
    top: -0.4rem;
    left: 0;
    right: 0;
  }
  .win-record-box .title p{
    margin: 0 auto;
    width: 80%;
    /*padding-top: 0.12rem;*/
    height: 1.3rem;
    line-height: 1.04rem;
    font-size: 0.51rem;
    color: #ffe9a6;
    text-align: center;
    background: url("../../images/win-title-bg.png");
    background-size: 100% 100%;
  }
  .re-box{
    position: relative;
    background: url("../../images/record-li-bg.png");
    background-size: 100% 100%;
  }
  .win-record-box li{
    margin-bottom: 0.3rem;
    padding: 0.36rem 0.48rem;
  }
  .open-time{
    display: flex;
    justify-content: space-between;
    font-size: 0.36rem;
    color: #6e442a;
  }
  .pro-box{
    position: relative;
    margin: 0.3rem auto 0 auto;
    padding: 0.13rem;
    border: 1px solid #c69452;
    overflow: hidden;
  }
  .pro-box .fl{
    float: left;
  }
  .pro{
    width: 2.5rem;
    height: 2.5rem;
    background: url("../../images/pro-border.png");
    background-size: 100% 100%;
  }
  .real .pro-name{
    font-size: 0.42rem;
    color: #272420;
    margin-top: 0.21rem;

    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 2; /** 显示的行数 **/
    overflow: hidden;  /** 隐藏超出的内容 **/
  }
  .Virtual .pro-name{
    text-align: center;
    color: #272420;
    font-size: 0.32rem;
  }
  .pro-c{
    position: relative;
    width: 4rem;
    height: 2.5rem;
    margin-left: 0.3rem;
  }
  .pro-r{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 2.5rem;
    width: 2rem;
    position: absolute;
    right: 0.3rem;
    top: 0.3rem;
  }
  .pro-r button{
    display: block;
    width: 1.98rem;
    height: 0.84rem;
    font-size: 0.45rem;
    color: #9e3a1d;
  }
  .pro-r button.Receive{
    background: url("../../images/win-goweb-btn.png") no-repeat center/100% 100%;
  }
  .pro-r button.xjBtn{
    background: url("../../images/win-receive-btn.png") no-repeat center/100% 100%;
  }
  .pro-r button.gray{
    color: #606060;
    background: url("../../images/Invalid.png") no-repeat center/100% 100%;
  }
  .pro-state{
    font-size: 0.39rem;
    color: #d44400;
    position: absolute;
    bottom: 0.09rem;
  }
  .pro img{
    margin: 0.16rem auto 0 auto;
    width: 2.2rem;
    height: 2.2rem;
  }

  .quan-box{
    /*margin: 0.45rem auto 0.3rem auto;*/
    /*padding: 0 0.18rem;*/
  }
  .quan-box .li{
    width: 2.27rem;
    margin-top: 0.3rem;
  }
  .quan-box .li .p{
    /*width: 1.98rem;
    height: 1.98rem;*/
    margin: 0 auto;
    width: 2rem;
    height: 2rem;
    background: url("../../images/quan-border.png");
    background-size: 100% 100%;
  }
  .quan-box .li img{
    margin: auto;
    width: 1.8rem;
    height: 1.8rem;
  }
  .quan-box .li span{
    margin-top: 0.06rem;
    width: 100%;
    display: block;
    overflow: hidden;
  }
  .Virtual{
    position: relative;
    padding-top: 0.54rem;
  }
  .Virtual .state{
    position: absolute;
    top: 0;
    width: 100%;
  }
  .Virtual .state span{
    display: block;
    margin: 0 auto;
    width: 2.76rem;
    height: 0.54rem;
    line-height: 0.54rem;
    text-align: center;
    font-size: 0.39rem;
    color: #6e442a;
    background: url("../../images/state-bg.png") no-repeat center/100% 100%;
  }

  .btn{
    margin: 0.48rem auto 0.12rem;
  }
  .btn .tn{
    width: 3.28rem;
    height: 0.87rem;
    font-size: 0.45rem;
    color: #9e3a1d;
  }
  .btn .receive{
    background: url("../../images/win-receive-btn.png");
    background-size: 100% 100%;
  }
  .btn .go-web{
    background: url("../../images/win-goweb-btn.png");
    background-size: 100% 100%;
  }
  .btn .gray{
    color: black;
    background: url("../../images/Invalid.png");
    background-size: 100% 100%;
  }

  /*领取奖品弹框*/
  .receive-way-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 1000;
  }
  .receive-way-mask.ios{
    position: absolute;
  }
  .receive-way{
    position: absolute;
    top: 60%;
    left: 2rem;
    right: 1.96rem;
    z-index: 1005;
    font-size: .48rem;
    text-align: center;
    color: #9e3a1d;
  }
  .receive-way {
    height: 6.18rem;
    margin-top: -7.2rem;
    background: url("../../images/get-box-bg.png") no-repeat 0/100% 100%;
    /*background-position: 0 62%;*/
  }

  .receive-way.receive-success{
    position: absolute;
    top: 60%;
    left: 2rem;
    right: 1.96rem;
    z-index: 1005;
    font-size: .48rem;
    text-align: center;
    color: #9e3a1d;
  }
  .receive-way.receive-success {
    height: 6.18rem;
    margin-top: -7.2rem;
    background: url("../../images/get-box-bg.png") no-repeat 0/100% 100%;
    /*background-position: 0 62%;*/
  }


  /*.receive-success{
    background: url("../../images/get-box-bg.png") no-repeat 0/100% 56%;
    background-position: 0 62%;
  }*/
  .receive-way p{
    margin: 0.12rem auto 0 auto;
    font-size: 0.36rem;
  }
  .light{
    background: url("../../images/sparkle.png") no-repeat center/100% 100%;

    width: 8.35rem;
    height: 3.11rem;
    margin: 0 auto;
    position: absolute;
    top: -3.1rem;
    z-index: -1;
  }
  .receive-way .title {
    width: 4rem;
    height: 1.11rem;
    margin: -0.2rem auto .3rem;
    background: url("../../images/xj.png") 0/100% 100%;
  }
  .receive-success .title{
    background: url("../../images/xj-s.png") 0/100% 100%;
  }

  .receive-way .img {
    width: 2rem;
    height: 2rem;
    position: relative;
    padding: .15rem;
    margin: 0 auto .3rem;
  }

  .receive-way .img-border {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: url("../../images/img-border.png") 0/100% 100%;
  }

  .receive-way .name {
    padding: 0 .96rem;
    font-size: .42rem;
    line-height: .56rem;
    color: #fff;
    margin-bottom: .1rem;
  }

  .receive-way .feats-num {
    font-size: .45rem;
    height: 1.2rem;
    line-height: 1.2rem;
    color: #FCFF58;
  }

  .receive-way .feats-num span {
    display: inline-block;
    margin-right: .1rem;
    height: .68rem;
    width: .74rem;
    position: relative;
    top: .2rem;
    background: url("../../images/feats1.png") 0/100% 100%;
  }

  .receive-way .btn-group {
    padding: 1rem .66rem 0;
    display: flex;
    justify-content: space-between;
  }

  .receive-way .btn-group > div {
    width: 3.16rem;
    height: 1.06rem;
    line-height: 1.1rem;
    background: url("../../images/icon-btn.png") 0/100% 100%;
  }

  /*优众现金券弹框*/
  .cash-box{
    position: absolute;
    top: 0rem;
    left: 0;
    right: 0;
  }
  .cash{
    margin: 0 auto;
    width: 7.08rem;
    /*height: 2rem;*/
    padding: 0.1rem 0.4rem 0.4rem 0.4rem;
    background: url("../../images/cash-bg.png");
    background-size: 100% 100%;
  }
  .cash p{
    line-height: 0.5rem;
    font-size: 0.33rem;
    color: #fff;
  }
  .cash-title,.cash-tip{
    text-align: center;
  }
  .cash-title{
    margin: 0 auto 0.12rem auto !important;
    font-size: 0.42rem !important;
    color: #f3c562 !important;
  }
  .cash-tip{
    margin-top: 0.06rem;
    color: #dbc3b6 !important;
  }
/* tab切换部分 */
.record-tab {
  justify-content: space-between;
  display: flex;
  width: 100%;
  background: #5F4539;
}
.tabBox.hide {
  display: none;
  width: 100%;
  position: absolute;
  z-index: 2;
  top: 1.1rem;
  padding-right: .8rem;
}
.tabBox.hide.tabfixed {
  display: block;
}
.record-tab li {
  height: 1.28rem;
  width: 24.5%;
  background: #E3C299;
  padding: .09rem !important;
  text-align: center;
}
.record-tab li>div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;
  border: .03rem solid #D1B18A;
}
.record-tab li>div p.num {
  width: 100%;
  font-size: .33rem;
  color: #6e443a;
  line-height: .33rem;
}
.record-tab li>div p.statuName {
  width: 100%;
  font-size: .45rem;
  color: #272420;
}
.record-tab li.active {
  background: #FFD67C;
}
.record-tab li.active>div {
  border: .03rem solid #d79630;
}
.record-tit {
  font-size: .51rem;
  line-height: .51rem;
  padding: .6rem 0 .3rem 0;
  color: #e8bb53;
  text-align: center;
  text-shadow: .04rem .03rem .05rem #000;
}
</style>
