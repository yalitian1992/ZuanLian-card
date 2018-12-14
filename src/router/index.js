import App from '../App.vue'
import winningRecord from '../page/treasureBox/winningRecord.vue'
import openBox from '../page/treasureBox/openBox.vue'
import openOneBox from '../page/treasureBox/openOneBox.vue'
import luckyList from '../page/treasureBox/luckyList.vue'
import receiveInfo from '../page/treasureBox/receiveInfo.vue'
import totalPrize from '../page/treasureBox/totalPrize.vue'
import payment from '../page/treasureBox/payment.vue'
import paymentSuccess from '../page/treasureBox/payment-success.vue'
import passWord from '../page/treasureBox/passWord.vue'
import wmbox from '../page/landingPage/wmbox.vue'
import getPrize from '../page/landingPage/getPrize.vue'
import jdbox from '../page/landingPage/jdbox.vue'
import emptybox from '../page/landingPage/emptybox.vue'
import exchange from '../page/treasureBox/exchange.vue'
import prizeList from '../page/treasureBox/prizeList.vue'
import presentRecord from '../page/treasureBox/present-record.vue'
import inviteFriends from '../page/landingPage/inviteFriends.vue'
import beInvited from '../page/landingPage/beInvited.vue'
import showOff from '../page/landingPage/showOff.vue'
import demo from '../page/demo/demo.vue'


export default [{
  path: '/',
  component: App, //顶层路由，对应index.html
  children: [ //二级路由。对应App.vue
    //地址为空时跳转mallIndex页面
    {
      path: '',
      redirect: '/winningRecord'
    },
    //幸运名单
    {
      path: '/luckyList',
      component: luckyList
    },
    // 开宝箱--获奖记录
    {
      path: '/winningRecord',
      component: winningRecord
    },
    //开宝箱
    {
      path: '/openBox',
      component: openBox
    },
    //APP内开一个宝箱
    {
      path: '/openOneBox',
      component: openOneBox
    },
    //领取信息
    {
      path: '/receiveInfo',
      component: receiveInfo
    },
    //全部商品
    {
      path: '/totalPrize',
      component: totalPrize
    },
    // 支付页
    {
      path: '/payment',
      component: payment
    },
    {
      path: '/paymentSuccess',
      component: paymentSuccess
    },
    {
      path: '/passWord',
      component: passWord
    },
    //网盟推广页
    {
      path: '/wmbox',
      component: wmbox
    },
    //领取奖品
    {
      path: '/getPrize',
      component: getPrize
    },
    //京东购物卡
    {
      path: '/jdbox',
      component: jdbox
    },
    //下载页
    {
      path: '/emptybox',
      component: emptybox
    },
    //奖品回收
    {
      path: '/exchange',
      component: exchange
    },
    //下载页
    {
      path: '/demo',
      component: demo
    },
    //我的奖品
    {
      path: '/prizeList',
      component: prizeList
    },
    //提现记录
    {
      path: '/presentRecord',
      component: presentRecord
    },
    //邀请好友
    {
      path: '/inviteFriends',
      component: inviteFriends
    },
    //邀请好友查看分享
    {
    	path: '/beInvited',
      component: beInvited
    },
    //炫耀
    {
    	path: '/showOff',
      component: showOff
    }
  ]
}]
