<template>
  <div class="main" :class="{iphonex: isIphonex,ios:isIos}">
    <div class="pre-box">
      <div class="topHeight" :class="{iphonex: isIphonex&&appOpen}" @click="setCookie('directIn', 'noDirectIn', 1);goBack();">
        <p class="go-back"></p>
      </div>
      <div class="rec-box">
        <div class="title">
          <p>提现记录</p>
        </div>
        <div class="rec-content-bg">
          <ul class="rec-content" id="scrollBox">
            <li class="hb" v-for="(item,index) in list">
              <div class="lc">
                <p class="fc">奖金提现</p>
                <span>{{item.create_time}}</span>
              </div>
              <div class="rc">
                <p class="fc">{{item.amount}}元</p>
                <span class="f-red" v-if="item.status == 'transfer'">审核中</span>
                <span class="f-gray" v-if="item.status == 'complete'">已到账</span>
                <span class="f-gray" v-if="item.status == 'cancel'">已取消</span>
              </div>
            </li>

            <div :class="{noRecord: true, display: display}">
              <span></span>
              <p>暂无记录</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  export default {
    data () {
      return {
        isIphonex: false,      //是否是iPhonex
        isIos: false,
        appOpen:false,
        page: 1,
        list: [],
        isHttp: true,
        display: false
      }
    },
    methods: {

//      提现列表
      Present: function(){
        if(this.isHttp){
          this.isHttp = false

          this.$http({
            method: 'get',
            url: '/api/withdrawals_orders',
            headers: {accessToken: this.getCookie('intoToken')},
            params: {page: this.page}
          }).then(function(res){
            let data = res.body
            if(data.execErrCode == 200){
              this.isHttp = true;
              if(data.execDatas.length == 0){
                this.display = true
              }else{
                if(this.page == 1){
                  this.list = data.execDatas
                }else{
                  this.list = this.list.concat(data.execDatas);
                }
                this.page++
              }
            }else if(data.execErrCode == 4003){
              this.goLogin()
            }else{
              this.display = true
            }
          })
        }
      }
    },
    components: {

    },
    mounted(){
      var _this = this
//      iphoneX适配
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

      var boxElm = document.getElementById("scrollBox")
      if(boxElm.scrollHeight - boxElm.scrollTop - boxElm.clientHeight <= 50) {
        _this.Present();
      }

    }
  }
</script>
<style scoped>

  .display{
    display: block !important;
  }
  .noRecord{
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 30%;
  }
  .noRecord span{
    display: block;
    margin: 0 auto;
    width: 3.6rem;
    height: 3.6rem;
    background: url("../../images/no-content-icon.png") no-repeat center/contain;
  }
  .noRecord p{
    margin-top: 0.45rem;
    font-size: 0.45rem;
    color: rgb(39,36,32);
    text-align: center;
  }

  /* 两端对齐 */
  .hb {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    /*justify-content: left;*/
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

  .fc{
    color: rgb(39,36,32)
  }
  .f-red{
    color: rgb(212,68,0)
  }
  f-gray{
    color: rgb(102,102,102)
  }
  .pre-box,.rec-box{
    height: 100%;
  }
  .pre-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10% 5% 9% 5%;
    background: url("../../images/box-bg.jpg");
    background-size: 100% 100%;
  }
  .topHeight{
    position: absolute;
    top: 0;
    left: 0;
    width: 1.8rem;
    height: 1.6rem;
    padding: .2rem 0 0 .4rem;
    z-index: 2;
  }
  .go-back{
    width: 0.9rem;
    height: 0.9rem;
    background: url("../../images/go-back.png");
    background-size: 100% 100%;
  }
  .rec-box{
    position: relative;
    padding: 1.1rem 0.4rem 0.8rem 0.4rem;
    background: url("../../images/brown-bg.png");
    background-size: 100% 100%;
  }
  .rec-box .title{
    position: absolute;
    top: -0.4rem;
    left: 0;
    right: 0;
  }
  .rec-box .title p{
    margin: 0 auto;
    width: 80%;
    height: 1.3rem;
    line-height: 1.04rem;
    font-size: 0.51rem;
    color: #ffe9a6;
    text-align: center;
    background: url("../../images/win-title-bg.png");
    background-size: 100% 100%;
  }
  .rec-content-bg{
    width: 100%;
    height: 100%;
    padding: 0.6rem 0.4rem;
    background: url("../../images/rec-bg.png") no-repeat center/100% 100%;
  }
  .rec-content{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    border: 1px solid rgb(198,148,82);
  }
  .rec-content li{
    padding: 0.48rem 0.3rem 0 0.3rem;
  }
  .rec-content li:after
  {
    content:" ";
    width: 100%;
    height: 1px;
    background: url("../../images/border-bottom.png") no-repeat center/100% 100%;
  }

  .rec-content li span{
    display: block;
    margin-bottom: 0.48rem;
    font-size: 0.36rem;
  }
  .rec-content li p{
    margin-bottom: 0.3rem;
  }
  .rec-content .lc>p{
    font-size: 0.48rem;
  }
  .rec-content .lc>span{
    color: rgb(110,68,42)
  }
  .rec-content .rc>p{
    margin-top: -0.16rem;
    font-size: 0.6rem;
  }
  .rec-content .rc>span{
    width: 100%;
    text-align: right;
  }
</style>
