<template>
  <div>
    <router-view></router-view>
    <redRain v-if="!isApp"></redRain>
  </div>
</template>

<script>
  import './config/rem.js'
  import redRain  from './components/redRain/redRain.vue'
  export default {
    data(){
      return {
        isApp: true
      }
    },
    mounted: function () {
      var url = window.location.href;
      url = url.substring(0, url.indexOf("#"))
      localStorage.setItem("url", url);
      let bodyStyle = document.body.style, htmlStyle = document.documentElement.style;
      this.clientType(function () {
        bodyStyle.overflow = 'hidden';
        bodyStyle.overflowY = 'scroll';
        htmlStyle.overflow = 'hidden';
        htmlStyle.overflowY = 'scroll';
      }, function () {
        if (window.screen.height != 812) {
          htmlStyle.height = '100%';
          bodyStyle.height = '100%';
          bodyStyle.position = 'relative';
          let app = document.getElementById('app'), appDiv = app.getElementsByTagName('div')[0];
          app.style.height = '100%';
          appDiv.style.height = '100%';
        }
      })
    },
    components: {
      redRain
    },
    mounted(){
      let _this = this;
      if (navigator.userAgent.indexOf("jfjingbao") <= -1) {
        _this.isApp = false;
      }
      window.updateRecord = function () {
        _this.$router.go(0);
      }
    }
  }
</script>

<style>
  @import './style/common.css';
</style>
