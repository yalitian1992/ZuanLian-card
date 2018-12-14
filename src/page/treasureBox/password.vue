<template>
  	<div class="passBg">
  		<div class="text">
  			<p>设置您的密码，您可以随时</p>
  			<p>查看奖品发放情况</p>
  		</div>
  		<div class="passWord">
  			<span>密码：</span>
  			<input type="password" />
  		</div>
  		<div class="test" style="background: #fff;">
  			<p style="font-size: .45rem;">
  				<count-down  :callback="callback" endText="已经结束了"></count-down>
  			</p>
  		</div>
  	</div>
</template>
<script>
  import '../../components/common/public.js'
  import '../../components/time/time.vue'
  import countDown from '../../components/time/time.vue'
  import {imgBaseUrl} from '../../config/config'
  export default{
    data (){
      return {
       endTime:'倒计时',
       callback:null,
       endText:'已经结束了'
      }
    },
    methods: {
  		
    },
    components: {
    	countDown
    },
    mounted(){
      //console.log(this.endTime)
    }
  }
</script>
<style scoped>
  .passBg{
  	width: 100%;
  	height: 100%;
  	background: url(../../images/passBj.jpg) no-repeat center / contain;
  	padding-top: 22%;
  }
  .text{
  	font-size: .45rem;
  	text-align: center;
  	color: #fff;
  }
  .passWord{
  	margin: 0 auto;
  	margin-top: 2.12rem;
  	width: 7.95rem;
  	height: 1.20rem;
  	border: #B17834 1px solid;
  	/*border-top-left-radius:50%;
  	border-bottom-left-radius:50%;*/
  }
  .passWord span{
  	font-size: .45rem;
  	color: #fff;
  }
  .passWord input{
  	background: none;
  }
</style>
