<template>
  <!--左边气泡通知-->
  <div class="bubble-notice">
    <div class="username text-overflow"><span>用户 {{notice.user.nick_name}}</span></div>
    <div class="text text-overflow">获得{{notice.chest_prizes[0].name}}</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        notice: {user: {nick_name: ''}, chest_prizes: [{name: ''}]},
        fixedData: [
          {user: {nick_name: '幸福向右'}, chest_prizes: [{name: '索尼无线立体声耳机'}]},
          {user: {nick_name: '倾国倾城倾了天下'}, chest_prizes: [{name: '50元京东卡'}]},
          {user: {nick_name: '宝你是我的命脉'}, chest_prizes: [{name: '100元京东卡'}]},
          {user: {nick_name: '加载中'}, chest_prizes: [{name: 'BeatsX蓝牙无线运动耳机'}]},
          {user: {nick_name: '痴货'}, chest_prizes: [{name: 'MCM银色拼接抽象图案女士手拿包'}]},
          {user: {nick_name: '柒槿年'}, chest_prizes: [{name: '20元话费'}]},
          {user: {nick_name: '霸王'}, chest_prizes: [{name: '华为 畅享7 32G'}]},
          {user: {nick_name: '白纸上涂鸦'}, chest_prizes: [{name: '纽曼 60G超薄版 移动硬盘'}]},
          {user: {nick_name: '给你我的怀抱'}, chest_prizes: [{name: '闪迪 金属U盘'}]}
        ]
      }
    },
    methods: {
      request: function () {
        this.$http({
          method: 'get',
          url: '/api/chest_boxs/notice?q[prize_type_in][]=1&q[prize_type_in][]=7'
        }).then(function (res) {
          let data = res.body;
          if (data.execErrCode == 200) {
            let allNotice = data.execData.chest_records, notice = [];
            for (let i = 0, len = allNotice.length; i < len; i++) {
              if (allNotice[i].chest_prizes.length > 0) {
                notice.push(allNotice[i]);
              }
            }
            if (notice.length > 0) {
              let n = Math.floor(Math.random() * notice.length);
              this.notice = notice[n];
              this.keyframe();
            }
          }
        }, function () {
          let n = Math.floor(Math.random() * this.fixedData.length);
          this.notice = this.fixedData[n];
          this.keyframe();
        })
      },
      keyframe: function () {
        let bubbleNotice = document.getElementsByClassName('bubble-notice')[0];
        bubbleNotice.className = 'bubble-notice slide';
        setTimeout(function () {
          bubbleNotice.className = 'bubble-notice';
        }, 2300)
      }
    },
    mounted(){
      let _this = this;
      window.timer10 = setInterval(function () {
        _this.request()
      }, 7600)
    },
    beforeDestroy: function () {
      clearInterval(window.timer10)
    }
  }
</script>
<style scoped>
  /*左边气泡通知--*/
  .bubble-notice {
    position: fixed;
    left: 0;
    bottom: 34%;
    z-index: 55;
    width: 5.25rem;
    height: 1.65rem;
    font-size: .39rem;
    padding: .24rem .27rem;
    transform: translate3d(-100%, 0, 0);
    transition: transform .3s;
    background: rgba(0, 0, 0, .6);
    border-radius: 0 .83rem .83rem 0;
  }

  .bubble-notice.slide {
    transform: translate3d(0, 0, 0);
  }

  .bubble-notice .username {
    color: #fff;
    margin-bottom: .12rem;
  }

  .bubble-notice .text {
    color: #fae020;
  }
</style>
