<template>
  <div>
    <div class="bottom-bg" :class="{ios: isIos}"></div>
    <div class="mu-l-r" :class="{ios: isIos}"></div>
    <div class="mu-t" :class="{ios: isIos}"></div>
    <div class="mu-b" :class="{ios: isIos}"></div>
    <div class="bg-box-shadow" :class="{ios: isIos}"></div>
    <div class="back-btn" :class="{ios: isIos}" @click="goBack()"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isIos: false       //是否是iPhone
      }
    },
    mounted(){
      let _this = this;
      _this.clientType(function () {
      }, function () {
        if (window.screen.height != 812) {
          _this.isIos = true;
        }
      })
    }
  }
</script>

<style scoped>
  .back-btn.ios {
    position: absolute;
  }

  .bottom-bg, .mu-l-r, .mu-t, .mu-b, .bg-box-shadow {
    position: fixed;
    z-index: 111;
  }

  .bottom-bg.ios, .mu-l-r.ios, .mu-t.ios, .mu-b.ios, .bg-box-shadow.ios {
    position: absolute;
  }

  .bottom-bg {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: url("../../images/bottom-bg.jpg") no-repeat 0/100% 100%;
  }

  .mu-l-r {
    top: 3rem;
    left: .81rem;
    right: .75rem;
    bottom: 2.16rem;
    z-index: -1;
    background: url("../../images/mu-l.jpg") no-repeat left/.58rem 100%, url("../../images/mu-r.jpg") no-repeat right/.58rem 100%;
    background-color: #c5bdb3;
  }

  .mu-t {
    top: 0;
    left: .45rem;
    right: .45rem;
    height: 3.06rem;
    background: url("../../images/mu-t-bg.jpg") no-repeat 0/100% 100%;
  }

  .mu-b {
    left: .81rem;
    right: .75rem;
    bottom: 0;
    height: 2.16rem;
    background: url("../../images/mu-b-bg.jpg") no-repeat 0/100% 100%;
  }

  .bg-box-shadow {
    top: 3.06rem;
    left: 1.33rem;
    right: 1.33rem;
    box-shadow: 0 0 2px 0.02rem #000;
  }
</style>
