<template>
  <div class="prize-record align-c">
    <div class="prize-list">
      <div class="bg"></div>
      <ul>
        <li v-for="item in prizeList">
          <div class="info">
            <div class="can-exchange">{{item.text}}</div>
            <img :class="{yz: item.id == '6'}" :src="item.imgUrl" alt="" @click="goNextPage(item.id)">
            <div class="have-num">{{item.num}}{{item.id == '6' ? '元' : ''}}</div>
            <div class="text">累计获得</div>
          </div>
          <div class="btn" @click="openRecord(item.id)">记录</div>
        </li>
      </ul>
    </div>
    <div class="record-mask" v-show="recordShow">
      <div>
        <div class="title">{{recordTitle}}</div>
        <div class="rule-close pull-right" @click="closeRecord"></div>
        <ul class="record-list">
          <li v-for="item in recordList">
            <div class="record-con">
              <div class="align-l">
                <div class="box-type" v-if="item.chest_box.chest_type == 1">青铜宝箱</div>
                <div class="box-type" v-if="item.chest_box.chest_type == 2">白银宝箱</div>
                <div class="box-type" v-if="item.chest_box.chest_type == 3">黄金宝箱</div>
                <div class="box-type" v-if="item.chest_box.chest_type == 4">铂金宝箱</div>
                <div class="box-type" v-if="item.chest_box.chest_type == 5">注册宝箱</div>
                <div class="time">{{format(item.created_at)}}</div>
              </div>
              <div class="value">+{{item.chest_prize.num}}</div>
            </div>
            <div class="border"></div>
          </li>
        </ul>
        <div class="no-record" v-if="noRecordShow">
          <img src="../../images/no-record.png" alt="">
          <div>暂无获奖记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isApp: false,
        token: '',
        ihaveuToken: '',
        prizeList: [],
        recordShow: false,
        recordTitle: '',
        pageNo: 1,
        curId: '',
        isHttp: true,
        recordList: [],
        noRecordShow: false,
        isIphonex: false
      }
    },
    methods: {
      goNextPage: function (id) {
        switch (id) {
          case '2':
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
            break;
          case '3':
            if (this.isApp) {
              let url = window.location.href;
              window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/mallIndex?backHref=1';
            } else {
              let url = window.location.href;
              window.location.href = url.slice(0, url.indexOf('/box')) + '/card/#/down';
            }
            break;
          case '6':
            if (this.ihaveuToken) {
              window.location.href = 'http://touch.ihaveu.com/search?keyword=%E8%B6%85%E5%80%BC%E6%8E%A8%E8%8D%90&accessToken=' + this.ihaveuToken;
            } else {
              window.location.href = 'http://touch.ihaveu.com/search?keyword=%E8%B6%85%E5%80%BC%E6%8E%A8%E8%8D%90';
              /*let _this = this;
              this.toast("登录失效，请重新登录！")
              setTimeout(function () {
                _this.goLogin();
              }, 2000)*/
            }
            break;
        }
      },
      /*请求记录数据*/
      recordHttp: function (id) {
        if (this.isHttp) {
          this.isHttp = false;
          this.$http({
            method: 'get',
            url: '/api/chest_record_items/index?q[prize_type_eq]=' + id,
            params: {page: this.pageNo},
            headers: {accessToken: this.token}
          }).then(function (res) {
            let data = res.body;
            if (data.execErrCode == 200) {
              this.isHttp = true;
              if (data.execDatas.chest_record_items.length == 0) {
                this.isHttp = false;
              }
              if (this.pageNo == 1) {
                this.recordShow = true;
                this.$emit('openRecord', false);
                this.noRecordShow = false;
                if (!this.isIphonex) {
                  let html = document.documentElement, body = document.body, scrollTop = body.scrollTop;
                  html.style.overflow = 'hidden';
                  body.style.overflow = 'hidden';
                  body.className = 'body-fixed';
                  body.style.position = 'fixed';
                  body.style.top = scrollTop * -1 + 'px';
                }
                this.recordList = data.execDatas.chest_record_items;
                if (this.recordList.length == 0) {
                  this.noRecordShow = true;
                }
                this.$nextTick(function () {
                  document.getElementsByClassName('record-list')[0].scrollTop = 0;
                })
              } else {
                this.recordList = this.recordList.concat(data.execDatas.chest_record_items);
              }
              this.pageNo++;
            } else if (data.execErrCode == 4003) {
              this.goLogin();
            } else {
              this.toast(data.execMsg);
            }
          })
        }
      },
      openRecord: function (id) {
        this.curId = id;
        switch (id) {
          case '2':
            this.recordTitle = '入场券';
            break;
          case '3':
            this.recordTitle = '兑奖券';
            break;
          case '6':
            this.recordTitle = '优众红包';
            break;
        }
        this.recordHttp(id);
      },
      closeRecord: function () {
        this.recordShow = false;
        this.$emit('openRecord', true);
        this.pageNo = 1;
        this.isHttp = true;
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
      }
    },
    mounted(){
      let _this = this;
      if (navigator.userAgent.indexOf("jfjingbao") > -1) {
        this.isApp = true;
      }
      this.clientType(function () {
      }, function () {
        if (window.screen.height == 812) {
          if (_this.isApp) {
            _this.isIphonex = true;
          }
        } else {
          document.querySelector('#app>div>div').style.height = '100%';
        }
      })
      if (this.$route.query.token) {
        this.setCookie('intoToken', this.$route.query.token, 3)
      }
      if (this.$route.query.ihaveuToken) {
        this.setCookie('ihaveuToken', this.$route.query.ihaveuToken, 3)
      }
      this.token = this.getCookie('intoToken');
      this.ihaveuToken = this.getCookie('ihaveuToken');

      this.$http({
        method: 'get',
        url: '/api/chest_record_items/total',
        headers: {accessToken: this.token}
      }).then(function (res) {
        let data = res.body;
        if (data.execErrCode == 200) {
          let list = data.execDatas.total, prizeList = [];
          for (let i in list) {
            list[i] = {id: i, num: list[i]}
            switch (i) {
              case '2':
                list[i].imgUrl = require('../../images/rcq.png');
                list[i].text = '可抢兑奖品';
                break;
              case '3':
                list[i].imgUrl = require('../../images/djq.png');
                list[i].text = '可兑换奖品';
                break;
              case '6':
                list[i].imgUrl = require('../../images/yzhb.png');
                list[i].text = '可购买优众奢侈品';
                break;
            }
            prizeList.push(list[i]);
            this.prizeList = prizeList;
          }
        } else if (data.execErrCode == 4003) {
          this.goLogin();
        } else {
          this.toast(data.execMsg);
        }
      })

      let recordList = document.getElementsByClassName('record-list')[0];
      recordList.onscroll = function () {
        let scrollTop = recordList.scrollTop,
          scrollHeight = recordList.scrollHeight,
          clientHeight = recordList.clientHeight;
        if (scrollHeight - scrollTop - clientHeight <= 50) {
          _this.recordHttp(_this.curId);
        }
      }
    }
  }
</script>
<style scoped>
  .prize-record .prize-list {
    height: 5.58rem;
    padding: .6rem 0;
    position: relative;
    background: url("../../images/record-bg-t.png") no-repeat top/100% .72rem, url("../../images/record-bg-b.png") no-repeat bottom/100% .72rem;
  }

  .prize-record .prize-list .bg {
    height: 100%;
    background: url("../../images/record-bg-m.png") 0/100% auto;
  }

  .prize-record .prize-list ul {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: .36rem .45rem;
  }

  .prize-record .prize-list li {
    flex: 1;
  }

  .prize-record .prize-list li:nth-child(2) {
    margin: 0 .18rem;
  }

  .prize-record .prize-list .info {
    border: 1px solid #c69452;
    padding: .15rem 0 .18rem;
  }

  .prize-record .info img {
    width: 1.5rem;
    height: 1.65rem;
    margin: .18rem auto;
  }

  .prize-record .info img.yz {
    width: 1.8rem;
  }

  .prize-record .info .have-num {
    width: 2.7rem;
    height: .69rem;
    line-height: .7rem;
    border-radius: .35rem;
    background: #dbc19e;
    color: #d44400;
    font-size: .54rem;
    margin: 0 auto .06rem;
  }

  .prize-record .info .can-exchange, .prize-record .info .text {
    font-size: .33rem;
    color: #6e442a;
    line-height: 1;
  }

  .prize-record .info .text {
    font-size: .3rem;
  }

  .prize-record .prize-list .btn {
    width: 1.98rem;
    height: .84rem;
    line-height: .84rem;
    font-size: .45rem;
    color: #9e3a1d;
    margin: .24rem auto 0;
    background: url("../../images/record-btn.png") no-repeat 0/100% 100%;
  }

  .prize-record .record-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(0, 0, 0, .8);
  }

  .prize-record .record-mask > div {
    position: absolute;
    top: 8%;
    left: 1.15rem;
    right: 1.15rem;
    bottom: 6%;
    background: url("../../images/rule-bg.png") no-repeat 0/100% 100%;
  }

  .prize-record .record-mask .title {
    width: 4rem;
    height: 1.11rem;
    line-height: .96rem;
    font-size: .54rem;
    color: #f0c253;
    margin: -.18rem auto 0;
    background: url("../../images/title.png") no-repeat 0/100% 100%;
  }

  .prize-record .record-mask .rule-close {
    position: absolute;
    top: .3rem;
    right: -.6rem;
    width: 1.14rem;
    height: 1.14rem;
    background: url("../../images/icon-close.png") 0/100% 100%;
  }

  .prize-record .record-list {
    height: 85%;
    margin-top: .45rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .prize-record .record-list li {
    width: 9.41rem;
    margin: 0 auto;
  }

  .prize-record .record-list li .record-con {
    height: 1.8rem;
    display: flex;
    justify-content: space-between;
    padding: .39rem .45rem .42rem;
    line-height: 1;
  }

  .prize-record .record-con .box-type {
    font-size: .45rem;
    color: #fff;
    margin-bottom: .24rem;
  }

  .prize-record .record-con .time {
    font-size: .36rem;
    color: #f3c562;
  }

  .prize-record .record-con .value {
    line-height: 1.02rem;
    font-size: .6rem;
    color: #c24215;
  }

  .prize-record .record-list li .border {
    height: .06rem;
    background: url("../../images/record-border.png") no-repeat 0/100% 100%;
  }

  .prize-record .record-list li:last-child .border {
    display: none;
  }

  .prize-record .no-record {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -2.6rem 0 0 -2.25rem;
  }

  .prize-record .no-record img {
    width: 4.5rem;
    height: 4.5rem;
  }

  .prize-record .no-record div {
    font-size: .45rem;
    color: #ab8a67;
    margin-top: .09rem;
  }
</style>
