<template>
  <!--宝箱气泡通知-->
  <div class="box-bubble" v-show="bubbleShow">
    <div class="text-overflow-multi">
      恭喜 <span>{{notice.user.nick_name}}</span>在{{notice.time}}前获得 <span>{{notice.chest_prizes[0].name}}</span></div>
  </div>
</template>

<script>
  export default {
    props: ['boxId', 'boxType'],
    data () {
      return {
        notice: {user: {nick_name: ''}, time: '', chest_prizes: [{name: ''}]},
        bubbleShow: false,
        fixedData1: [
          {user: {nick_name: '为情所困'}, time: '1分钟', chest_prizes: [{name: '5元话费'}]},
          {user: {nick_name: '世上唯独有你'}, time: '2分钟', chest_prizes: [{name: 'Guhl无硅油洗发水'}]},
          {user: {nick_name: '再回首恍然如梦'}, time: '3分钟', chest_prizes: [{name: '18元优众红包'}]},
          {user: {nick_name: '念你彻夜难眠'}, time: '4分钟', chest_prizes: [{name: '5元话费'}]},
          {user: {nick_name: '習慣沉默'}, time: '5分钟', chest_prizes: [{name: 'G&M VE面霜'}]},
          {user: {nick_name: '仅有的幸福'}, time: '6分钟', chest_prizes: [{name: '5元话费'}]},
          {user: {nick_name: '普通小姐'}, time: '7分钟', chest_prizes: [{name: '花王肩颈贴'}]},
          {user: {nick_name: '右手年华'}, time: '8分钟', chest_prizes: [{name: '5元话费'}]},
          {user: {nick_name: '無盡的蒼穹'}, time: '9分钟', chest_prizes: [{name: '30入场券'}]},
          {user: {nick_name: '萌比女神'}, time: '10分钟', chest_prizes: [{name: '18元优众红包'}]}
        ],
        fixedData2: [
          {user: {nick_name: '某花花'}, time: '11分钟', chest_prizes: [{name: '50元京东卡'}]},
          {user: {nick_name: '给你我的怀抱'}, time: '12分钟', chest_prizes: [{name: '闪迪 金属U盘'}]},
          {user: {nick_name: '幸福向右'}, time: '13分钟', chest_prizes: [{name: '索尼无线立体声耳机'}]},
          {user: {nick_name: '傻瓜'}, time: '14分钟', chest_prizes: [{name: '1宝箱符'}]},
          {user: {nick_name: '倾国倾城倾了天下'}, time: '15分钟', chest_prizes: [{name: '50元京东卡'}]},
          {user: {nick_name: '拉你手'}, time: '16分钟', chest_prizes: [{name: '20入场券'}]},
          {user: {nick_name: '蒙丽娜莎'}, time: '17分钟', chest_prizes: [{name: '小米蓝牙耳机青春版'}]},
          {user: {nick_name: '依赖你'}, time: '18分钟', chest_prizes: [{name: '50元京东卡'}]},
          {user: {nick_name: '拥有生'}, time: '19分钟', chest_prizes: [{name: '100入场券'}]},
          {user: {nick_name: '掏心掏肺'}, time: '20分钟', chest_prizes: [{name: '50元京东卡'}]}
        ],
        fixedData3: [
          {user: {nick_name: '霸王'}, time: '21分钟', chest_prizes: [{name: '华为 畅享7 32G'}]},
          {user: {nick_name: '金牌女士'}, time: '22分钟', chest_prizes: [{name: '12宝箱符'}]},
          {user: {nick_name: '宝你是我的命脉'}, time: '23分钟', chest_prizes: [{name: '100元京东卡'}]},
          {user: {nick_name: '酷酷猫'}, time: '24分钟', chest_prizes: [{name: '200入场券'}]},
          {user: {nick_name: '白纸上涂鸦'}, time: '25分钟', chest_prizes: [{name: '纽曼60G超薄版移动硬盘'}]},
          {user: {nick_name: '加载中'}, time: '26分钟', chest_prizes: [{name: 'BeatsX蓝牙无线运动耳机'}]},
          {user: {nick_name: '像花一样开放'}, time: '27分钟', chest_prizes: [{name: '100元京东卡'}]},
          {user: {nick_name: '痴货'}, time: '28分钟', chest_prizes: [{name: 'MCM银色拼接抽象图案女士手拿包'}]},
          {user: {nick_name: '柒槿年'}, time: '29分钟', chest_prizes: [{name: '20元话费'}]},
          {user: {nick_name: '芳华如梦'}, time: '30分钟', chest_prizes: [{name: '100元京东卡'}]}
        ]
      }
    },
    methods: {
      request: function () {
        this.$http({
          method: 'get',
          url: '/api/chest_boxs/current_notice?q[chest_box_id_eq]=' + this.boxId
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
          switch (this.boxType) {
            case '1':
              let n1 = Math.floor(Math.random() * this.fixedData1.length);
              this.notice = this.fixedData1[n1];
              break;
            case '2':
              let n2 = Math.floor(Math.random() * this.fixedData2.length);
              this.notice = this.fixedData2[n2];
              break;
            case '3':
              let n3 = Math.floor(Math.random() * this.fixedData3.length);
              this.notice = this.fixedData3[n3];
              break;
          }
          this.keyframe();
        })
      },
      keyframe: function () {
        let _this = this;
        _this.bubbleShow = true;
        setTimeout(function () {
          _this.bubbleShow = false;
        }, 2000)
      }
    },
    mounted(){
      let _this = this;
      window.timer11 = setInterval(function () {
        _this.request()
      }, 9000)
    },
    beforeDestroy: function () {
      clearInterval(window.timer11)
    }
  }
</script>

<style scoped>
  /*宝箱气泡通知--*/
  .box-bubble {
    position: absolute;
    width: 8.32rem;
    height: 2.36rem;
    top: -1.11rem;
    left: -2.1rem;
    z-index: 90;
    background: url("../../images/box-bubble-bg.png") 0/100% 100%;
    font-size: .45rem;
    color: #000;
    line-height: 1.3;
    padding: .24rem .6rem .96rem;
    text-align: left;
  }

  .box-bubble span {
    color: #a44529;
  }
</style>
