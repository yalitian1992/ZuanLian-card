<template>
  <div class="BuyRecord-box PayStatus-box">
    <div class="header">
      <p>支付成功</p>
      <!--<p>支付失败</p>-->
    </div>
    <div class="PayStatus-mainBox">
      <!--支付成功-->
      <div class="PayStatus-Success">
        <div class="successBox">
          <img src="../../images/icon-success.png">
          <p>您已支付成功!<span class="font-pink"></span></p>
          <a href="zuanlianforwardkey://zuanlian.game.goodsPay">返回</a>
        </div>
      </div>
      <!--支付失败-->
      <!--<div class="PayStatus-Failure">
        <img src="images/icon-failure.png">
        <p>您使用招商银行支付订单失败</p>
        <p>请查看支付账单和相关数据</p>
        <div>
          <a href="/pro-list.html" class="bg-red">稍后再说</a>
          <a href="javascript:void(0);" class="bg-red" id="pay_btn">重新充值</a>
        </div>
        <p class="Pay-query" ><span>客服咨询电话：</span><a href="tel:400-400-400">400-881-6609</a></p>
      </div>-->
    </div>
  </div>
</template>
<script>
  import '../../components/common/public.js'
  import {imgBaseUrl} from '../../config/config'
  export default{
    data (){
      return {

      }
    },
    methods: {

    },
    components: {},
    mounted(){

    }
  }
</script>
<style scoped>
  html,body{
    height: 100% !important;
  }
  .PayStatus-box {
    overflow: hidden;
  }
  .BuyRecord-box {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: white;
  }
  .PayStatus-box > .header {
    border-bottom: 1px solid #d1d1d3;
  }
  .header {
    width: 100%;
    height: 46px;
    position: relative;
    background: #fff;
  }
  .header > p {
    text-align: center;
    font-size: 18px;
    line-height: 46px;
  }
  .PayStatus-mainBox {
    margin: 28% auto 0;
    width: 100%;
  }
  .PayStatus-Success a {
    color: #3a3e4a;
    width: 70%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 5px;
    display: block;
    background: #fff;
    margin: 72px auto 0;
    font-size: 16px;
    border: 1px solid #3a3e4a;
  }
  .successBox img{
    margin: 0 auto;
    width: 3rem;
    height: 3rem;
  }
  .successBox p{
    margin-top: 0.3rem;
    font-size: 0.5rem;
    text-align: center;
  }

</style>
