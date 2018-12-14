<template>
  <!--左边气泡通知-->
  <div class="icp">
        <ul>
          <li>
            <div class="dv1"><a href="tel:022-25760131"><span class="icon icon-phone"></span>联系电话：022-25760131</a></div>
            <div><span class="icon icon-qq"></span>在线QQ：4009005670</div>
          </li>
          <li>地址：天津市滨海新区中心商务区新华路3699号双创大厦9层</li>
          <li>
            <p>天津微卡互动科技有限公司版权所有</p>
            <p>津ICP备17006879号</p>
            <p>津公网安备 12010702000160号&nbsp;&nbsp;&nbsp;&nbsp;津文执网文【2017】7622-022号</p>
          </li>
        </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        
      }
    },
    methods: {
      
    },
    mounted(){
      
    }
  }
</script>
<style scoped>
  .icp {
    overflow: hidden;
    background: #260302;
    color: #fff;
    font-size: .4rem;
    text-align: center;
  }
  .icp ul li:nth-child(1) {
    height: 1.6rem;
    line-height: 1.6rem;

  }
  .icp ul li:nth-child(1)>div {
    height: 1.6rem;
    width: 50%;
    float: left;
    position: relative;
  }
  .icp ul li:nth-child(1)>div.dv1:after {
    position: absolute;
    content: "";
    display: block;
    height: 100%;
    width: 1px;
    right: 0;
    top: 0;
    background: url(../../images/icp-line-shuxian.png) no-repeat center/contain;
  }
  .icp ul li {
    opacity: .7;
    position: relative;
  }
  .icp ul li a {
    color: #fff;
  }
  .icp ul li:nth-child(2) {
    height: 1.8rem;
    line-height: 1.8rem;
  }
  .icp ul li:nth-child(3) {
    padding: .5rem 0;
    line-height: .56rem;
  }
  .icp ul li:after {
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: 0;
    background: url(../../images/icp-line-hangxian.png) no-repeat center/contain;
  }
  .icp ul li:last-child:after {
    position: absolute;
    content: "";
    display: none;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: 0;
    background: url(../../images/icp-line-hangxian.png) no-repeat center/contain;
  }
  .icon {
    display: inline-block;
    position: relative;
    width: .65rem;
    height: .39rem;
    top: .02rem;
  }
  .icon.icon-phone {
    background: url(../../images/icp-phone.png) no-repeat center/contain;
  }
  .icon.icon-qq {
    background: url(../../images/icp-qq.png) no-repeat center/contain;
  }
</style>
