<template>
  <div>
    <redRain></redRain>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/config'
  import redRain  from '../../components/redRain/redRain.vue'
  export default {
    data () {
      return {

      }
    },
    methods: {

    },
    components: {
      redRain
    },
    mounted(){

    },

    beforeDestroy: function () {
      clearInterval(window.timer1)  //步与步
      clearInterval(window.timer2)  //单步
      clearInterval(window.fiveTimer)    //五分钟刷新数据
    }
  }
</script>
<style scoped>
  img {

    width: auto!important;
  }
</style>
