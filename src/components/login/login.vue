<template>
  <div v-if="clonses">
    <div class="register" :class="{ios: isIos}" v-if="registerShow" @click.self="closeRegister">
      <div class="register-box">
        <p class="title">注册</p>
        <div class="phone">
          <i class="pull-left">手机号：</i>
          <input class="pull-left" type="number" oninput="if(value.length>11)value=value.slice(0,11)" required
                 v-model="phone"/>
        </div>
        <div class="code">
          <i class="pull-left">验证码：</i>
          <input class="pull-left" type="number" oninput="if(value.length>6)value=value.slice(0,6)" v-model="code"/>
          <button class="code_btn pull-right" @click="sendCode" :disabled="disabled">{{codeText}}</button>
        </div>
        <div class="password">
          <i class="pull-left">密 &nbsp;&nbsp;码：</i>
          <input class="pull-left" type="password" v-model="passWord"/>
        </div>
        <div class="yes-botton" @click="checkForm">立即注册</div>
        <div class="switch" @click="switchBox">登<br/>录</div>
      </div>
    </div>
    <!-- 登录弹框-->
    <div class="register" :class="{ios: isIos}" v-if="!registerShow" @click.self="closeRegister">
      <div class="register-box" style="height: 7rem;">
        <p class="title">登录</p>
        <div class="phone">
          <i class="pull-left">手机号：</i>
          <input class="pull-left" type="number" oninput="if(value.length>11)value=value.slice(0,11)" required
                 v-model="phone"/>
        </div>
        <div class="password">
          <i class="pull-left">密 &nbsp;&nbsp;码：</i>
          <input class="pull-left" type="password" v-model="passWord"/>
        </div>
        <div class="yes-botton" @click="login">登录</div>
        <div class="switch" @click="switchBox">注<br/>册</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        registerShow: false,
        codeText: '发送验证码',
        disabled: false,
        phone: '',           //手机号
        passWord: '',        //密码
        code: '',            //验证码
        isIos: false,        //是否是iPhone
        clientKinds: "",    //客户端类型
      }
    },
    props:['clonses'],
    methods: {
      closeRegister: function () {
        this.$emit('closeRegister', false);
      },
      switchBox: function () {
        this.registerShow = !this.registerShow
      },
      /*校验表单*/
      checkForm: function () {
        if (!this.phone) {
          this.toast('请输入手机号');
          return false;
        } else if (!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.phone)) {
          this.toast('手机号码格式不正确');
          return false;
        }
        if (!this.code) {
          this.toast('请输入验证码');
          return false;
        } else if (!/^[0-9]{6}$/.test(this.code)) {
          this.toast('验证码为6位数字');
          return false;
        }
        if (!this.passWord) {
          this.toast('请输入密码');
          return false;
        } else if (!/^(\w){6,20}$/.test(this.passWord)) {
          this.toast('密码格式不正确');
          return false;
        }
        this.checkStock();
      },
      /*获取验证码*/
      sendCode: function () {
        if (!this.phone) {
          this.toast('请输入手机号');
          return false;
        } else if (!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.phone)) {
          this.toast('手机号码格式不正确');
          return false;
        }
        this.$http({
          method: 'post',
          url: '/card-service-web/user/sendVerificationCode',
          params: {mobile: this.phone, isCheck: 1,type:H5_LOGIN}
        }).then(function (res) {
          var data = res.body, _this = this;
          data = typeof data == 'string' ? JSON.parse(data) : data;
          if (data.execErrCode == 200) {
            _this.disabled = true;
            var num = 60, time = setInterval(function () {
              num--;
              _this.codeText = num;
              if (num <= 0) {
                clearInterval(time);
                _this.codeText = '重新发送';
                _this.disabled = false;
              }
            }, 1000);
          } else if (data.execErrCode == 311) {
            _this.toast('该用户已经注册');

          } else {
            _this.toast(data.execMsg);
          }
        })
      },
      /*检测手机号是否存在*/
      checkStock: function () {
        var _this = this;
        this.asyncHttp("post", '/card-service-web/user/checkMobile', {mobile: _this.phone}, function (res) {
          if (res.execData == 1) {
            _this.toast('该用户已经注册');
          } else {
            _this.register();
          }
        })
      },
      /*注册*/
      register: function () {
        var _this = this;
        this.asyncHttp("post", '/card-service-web/user/moblieRegister', {
          loginName: _this.phone,
          password: _this.passWord,
          mobile: _this.phone,
          client: _this.clientKinds,
          code: _this.code
        }, function (res) {
          if (res.execData == 1) {
            _this.asyncHttp("post", '/card-service-web/user/login', {
              loginName: _this.phone,
              password: _this.passWord
            }, function (res) {
              sessionStorage.setItem('intoToken', JSON.stringify(res.execData.accessToken))
              _this.$router.push({path: 'openBox', query: {token: res.execData.accessToken, native: 0}});
              _this.$emit('closeRegister', false);
            })
          } else if (res.execData == 0) {
            _this.toast('注册失败');
          }
        })
      },
      //登录
      login: function () {
        if (!this.phone) {
          this.toast('请输入手机号');
          return false;
        } else if (!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.phone)) {
          this.toast('手机号码格式不正确');
          return false;
        }
        if (!this.passWord) {
          this.toast('请输入密码');
          return false;
        } else if (!/^(\w){6,20}$/.test(this.passWord)) {
          this.toast('密码格式不正确');
          return false;
        }
        var _this = this;
        this.asyncHttp("post", '/card-service-web/user/login', {
          loginName: _this.phone,
          password: _this.passWord
        }, function (res) {
          sessionStorage.setItem('intoToken', JSON.stringify(res.execData.accessToken));
          // _this.$router.push({path: 'openBox', query: {token: res.execData.accessToken, native: 0}});
          window.location.replace("https://card-h5.zuanliantech.com/box/#/winningRecord?native=0");
          _this.$emit('closeRegister', false);
        })
      }
    },
    mounted: function () {
      let _this = this;
      this.clientType(function () {
        _this.clientKinds = 'Android';
      }, function () {
        _this.clientKinds = 'ios';
        if (window.screen.height == 812) {
          _this.isIphonex = true;
        }
      })
    }
  }
</script>
<style scoped>
  /*登录注册弹出层*/
  .register{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10;
  }
  .register.ios {
    position: absolute;
  }
  .register-box {
    padding-top: .42rem;
    width: 8.37rem;
    height: 8.16rem;
    background: url("../../images/phonelogin.png") 0 0/100% 100%;
    position: absolute;
    top: 50%;
    left: 55%;
    margin: -4.25rem 0 0 -4.9rem;
  }
  .register-box .title {
    text-align: center;
    font-size: .54rem;
    color: #000;
    position: relative;
    margin-top: .3rem;
  }
  .phone,
  .code,
  .password {
    width: 6.69rem;
    height: 1.26rem;
    line-height: 1.26rem;
    background: #ECE6E1;
    /* border-radius: .1rem;*/
    margin: 0 auto 0;
    padding-left: .43rem;
    font-size: .4rem;
    color: #35271c;
  }
  .phone {
    margin-top: .54rem;
  }
  .phone input,
  .code input,
  .password input {
    width: 4.5rem;
    height: 1.26rem;
    background: none;
  }
  .code input {
    width: 1.6rem;
  }
  .code_btn {
    width: 2.3rem;
    height: .69rem;
    line-height: .69rem;
    font-size: .3rem;
    color: #6e442a;
    text-align: center;
    background: #cbb49a;
    border: solid 1px #b79d80;
    margin-top: .3rem;
  }
  .yes-botton {
    width: 3.3rem;
    text-align: center;
    height: .9rem;
    line-height: .96rem;
    margin: .6rem auto 0;
    font-size: .45rem;
    background: url("../../images/btn-ok-submit.png") 0 0/100% 100%;
  }

  .register-box {
    position: fixed;
    z-index: 10000;
  }

  .phone, .code {
    border-bottom: solid 1px #D4D4D4;
  }

  .switch {
    width: 0.76rem;
    height: 2.85rem;
    position: absolute;
    right: -.3rem;
    top: 0;
    font-size: .35rem;
    background: url("../../images/denglu.png") 0 0/100% 100%;
    padding-top: 1.2rem;
    text-align: center;
    line-height: .45rem;
  }
</style>
