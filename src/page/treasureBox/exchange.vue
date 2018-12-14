<template>
 
    <div class="main" :class="{iphonex: isIphonex,ios:isIos }">
    <!--背景图-->
   <div class="pre-box">
    	
     	 <div class="topHeight" :class="{iphonex: isIphonex&&appOpen}" @click="returnBack">
        <p class="go-back"></p>
      </div>
       <div class="win-record-box vc">
        <div class="title">
          <p>道具回收</p>
        </div>
        
        <div class="main_box">
       		<ul  v-if="haveList" class="height_box">
       			<li class="recovery_list"  v-for="(item,index) in list">
       			<div class="text"  v-if="haveList">
		        	<p>回收时间:{{GMTToStr(item.time_begin).slice(0,5)}}-{{GMTToStr(item.time_end).slice(0,5)}}</p>
		        </div>
       			<div class="recovery_title">
       				<div class="recovery_img"><img :src="imgBaseUrl() +item.chest_prize.t114" /></div>
       				<p>{{item.name}}</p>
       			</div>
       			<div  class="starShow" v-if="item.status==101">
       					<p>距回收开始</p>
       					
       					<p><count-down  :endTime="item.time_begin" :callback="upDate" endText=""></count-down></p>
       					
       			</div>
       			<div  class="starShow" v-if="item.status=='0'">
       					<p>距回收结束</p>
       					
       					<p><count-down  :endTime="item.time_end" :callback="upDate" endText=""></count-down></p>
       			</div>
       			<div  class="starShow" v-if="item.status=='102'">
       					<p style="line-height: 1rem;">今日回收已结束</p>
       			</div>
       			<div class="recovery_price">
       				<div class="price_text">
       					<p >今日回收瓜分{{Math.floor(item.total_cost)}}元</p>
       				</div>
       				<div class="conduct">
       					<div>
       						<p>已销毁总量(张)</p>
       						<span v-if="item.status!=101">{{item.total_count}}</span>
       						<span v-if="item.status==101">-- </span>
       					</div>
       					<i></i>
       					<div>
       						<p>当前价格(元/张)</p>
       						<span v-if="item.status!=101">{{Number((Math.floor(item.total_cost)/(item.total_count?item.total_count:1)).toString().match(/^\d+(?:\.\d{0,2})?/))}}</span>
       						<span v-if="item.status==101">--</span>
       					</div>
       				</div>
       				<!--<p><span class="price_num">￥{{Math.floor(item.total_cost)}}</span><span class="small">现金</span></p>-->
       			</div>
       			<div class="jilu">
       				<div class="L_list">
       					今日您销毁：<span>{{item.today_total_count}}张</span>
       				</div>
       				<p @click="jilu(item.id)">销毁记录<i></i></p>
       			</div>
       			<!--销毁未开始-->
       			<div class="wait">
       				<div class="Subtitle">
       					<div style="font-size: .45rem;line-height: 0;padding-top: .5rem;margin-bottom:.3rem;text-align: center;color: #6E442A;">今日最终价<span v-if="item.status==102">(元/张)</span></div>
       					<p v-if="item.status!=102">?</p>
       					<p v-if="item.status==102">{{Number((Math.floor(item.total_cost)/(item.total_count?item.total_count:1)).toString().match(/^\d+(?:\.\d{0,2})?/))}}</p>
       				</div>
       				<div class="next_text">
       					
       					<p>实际回收金额请以最终截止时间为准</p>
       				</div>
       				<div class="border_fist">
       					
       				</div>
       				<div class="Chart">
       					<p class="Chart_text">回收价格趋势（元/张）<span :class="{down:item.formStatus}" @click="chartDown(index)"></span></p>
       					<div class="Chart_box" v-if="item.formStatus">
       						<p class="Chart_top">
       							<span>日期</span>
       							<span v-for="item1 in item.rule_recover_history_prices">{{item1.day.slice(5,7)}}/{{item1.day.slice(8,10)}}</span>
       						</p>
       						<p class="Chart_down">
       							<span>价格</span>
       							<span v-for="item1 in item.rule_recover_history_prices">{{item1.price>0?Number(item1.price.toString().match(/^\d+(?:\.\d{0,2})?/)):'-'}}</span>
       							
       						</p>
       					</div>
       				</div>
       			</div>
       			<div class="btn" @click="giveUp(item.chest_prize_type,item.name,Math.floor(item.total_cost),item.total_count,item.chest_prize.t114,item.id)" v-if="item.status==0">销毁道具</div>
       			<div class="btn noBtns" v-if="item.status!=0" style="color: #999;">销毁道具</div>
       		</li>
       
       		
       	</ul>
       	 <div class="noList" v-if="!haveList">
       		<div></div>
	       		<p>今日未开启道具回收</p>
	       		<p>请明日再来</p>
	       </div>
       	</div>
      
       <div class="goMonny" @click="goMonny">
       	<div class="m_img"></div>
       </div>
       </div>
      <div class="ruls_btn" @click="openRuls">
      	<p></p>
      	<span>规则</span>
      </div>
     
    </div>
    <!--返回按钮-->
    <!--<div class="back-btn" v-if="backBtnShow" @click="goBack()"></div>-->
     
    <!--选择数量弹框-->
    <div class="choice" v-if="choiceNum"><!--choiceNum-->
    	<div class="receive-way">
          <div class="title">销毁道具</div>
          <div class="choice_img">
      			<img :src="imgBaseUrl() +smallImg"  />
      		</div>
      		<div class="choice_name">{{chestname}}</div>
      		<div class="choice_num">可销毁数量：{{countNum}}</div>
      		<div class="border"></div>
      		<div class="choice_title">选择销毁数量</div>
      		<div class="choice_btn">
      			<span @click="jianTen">
      				<i></i>
      				<b>10</b>
      			</span>
      			<span @click="jianNum">
      				<i></i>
      			</span>
      			<span><!--数字-->
      				{{numbers}}/{{countNum}}
      			</span>
      			<span @click="addNum">
      				<i></i>
      			</span>
      			<span @click="addTen">
      				<i></i>
      				<b>10</b>
      			</span>
      		</div>
      		<!--<div class="f_text">
      			预计可得兑现：<span>{{price}}元</span>
      		</div>-->
      		<!--<div class="text_tree">实际兑换金额以最终价为主</div>-->
      		<div style="clear: both;margin-top: 2.15rem;">
      			<div class="l_btn" @click="whole(numbers)">销毁已选道具</div>
      			<div class="r_btn" @click="whole(countNum)">销毁所有道具</div>
      		</div>
      		<div class="clonse" @click="cloneBox"></div>
      </div>
      
    </div>
    <!--无可销毁-->
    <div class="choice" v-if="noChoice">
    	<div class="receive-way no_choice">
          <div class="title">销毁道具</div>
          <div class="text_four">
          	<p >暂时没有可销毁的道具</p>
          	<p >您可以通过<span>开启宝箱</span>获得</p>
          </div>
          <div class="open_btn" ><router-link :to="{ path: 'openBox' }">去开宝箱</router-link></div>
      		<div class="clonse" @click="cloneBox"></div>
      </div>
      
    </div>
     <!--销毁记录-->
    <div class="choice " v-if="jiluShow">
    	<div class="receive-way jiluList">
          <div class="title">今日销毁记录</div>
          <div class="clonse" @click="cloneBox"></div>
          <div class="maxList" v-if='!nojilu'>
          		<div class="text_four jiluText" v-for="item in destroy">
          			<p class="border" style="width: 100%;"></p>
		          	<p >销毁{{item.count}}张</p>
		          	<p >{{item.created_at}}</p>
		          	<div class="kong" style="height: .51rem;"></div>
		          	
		          </div>
          </div>
           <div class="maxList" v-if="nojilu">
		          	<p style="line-height: 6rem;color: #fff;">暂无记录</p>
          	</div>
      		
      </div>
      
    </div>
    <!--销毁成功-->
    <div class="choice" v-if="choiceOk">
    	<div class="receive-way no_choice">
          <div class="title">销毁道具</div>
          <div class="text_five">
          	<p >本次成功销毁<span>{{params.count}}</span>张</p>
          </div>
      		<div class="clonse" @click="cloneBox"></div>
      </div>
      
    </div>
    <!--道具销毁规则-->
    <div class="choice" v-if="rule">
    	<div class="receive-way " style="top: 58%;height: 60%;">
          <div class="title title_ruls">道具销毁规则</div>
          <div class="rule_text">
          	 <h4>Q：什么是道具销毁？</h4>
		          <p>A：“道具销毁”由集分竞宝平台发起，用户可以销毁指定的持有道具，将其兑换为奖金。</p>
		
		          <h4>Q：销毁道具能给多少钱？</h4>
		          <p>A：用户每日销毁获得的奖金=每日销毁道具数量 × 每日最终价（当奖金小于0.01元时，不会获得奖金）</p>
		
		          <h4>Q：什么是每日最终价？</h4>
		          <p>A：集分竞宝平台每天对每种销毁道具放出一定金额，该金额为此类道具当日的销毁总价，该道具的每日最终价=销毁总价/当日销毁持有量</p>
		
		          <h4>Q：我选择了销毁道具，为什么没有给我奖金？</h4>
		          <p>A：每种道具销毁有一定时间周期，时间倒计时结束后，系统会统计每位用户所得奖金，并进行发放。</p>
		
		          <h4>Q：在哪儿查看我的奖金？</h4>
		          <p>A：成功完成“道具销毁”后，您的奖金会直接发放至“我的钱包”。您可以通过“道具销毁”页面点击“我的钱包”进行查看，也可在集分竞宝APP首页点击头像选择“我的钱包”。</p>
		
		          <h4>Q：获得的奖金能干什么？</h4>
		          <p>A：当您钱包中的奖金累积达到最低提现额度时，您可以将奖金提现到您的支付宝账户中，并自由支配奖金的使用。（关于提现具体操作请查看“我的钱包”内【提现帮助】）</p>
          </div>
      		<div class="clonse" @click="cloneBox"></div>
     </div>
    </div>
    <!--获得奖励-->
    <div class="choice" v-if="Prompt">
    	<div class="receive-way obtain" >
    			<div class="fag"></div>
          <div class="title">恭喜获得</div>
          <div class="text_six">
          	<p>获得奖金：<span>￥{{yesterday}}</span></p>
          	<p>注：满5元可提现</p>
          	<p>{{yestDate}}</p>
          </div>
          <div class="open_btn" @click="setlocal('openShow',1,1)">确定</div>
      		<div class="clonse" @click="cloneBox"></div>
      </div>
      
    </div>
    </div>
</template>

<script>
	 import {imgBaseUrl, yZBaseUrl, mediaUrl} from '../../config/config'
	 import countDown from '../../components/time/timeStar.vue'
	 import countEnd from '../../components/time/timeEnd.vue'
  export default {
    data() {
      return {
      	imgBaseUrl,
      	timeShow:false,//倒计时显示
      	chartShow:false,//表格显示
      	noticeShow: false,   //头部通知是否显示
      	backBtnShow: true,  //返回按钮是否显示
      	exchangeShow: false, //兑换宝箱符弹框是否显示
      	isIphonex: false,    //是否是iPhoneX
        isApp: false,        //是否是APP内部打开页面
        isShake: false,      //是否抖动
        appOpen:false,
       	list:[],//销毁列表
       	Prompt:false,//获得奖励
       	rule:false,//销毁规则
       	choiceOk:false,//销毁成功
       	noChoice:false,//无可销毁
       	choiceNum:false,//选择销毁数量
       	numbers:1,//用户选择销毁数量
       	chestname:'',//销毁名称
       	jiluShow:false,//销毁记录
       	price:0,//销毁价格
       	countNum:0,//可销毁总数
       	starTime:'',//开始时间
       	endTime:'',//结束时间
       	timeTShow:false,//结束倒计时
       	timeShowF:false,//开始前倒计时   进行中
       	timeShowL:false,//开始前
       	endShow:false,
       	smallImg:'',
       	params:{},
       	haveList:false,
       	noBtn:false,
				yesterday:0 ,//昨日收益
				yestDate:'',
				isIos:false,
				content:[],
				nojilu:false,//暂无记录
				destroy:null//销毁记录
      }
    },
    components: {
	 	 countDown,
	 	 countEnd
 	 },
    methods: {
    	 /*打开规则弹框*/
      openRule: function () {
        this.ruleShow = true;
        if (!this.isIphonex) {
          let html = document.documentElement, body = document.body, scrollTop = body.scrollTop;
          html.style.overflow = 'hidden';
          body.style.overflow = 'hidden';
          body.className = 'body-fixed';
          body.style.position = 'fixed';
          body.style.top = scrollTop * -1 + 'px';
        }
      },
      
      chartDown:function(index){
      	this.list[index].formStatus=!this.list[index].formStatus
      },
      timeEnd:function(){
      	this.noBtn=true
		    this.timeShowF=true
		    this.timeShowL=false
      	this.upDate()
      },
      timeTwo:function(){
      	
				this.noBtn=false
		    this.timeTShow=true
		    this.endShow=true
		    this.timeShowF=false
		    this.upDate()
      },
      cloneBox:function(){//关闭弹框
      	this.Prompt=false
       	this.rule=false
       	this.choiceOk=false
       	this.noChoice=false
       	this.choiceNum=false
       	this.numbers=1
       	this.jiluShow=false
       	this.nojilu=false
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
      },
      giveUp:function(id,name,jine,num,img,activity){//销毁道具
//    	console.log(activity)
      	this.smallImg=img
      	this.chestname=name
      	this.params.chest_prize_type=id
      	this.params.recovery_id=activity
      	if(num==0){
      		this.price=jine
      	}else{
      		this.price=Number((jine/num).toString().match(/^\d+(?:\.\d{0,2})?/))
      	}
      	this.$http({  //奖品销毁列表
              method: 'get',
              url: '/api/recoveries/prize_count',
              params: {chest_prize_type: id},
              headers: {accessToken: this.token},
            }).then(function (res) {
            	if (res.body.execErrCode == 200) {
            		this.countNum=res.body.execData.count
	            	 if(res.body.execData.count==0){
	            	 	this.noChoice=true
	            	 	//this.choiceNum=true
	            	 }else{
	            	 	this.choiceNum=true
	            	 }
            	}else if(res.body.execErrCode==4003){
//          		console.log("5454")
            		this.goLogin();
            		
            	}else{
            		this.toast(res.body.execMsg);
            	}
            })
      },
      goBox:function(){
      	if(this.$route.query.native==0){
      		this.returnBack()
      	}else{
      		this.$router.replace({path: '/openBox',query:{ native: 0}});
      	}
      	 
      },
      goMonny:function(){
      		this.$router.push({path: '/prizeList',query:{ native: 0}});
      },
      addNum:function(){//+1
      	if(this.numbers>=this.countNum){
      		this.numbers=this.countNum
      	}else{
      		this.numbers++
      	}
      },
      jianNum:function(){
      	if(this.numbers<=1){
      		this.numbers=1
      	}else{
      		this.numbers--
      	}
      },
      addTen:function(){
      	if(this.numbers>=this.countNum-10){
      		this.numbers=this.countNum
      	}else{
      		this.numbers+=10
      	}
      },
      jianTen:function(){
      	if(this.numbers<=10){
      		this.numbers=1
      	}else{
      		this.numbers-=10
      	}
      },
      whole:function(num){
//    	console.log(num)
      	var _this = this;
      	_this.params.count=num
      	if(num>0){
      		this.$http({
	          method: 'post',
	          url: '/api/recoveries/exchange_cash',
	          params:_this.params,
	          headers: {accessToken: this.token},
	        }).then(function (res) {
	          let data = res.body;
	          if (data.execErrCode == 200) {
	          	_this.choiceNum=false
	          	_this.choiceOk=true
	          	_this.upDate()
//	            console.log(res)
	          }else{
	          	_this.toast(data.execMsg);
	          }
	        })
      	}
        
      },
      openRuls:function(){
      	this.rule=true
      },
      GMTToStr:function(time){
				    let date = new Date(time)
				    var Hours,Minutes,Seconds;
				    if(date.getHours()>9){
				    	Hours=date.getHours()
				    }else{
				    	Hours="0"+date.getHours()
				    }
//				    console.log(date.getMinutes())
				    if(date.getMinutes()>9){
				    	Minutes=date.getMinutes()
				    }else{
				    	Minutes="0"+date.getMinutes()
				    }
				    if(date.getSeconds()>10){
				    	Seconds=date.getSeconds()
				    }else{
				    	Seconds="0"+date.getSeconds()
				    }
				    let str=Hours+':'+Minutes+':'+Seconds;
						return str
				},
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
			/*返回*/
			returnBack:function(){
			  if(this.$route.query.native == 0){
			    this.setCookie('directIn', 'noDirectIn', 1);
			  }
			  this.goBack();
			},
			jilu:function(type){//记录
				this.jiluShow=true
				this.$http({
	          method: 'get',
	          url: '/api/recoveries/recovery_items',
	          params:{recovery_id:type},
	          headers: {accessToken: this.token},
	        }).then(function (res) {
	          let data = res.body;
	          if (data.execErrCode == 200) {
	          	this.destroy=data.execDatas
	          	 console.log(data.execDatas)
	          	if(data.execDatas.length==0){
	          		this.nojilu=true
	          	}else{
	          		this.nojilu=false
	          		this.destroy=data.execDatas
	          	}
	          	 
	          }else{
	          	_this.toast(data.execMsg);
	          }
	        })
			},
//			yesBtn:function(){
//				this.cloneBox()
//				//this.setCookie('openShow', '1', 1);
//			},
		  setlocal: function (key, value, days) {
		  	
		  	this.cloneBox()
        // 设置过期原则
        //console.log(value)
        if (!value) {
          localStorage.removeItem(key)
        } else {
          var Days = days || 1; // 默认保留7天
          var exp = new Date();
          localStorage[key] = JSON.stringify({
            value,
            expires: exp.getTime() + Days * 24 * 60 * 60 * 1000
          })
        }
      }, 
      getlocal: function (name) {
        try {
          let o = JSON.parse(localStorage[name])
          if (!o || o.expires < Date.now()) {
            return null
          } else {
            return o.value
          }
        } catch (e) {
            // 兼容其他localstorage 
//        console.log(e)
//        console.log('e')
          return localStorage[name]
        } finally {
        }
      },
			upDate:function(){
				this.$http({  //奖品销毁列表
              method: 'get',
              url: '/api/recoveries',
              headers: {accessToken: this.token},
              params: {page: 1},
            }).then(function (res) {
	            	if(res.body.execErrCode==200){
//		            	 this.GMTToStrTwo(res.body.execData.recoveries[0].time_end)
									console.log(new Date(this.GMTToStrTwo(res.body.execData.recoveries[1].time_end)).getTime())
		          	 if(res.body.execData.recoveries[0].status==0){
		          	 		this.noBtn=true
		          	 		this.timeShowF=true
		          	 		this.timeShowL=false
		          	 }else if(res.body.execData.recoveries[0].status==101){//未开始
		          	 		this.noBtn=false
		          	 		this.timeShowL=true
		          	 }else if(res.body.execData.recoveries[0].status==102){
		          	 		this.noBtn=false
		          	 		this.timeTShow=true
		          	 		this.endShow=true
		          	 		this.timeShowF=false
		          	 }
										for(var i=0;i<res.body.execData.recoveries.length;i++){
		            	 		res.body.execData.recoveries[i].formStatus=false
		            	 	}
										console.log(res.body.execErrCode)
		            	 this.list=res.body.execData.recoveries
			            	 if(this.list.length>0){
			            	 		this.haveList=true
				            	}else if(res.body.execErrCode==4003){
				            			this.goLogin();
				            	}else{
				            		this.toast(res.body.execMsg);
				            	}
//          	
            	 }else if(res.body.execErrCode==4003){
            	 		this.goLogin();
            	 }
            })
			}
      
    },
    mounted(){
    	this.chartShow=false
     	
     	
//  	window.location.reload()
      var _this=this;
       if (_this.$route.query.token) {
        _this.setCookie('intoToken', _this.$route.query.token, 3)
      }
       _this.token = this.getCookie('intoToken');
//     console.log(!this.getCookie('reload'))
//     if(!this.getCookie('reload')){
//     		_this.setCookie('reload', '1', 1)
//     		window.location.reload()
//     }
//     
      this.clientType(function () {
      	
	      }, function () {
	        if (window.screen.height == 812) {
	        	
	          if (_this.isApp) {
	            _this.isIphonex = true;
	          }
	        } else {
	          _this.isIos = true;
	          document.querySelector('#app>div>div').style.height = '100%';
	          
	        }
	      })
     if(_this.getlocal('openShow')==undefined){
      	_this.$http({
          method: 'get',
          url: '/api/recoveries/get_yesterday_recovery',
          headers: {accessToken: _this.token}
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
          	if(data.execData.total>0){
          		_this.yesterday=data.execData.total
	          	_this.Prompt=true
	          	_this.yestDate=data.execData.day
//	            console.log(data.execData.total)
          	}
          }else{
          }
        })
     }
     this.upDate()
    }
  }
</script>

<style scoped>
  .inputCursor {
    width: 100%;
    position: fixed;
  }

  .shake.iphonex {
    min-height: 816px;
  }
   /*iphoneX适配*/
  .main.iphonex{
    height: 100%;
    min-height:812px;
  }
  .main.ios{
    height: 100%;
  }
  .main.ios.inputCursor {
    width: 100%;
    position: fixed;
  }
  .topHeight.iphonex{
    position: absolute;
    top:33px;
  }

  /*背景图*/
  	/*min-height: 22.08rem;*/
  .pre-box {
  	position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10% 5% 9% 5%;
    background: url("../../images/box-bg.jpg");
    background-size: 100% 100%;
  	/*min-height: 22.08rem;*/
    bottom: 0;
    /*z-index: 1;*/
  }

  /*头部*/
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: .2rem;
    height: 1.66rem;
  }

  .top-bar.iphonex {
    position: absolute;
    top: 33px;
  }

  .top-bar .notice {
    width: 7.33rem;
    height: .63rem;
    line-height: .63rem;
    margin: .51rem .39rem 0 2.04rem;
    font-size: .36rem;
    color: #ffdd00;
    background: url("../../images/notice-bg.png") 0/100% 100%;
    overflow: hidden;
  }

  .top-bar .notice .notice-list {
    overflow-x: scroll;
    white-space: nowrap;
  }

  .top-bar .notice .notice-item {
    display: inline-block;
    padding-right: 2.1rem;
  }

  .top-bar .btn {
    width: 1.16rem;
    height: 1.66rem;
    padding: .33rem .2rem 0 .2rem;
  }

  .top-bar .exchange-btn .img {
    height: .76rem;
    background: url("../../images/exchange-btn.png") 0/100% 100%;
  }

  .top-bar .rule-btn .img {
    height: .76rem;
    background: url("../../images/rule-btn.png") 0/100% 100%;
  }

  .top-bar .btn .txt {
    font-size: .36rem;
    color: #fff;
    margin-top: -.21rem;
  }
  .Box-bg,.win-record-box{
    height: 100%;
  }
   .win-record-box{
    position: relative;
    padding: 1.1rem 0.4rem 1.2rem 0.4rem;
    background: url("../../images/brown-bg.png");
    background-size: 100% 100%;
  }
   .win-record-box .title{
    position: absolute;
    top: -0.4rem;
    left: 0;
    right: 0;
    z-index: 0;
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
    background: url("../../images/monny.png");
    background-size: 100% 100%;
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
   .topHeight{
    position: absolute;
    top: 0;
    left: 0;
    width: 1.8rem;
    height: 1.6rem;
    padding: .2rem 0 0 .4rem;
    z-index: 2;
  }
  .topHeight.iphonex{
    position: absolute;
    top:33px;
  }
   .go-back{
    width: 0.9rem;
    height: 0.9rem;
    background: url("../../images/go-back.png");
    background-size: 100% 100%;
  }
  .text p{
  	color: #D44400;
  	font-size: .45rem;
  	text-align: center;
  }
	.recovery_list{
		padding:.42rem .63rem;
		background: url("../../images/recovery_bg.png");
    background-size: 100% 100%;
    margin-bottom: .3rem;
    /*height: 10rem;*/
	}
	.recovery_price{
		width: 100%;
		border: solid 1px #C69452;
		padding: 0 .3rem;
		background: #EFCC9D;
    background-size: 100% 100%;
    clear: both;
    margin-top: 1.5rem;
    padding-top: .45rem;
	}
	.recovery_price p{
		color: #D44400;
	}
	.price_text p{
		color: #D44400;
		font-size: .6rem;
		text-align: center;
	}
	.price_num{
		font-size: .72rem;
	}
	.small{
		font-size: .42rem;
	}
	.wait{
		width: 100%;
		height: 100%;
		/*border: solid 1px #C69452;*/
		clear: both;
		padding: 0 .3rem;
		padding-bottom: .3rem;
	}
	.star_time{
		margin:.66rem 0 .9rem 0;
	}
	.star_time p{
		color: #6E442A;
		font-size: .45rem;
		text-align: center;
	}
	.star_time p:nth-child(2){
		font-size: .81rem;
		
	}
	.conduct{
		width: 100%;
		height: 1.2rem;
		margin-top: .45rem;
		padding-left: .3rem;
		margin-bottom: .45rem;
	}
	.conduct div{
		width: 3.9rem;
		height: 1.2rem;
		float: left;
	}
	.conduct div:nth-child(2){
		margin-left: 1rem;
	}
	.conduct i{
		width: 1px;
		height: 100%;
		display: block;
		float: left;
		background: url("../../images/text_border.png") no-repeat 0/100% 100%;
		margin-right: .3rem;
	}
	.conduct div p{
		font-size: .39rem;
		color: #6E442A;
		text-align: center;
	}
	/*.conduct div span{
		font-size: .55rem;
		float: left;
	}*/
	.conduct div span{
		font-size: .55rem;
		width: 3.9rem;
		text-align: center;
		float: left;
	}
	.conduct div:nth-child(4) span{
		font-size: .45rem;
	}
	.conduct div span b{
		font-size: .36rem;
		font-weight: normal;
	}
	.Subtitle{
		width: 4.94rem;
		height: 1.95rem;
		margin: 0 auto;
		background: url("../../images/Subtitle.png");
    background-size: 100% 100%;
	}
	.Subtitle p{
		color: #D44400;
		font-size: .88rem;
		line-height: 1.25rem;
		text-align: center;
	}
	.Subtitle p span{
		font-size: .42rem;
	}
	.next_text{
		margin-top: .3rem;
		margin-bottom: .48rem;
	}
	.next_text p{
		text-align: center;
	}
	.next_text p:nth-child(1){
		font-size: .45rem;
		color: #6E442A;
	}
	.next_text p:nth-child(2){
		font-size: .39rem;
		color: #B07B5A;
	}
	.Chart{
		
	}
	.Chart_text{
		font-size: .39rem;
		color: #6E442A;
	}
	.Chart_text span{
		float: right;
		width: .38rem;
		height: .2rem;
		margin-right: .2rem;
		margin-top: .2rem;
		background: url("../../images/go_down.png");
    background-size: 100% 100%;
    display: block;
	}
	.Chart_text .down{
		background: url("../../images/go_up.png");
		background-size: 100% 100%;
	}
	.Chart_box{
		width: 8.74rem;
		height: 1.97rem;
		border: solid 1px #C69452;
		margin-top: .3rem;
	}
	.btn{
		width: 4.85rem;
		height: 1.07rem;
		font-size: .51rem;
		color: #9E3A1D;
		margin: 0 auto;
		text-align: center;
		line-height: 1.07rem;
		margin-top: .3rem;
		background: url("../../images/icon-btn.png");
		background-size: 100% 100%;
	}
	.Chart_top,.Chart_down{
		height: .95rem;
		overflow: hidden;
	}
	.Chart_down{
		background: #E1CBAE;
	}
	.Chart_top span{
		width: 1.43rem;
		text-align: center;
		font-size: .36rem;
		color: #B07B5A;
		line-height: .95rem;
		display: inherit;
		float: left;
	}
	.Chart_down span{
		width: 1.43rem;
		text-align: center;
		font-size: .36rem;
		color: #000;
		line-height: .95rem;
		display: inherit;
		float: left;
	}
	.Chart_down span:nth-child(1){
		color: #B07B5A;
	}
	
	.recovery_title p{
		font-size: .54rem;
		color: #6E442A;
		line-height: 1rem;
		float: left;
	}
	.recovery_title{
		margin-left: .3rem;
	}
	.recovery_img{
		width: 1rem;
		height: 1rem;
		border: solid 1px #D9781F;
		float: left;
		margin-right: .3rem;
	}
	
	.choice{
		position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
	}
	.receive-way{
    position: absolute;
    top: 60%;
    left: 1rem;
    right: 1.96rem;
    z-index: 1005;
    font-size: .48rem;
    text-align: center;
    color: #9e3a1d;
  }
  .receive-way {
    padding-bottom: .75rem;
    width: 10.21rem;
    margin-top: -7.2rem;
    background: url("../../images/get-box-bg.png") no-repeat 0/100% 100%;
    /*background-position: 0 62%;*/
  }
  .receive-way .title {
    width: 4rem;
    height: 1.11rem;
    margin: -0.3rem auto .3rem;
    background: url("../../images/get-box-title.png") 0/100% 100%;
  }
  .title{
  	color: #EEC051;
  	text-align: center;
  	line-height: 1rem;
  }
  .choice_img{
  	width: 1.85rem;
  	height: 1.85rem;
  	margin: 0 auto;
  	display: block;
  	margin-top: .72rem;
  	background: url("../../images/img_border.png") 0/100% 100%;
  }
  .choice_name{
  	font-size: .36rem;
  	margin-top: .12rem;
  	color: #fff;
  	margin-bottom: .09rem;
  }
  .choice_num{
  	width: 4.75rem;
  	height: .52rem;
  	text-align: center;
  	margin: 0 auto;
  	font-size: .42rem;
  	color: #D3984A;
  	background: url("../../images/tishi.png") 0/100% 100%;
  }
  .border{
  	width: 7.53rem;
  	height: .06rem;
  	margin: 0 auto;
  	margin-top: .45rem;
  	margin-bottom: .45rem;
  	background: url("../../images/border2.png") 0/100% 100%;
  }
  .choice_title{
  	color: #C3AB91;
  	font-size: .48rem;
  }
  .choice_btn{
  	padding-left: .9rem;
  	margin-top: .45rem;
  }
  .choice_btn span:nth-child(1){
  	width: 1.45rem;
  	height: 1rem;
  	background: url("../../images/yuanjiao.png") 0/100% 100%;
  	display: block;
  	position: relative;
  	float: left;
  	padding-top: .2rem;
  }
   .choice_btn span:nth-child(2){
  	width: 1.04rem;
  	height: 1.04rem;
  	background: url("../../images/yuan.png") 0/100% 100%;
  	display: block;
  	position: relative;
  	float: left;
  	margin-left: .2rem;
  }
   .choice_btn span:nth-child(3){
  	width: 3rem;
  	height: 1.04rem;
  	background: url("../../images/Cyuan.png") 0/100% 100%;
  	display: block;
  	position: relative;
  	float: left;
  	margin-left: .1rem;
  	line-height: 1.04rem;
  }
  .choice_btn span:nth-child(4){
  	width: 1.04rem;
  	height: 1.04rem;
  	background: url("../../images/yuan.png") 0/100% 100%;
  	display: block;
  	position: relative;
  	float: left;
  	margin-left: .1rem;
  }
   .choice_btn span:nth-child(5){
  	width: 1.45rem;
  	height: 1rem;
  	background: url("../../images/yuanjiao.png") 0/100% 100%;
  	display: block;
  	position: relative;
  	float: left;
  	margin-left: .2rem;
  	padding-top: .2rem;
  }
   .choice_btn span:nth-child(1) i{
   	width: .42rem;
  	height: .15rem;
  	background: url("../../images/jian.png") 0/100% 100%;
  	display: block;
  	position: absolute;
  	left: .15rem;
  	top: .45rem;
   }
   .choice_btn span:nth-child(2) i{
	   	width: .42rem;
	  	height: .15rem;
	  	background: url("../../images/jian.png") 0/100% 100%;
	  	display: block;
	  	position: absolute;
	  	left: .31rem;
	  	top: .45rem;
   }
    .choice_btn span:nth-child(4) i{
	   	width: .44rem;
	  	height: .44rem;
	  	background: url("../../images/jia.png") 0/100% 100%;
	  	display: block;
	  	position: absolute;
	  	left: .31rem;
	  	top: .3rem;
   }
    .choice_btn span:nth-child(5) i{
	   	width: .44rem;
	  	height: .44rem;
	  	background: url("../../images/jia.png") 0/100% 100%;
	  	display: block;
	  	position: absolute;
	  	left: .15rem;
	  	top: .3rem;
   }
   .choice_btn span:nth-child(1) b{
    	font-size: .6rem;
    	color: #FFE8B1;
    	margin-left: .2rem;
    	font-weight: normal;
    	
    }
    .choice_btn span:nth-child(5) b{
    	font-size: .6rem;
    	color: #FFE8B1;
    	margin-left: .25rem;
    	font-weight: normal;
    	
    }
    .l_btn,.r_btn{
    	margin: 0 auto;
    	margin-top: .45rem;
    }
    .l_btn,.r_btn{
    	width: 3.7rem;
    	height: 1.1rem;
    	line-height: 1.1rem;
    	background: url("../../images/way-btn.png") 0/100% 100%;
    	font-size: .45rem;
    }
    .l_btn{
    	background: url("../../images/btn2.png") 0/100% 100%;
    	color: #FFC038;
    }
    .clonse{
    	width: .9rem;
    	height: 1.1rem;
    	background: url("../../images/clone1.png") 0/100% 100%;
    	position: absolute;
    	right: -.5rem;
    	top: .2rem;
    }
    
    .no_choice{
    	width: 8.26rem;
    	height: 5.05rem;
    	left: 2.08rem;
    }
    .jiluList{
    	padding-right: 0 .6rem;
    	min-height: 8.7rem;
    }
    .obtain{
    	width: 8.26rem;
    	height: 5.66rem;
    	left: 2.08rem;
    }
    .text_four{
    	margin-top: .72rem;
    }
    .text_four p{
    	color: #fff;
    	font-size: .48rem;
    }
    .text_four p span{
    	color: #FFFF50;
    }
    .maxList{
    	max-height: 7.5rem;
    	overflow: hidden;
    	overflow-y: scroll;
    }
    .maxList div:nth-child(1) p:nth-child(1){
    	display: none;
    }
    .jiluText{
    	padding: 0 .6rem;
    	clear: both;
    }
    .jiluText p:nth-child(1){
    	/*display: none;*/
    }
    .jiluText p:nth-child(2){
    	float: left;
    }
    .jiluText p:nth-child(3){
    	float: right;
    	color: #7F300F;
    }
    .open_btn{
    	width: 3.7rem;
    	height: 1.1rem;
    	line-height: 1.1rem;
    	background: url("../../images/way-btn.png") 0/100% 100%;
    	float: left;
    	font-size: .45rem;
    	margin: .6rem 0;
    	margin-left: 2.3rem;
    }
    .open_btn a{
    	color: #9E3A1D;
    }
    .text_five{
    	margin-top: 1.5rem;
    }
    .text_five p{
    	color: #fff;
    }
    .text_five p span{
    	color: #FFFF50;
    }
    .receive-way .title_ruls{
    	width: 4.78rem;
    	z-index: 1000;
    }
    .text_six{
    	margin-top: .52rem;
    }
    .text_six p:nth-child(1){
    	font-size: .45rem;
    	color: #D8D643;
    	margin-bottom: .59rem;
    }
    .text_six p:nth-child(2){
    	font-size: .36rem;
    	color: #957C64;
    }
    .text_six p:nth-child(3){
    	font-size: .36rem;
    	color: #957C64;
    }
    .fag{
    	width: 100%;
    	height: 2.77rem;
    	background: url("../../images/sparkle.png") 0/100% 100%;
			margin-top: -2.7rem;
    }
    .goMonny{
    	position: absolute;
    	right: 0;
    	bottom: -1rem;
    }
    .m_img{
    	width: 1.9rem;
    	height: 1.75rem;
    	background: url("../../images/monny_t.png") 0/100% 100%;
    	margin: 0 auto;
    }
    .goMonny p{
    	font-size: .36rem;
    	color: #FEF4C4;
    }
    .ruls_btn{
    	position: absolute;
    	right:.7rem;
    	top: .32rem;
    }
    .ruls_btn p{
    	width: .62rem;
    	height: .62rem;
    	background: url("../../images/rule-btn.png") 0/100% 100%;
    }
    .ruls_btn span{
    	color: #fff;
    	font-size: .36rem;
    	width: .8rem;
    	position: absolute;
    	top: .5rem;
    }
    .noList{
    	height: 18rem;
    	background: url("../../images/recovery_bg.png");
   		background-size: 100% 100%;
   		padding-top: 5.70rem;
    }
    .noList div{
    	width: 4.65rem;
    	height: 4.65rem;
    	background: url("../../images/no-content-icon.png");
   		background-size: 100% 100%;
   		margin: 0 auto;
   		margin-bottom: .45rem;
    }
    .noList p{
    	font-size: .45rem;
    	text-align: center;
    	color: #272420;
    }
    .height_box{
    	/*width: 100%;
	    height: 98%;
	    min-height: 10rem;
	    z-index:1;
	    overflow-y: scroll;
	    overflow-x: hidden;
	    -webkit-overflow-scrolling: touch;*/
    }
    .main_box{
    	width:100%;
    	height:100%;
			overflow-y:auto;
			-webkit-overflow-scrolling: touch;
    	
    }
    .noBtns{
    	background: url("../../images/weikai.png");
   		background-size: 100% 100%;
    }
    .rule_text{
    	padding: 0 .96rem;
	    font-size: .36rem;
	    line-height: .54rem;
	    color: #ead9d1;
	    height: 85%;
	    overflow-y: auto;
	    width: 100%;
	    overflow-x: hidden;
	    text-align: left;
	    -webkit-overflow-scrolling: touch;
    }
    .rule-con p {
    	margin-bottom: 0.3rem;
    	text-align: left;
  	}
  	.rule-con h4 {
  		
    	margin-bottom: 0.1rem;
  	}
  	.starShow{
  		float: right;
  	}
  	.starShow p{
  		font-size: .45rem;
  		color: #000;
  		text-align: right;
  	}
  	.starShow p:nth-child(2){
  		color: #D44400;
  	}
  	.jilu{
  		width: 100%;
  		font-size: .39rem;
  		margin-top: .48rem;
  		padding-bottom: .51rem;
  		margin-bottom: .51rem;
  	}
  	.L_list{
  		float: left;
  		color: #6E442A;
  	}
  	.L_list span{
  		color: #000;
  	}
  	.jilu p{
  		float: right;
  	}
  	.jilu p i{
  		width: .2rem;
  		height: .38rem;
  		display: inline-block;
  		background: url("../../images/right.png") 0/100% 100%;
  		margin-left: .21rem;
  	}
  	.border_fist{
  		width: 100%;
  		height: 1px;
  		margin-bottom: .48rem;
  		background: #C79373;
  	}
</style>