<template>
  <span :endTime="endTime" :callback="callback" :endText="endText">
    <slot>
      {{content}}
    </slot>
  </span>
</template>
<script>
  export default {
    data(){
      return {
      content: '',
      time:'',
      timeEnd:""
      }
    },
    props:{
      endTime:{
        type: String,
        default :''
      },
      endText:{
        type : String,
        default:'已结束'
      },
      callback : {
        type : Function,
        default :''
      }
    },
    mounted () {
    	 this.$http({  //奖品回收列表
              method: 'get',
              url: '/api/recoveries',
              params: {page: 1},
           }).then(function (res) {
            	 this.timeEnd= this.GMTToStrTwo(res.body.execData.recoveries[0].time_end)
//          	 console.log("end")
            })
     let Time = new Date();
    },
    methods: {
    	GMTToStrTwo:function(time){
				    let date = new Date(time);
				    let times={};
				    
				    let Str=date.getFullYear() + '/' +
				    (date.getMonth() + 1) + '/' + 
				    date.getDate() + ' ' + 
				    date.getHours() + ':' + 
				    date.getMinutes() + ':' + 
				    date.getSeconds();
				   // let timeStars=new Date(Str.slice(0,9)+" "+'0:0:0');
				    //this.timeCha=new Date(Str).getTime()-new Date(Str.slice(0,9)+" "+'0:0:0').getTime()
				   // console.log(new Date(Str).getTime())
				   times.end=Str
//				    console.log(times)
				    return Str
				},
      countdowm(timestamp){
//      	console.log(timestamp)
      let self = this;
      var _this=this;
      window.timer2 = setInterval(function(){
        let nowTime = new Date();
        let endTime = new Date(_this.timeEnd);
         //console.log(new Date(_this.timeEnd))
        let t = endTime.getTime() - nowTime.getTime();
       
        if(t>0){
          let day = Math.floor(t/86400000);
          let hour=Math.floor((t/3600000)%24);
          let min=Math.floor((t/60000)%60);
          let sec=Math.floor((t/1000)%60);
          hour = hour < 10 ? "0" + hour : hour;
          min = min < 10 ? "0" + min : min;
          sec = sec < 10 ? "0" + sec : sec;
          let format = '';
          if(day > 0){
            format = `${day}天${hour}小时${min}分${sec}秒`;
          }
          if(day <= 0 && hour > 0 ){
            format = `${hour}:${min}:${sec}`;
          }
          if(day <= 0 && hour <= 0){
            format =`${min}:${sec}`;
//            console.log(format)
          }
          console.log(self.content)
          self.content = format;
          }else{
           clearInterval(timer2);
           self.content = self.endText;
           self._callback();
          }
         },1000);
        },
        _callback(){
        if(this.callback && this.callback instanceof Function){
           this.callback(...this);
         }
      }
    },
    beforeDestroy: function () {
      clearInterval(window.timer2)
    }
  }
</script>
