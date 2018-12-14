export default {
  data(){
    return {
      timer: ''  //toast定时器
    }
  },
  install: function (Vue, options) {
    /*获取token*/
    Vue.prototype.getToken = function () {
      let token, intoToken = this.$route.query.token;
      if (intoToken) {
        token = intoToken;
      } else {
        token = this.getCookie('intoToken');
      }
      return token;
    }

    /*时间格式转转换*/
    Vue.prototype.format = function (str) {
      let date = new Date(str),
        t = {
          y: date.getFullYear(),
          M: date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
          d: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          h: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          m: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        }
      return t.y + '.' + t.M + '.' + t.d + ' ' + t.h + ':' + t.m
    }

    /*吐司提示*/
    Vue.prototype.toast = function (msg, time) {
      time = time ? time : 1500;
      let toast = document.getElementsByClassName('toast-alert')[0];
      if (toast) {
        document.body.removeChild(toast);
        clearTimeout(this.timer);
      }
      let newToast = document.createElement("div");
      newToast.className = 'toast-alert align-c';
      newToast.innerHTML = "<div class='side'></div><div class='con'>" + msg + "</div><div class='side side-r'></div>"
      document.body.appendChild(newToast);
      this.timer = setTimeout(function () {
        document.body.removeChild(newToast);
      }, time)
    }

    /*获取url参数部分*/
    Vue.prototype.getUrlParams = function (urlStr) {
      var StartIdx = urlStr.indexOf("?")
      if (StartIdx != -1) {
        var endIdx = urlStr.length
        var params = urlStr.substring(StartIdx, endIdx)
      } else {
        var params = ''
      }
      return params
    }

    /*页面PV统计*/
    Vue.prototype.pvCount = function () {
      let pv = document.getElementsByClassName('pv-img')[0];
      if (pv) {
        document.body.removeChild(pv);
      }
      let newPv = document.createElement("img"), url = window.location.href.replace('#/', ''),
        params = "?url=" + url + "&ad_from=" + this.$route.query.ad_from + "&random=" + Math.random();
      newPv.className = "pv-img";
      newPv.src = "http://www.zbqibing.com/ld/images/pv.png" + params;
      newPv.style.display = 'none';
      document.body.appendChild(newPv);
    }

    /*下载点击统计*/
    Vue.prototype.downStatistics = function (type) {  //type传ios或者Android
      let SImg = document.getElementsByClassName('Statistics-img')[0];
      if (SImg) {
        document.body.removeChild(SImg);
      }
      var phonetype = "&phonetype=" + type + "&download=1"
      var url = window.location.href
      var StartIdx = url.indexOf("?")
      if (StartIdx != -1) {
        var endIdx = url.length
        var params = url.substring(StartIdx, endIdx)
        let newSImg = document.createElement("img")
        newSImg.className = "Statistics-img";
        newSImg.src = "http://www.zbqibing.com/ld/images/Statistics.png" + params + phonetype + "&random=" + Math.random();
        newSImg.style.display = 'none';
        document.body.appendChild(newSImg);
      }
    }


    /*app下载*/
    Vue.prototype.downApp = function () {
      var _this = this
      var ua = navigator.userAgent.toLowerCase()
      var browser = {
        versions: function () {
          var u = navigator.userAgent, app = navigator.appVersion;
          return {     //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
          };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
      }
      if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          //在微信中打开
          _this.clientType(function () {
            var urlParams = _this.getUrlParams(window.location.href)
            window.location.href = "http://www.zbqibing.com/ld/qrload.html" + urlParams
          }, function () {
            _this.downStatistics("ios")
            window.location.href = _this.getDownLoadUrl(window.location.href).ios
          })
        } else if (browser.versions.ios || browser.versions.android) {
          this.clientType(function () {
            _this.downStatistics("Android")
            window.location.href = _this.getDownLoadUrl(window.location.href).android
          }, function () {
            _this.downStatistics("ios")
            window.location.href = _this.getDownLoadUrl(window.location.href).ios
          })
        } else {
          var urlParams = this.getUrlParams(window.location.href)
          window.location.href = "http://www.zbqibing.com/ld/qrload.html" + urlParams
        }
      } else {
        //否则就是PC浏览器打开
        window.close();
      }
    }


    /*获取下载链接*/
    Vue.prototype.getDownLoadUrl = function (url) {
      var adFromData = {
        "10": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=10&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网盟-2-APP资源_10_sign.apk"
        },
        "11": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=11&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_推啊-1-中奖位置_11_sign.apk"
        },
        "12": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=12&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_推啊-2-中奖位置_12_sign.apk"
        },
        "13": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=13&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_推啊-3-中奖位置_13_sign.apk"
        },
        "18": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=18&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_巨鲨DSP_18_sign.apk"
        },
        "19": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=19&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_UC_19_sign.apk"
        },
        "20": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=20&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_百度_20_sign.apk"
        },
        "21": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=21&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_今日头条_21_sign.apk"
        },
        "22": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=22&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_wifi万能钥匙_22_sign.apk"
        },
        "25": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=25&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_爱奇艺_25_sign.apk"
        },
        "26": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=26&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_趣头条_26_sign.apk"
        },
        "27": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=27&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网易-1_27_sign.apk"
        },
        "28": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=28&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网易-2_28_sign.apk"
        },
        "29": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=29&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网易-3_29_sign.apk"
        },
        "30": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=30&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网易-4_30_sign.apk"
        },
        "31": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=31&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网易-5_31_sign.apk"
        },
        "32": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=32&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_微百科_32_sign.apk"
        },
        "41": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=41&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理1_41_sign.apk"
        },
        "42": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=42&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理3_42_sign.apk"
        },
        "43": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=43&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理4_43_sign.apk"
        },
        "44": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=44&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理5_44_sign.apk"
        },
        "45": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=45&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理6_45_sign.apk"
        },
        "46": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=46&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理7_46_sign.apk"
        },
        "47": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=47&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理8_47_sign.apk"
        },
        "48": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=48&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理9_48_sign.apk"
        },
        "49": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=49&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_线下代理10_49_sign.apk"
        },
        "50": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=50&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_预留1_50_sign.apk"
        },
        "51": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=51&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_预留2_51_sign.apk"
        },
        "52": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=52&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_预留3_52_sign.apk"
        },
        "53": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=53&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_预留4_53_sign.apk"
        },
        "54": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=54&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_预留5_54_sign.apk"
        },
        "01": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=1&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_微博官方号_1_sign.apk"
        },
        "06": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=6&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_分享及嘲讽系统_6_sign.apk"
        },
        "08": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=8&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_微信公众号_8_sign.apk"
        },
        "09": {
          "ios": "https://itunes.apple.com/app/apple-store/id1253939312?pt=118821653&ct=9&mt=8",
          "android": "http://action.ihaveu.com/downloadapp/card/android/jiagu/CardGame_Ihaveu_UMENG_CHANNEL_网盟-1-wap-banner_9_sign.apk"
        }
      }
      var adFrom = this.$route.query.ad_from
      adFrom = '' + adFrom
      if (adFrom != '' && adFromData[adFrom]) {
        return adFromData[adFrom]
      } else {
        return {
          ios: "https://itunes.apple.com/app/id1253939312",
          android: "http://action.ihaveu.com/downloadapp/card/android/CardGame.apk"
        }
      }
    }

    /*手机号截取显示*/
    Vue.prototype.cutPhone = function (teltxt) {
      var changeTel = teltxt.substring(0, 3) + "****" + teltxt.substring(7, 11);
      return changeTel;
    }

    /*显示万过滤器*/
    Vue.filter("sum", function (value) {
      if (value >= 100000) {
        value = Math.floor(value / 10000) + '万';
      }
      return value
    });

    /*请求封装*/
    Vue.prototype.asyncHttp = function (method, url, params, success, error) {
      this.$http({
        method: method,
        url: url,
        params: params,
        headers: {accessToken: this.getToken()}
      }).then(function (res) {
        var data = res.body;
        data = typeof data == 'string' ? JSON.parse(data) : data;
        if (data.execErrCode == 200) {
          success(data);
        } else {
          this.toast(data.execMsg);
        }
      }, function () {
        if (error) {
          this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        }
      })
    }

    /*滚动到底部加载更多*/
    Vue.prototype.scrollMore = function (callback, dom) {
      this.clientType(function () {
        window.onscroll = function () {
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
            scrollHeight = document.body.scrollHeight,
            clientHeight = document.documentElement.clientHeight;
          if (scrollHeight - scrollTop - clientHeight <= 50) {
            callback();
          }
        }
      }, function () {
        if (window.screen.height == 812) {
          window.onscroll = function () {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
              scrollHeight = document.body.scrollHeight,
              clientHeight = document.documentElement.clientHeight;
            if (scrollHeight - scrollTop - clientHeight <= 200) {
              callback();
            }
          }
        } else {
          dom.onscroll = function () {
            let scrollTop = dom.scrollTop,
              scrollHeight = dom.scrollHeight,
              clientHeight = dom.clientHeight;
            if (scrollHeight - scrollTop - clientHeight <= 50) {
              callback();
            }
          }
        }
      })
    }

    /*判断android还是IOS*/
    Vue.prototype.clientType = function (adrCallback, iosCallback) {
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        if (adrCallback) {
          adrCallback();
        }
      } else {
        if (iosCallback) {
          iosCallback();
        }
      }
    }

    /*设置默认图片*/
    Vue.prototype.defaultImg = function (option) {
      var defaultImg = '';
      switch (option) {
        case 0:
          defaultImg = 'this.src = "' + require('../../images/loadError01.png') + '"';
          break;
        case 1:
          defaultImg = 'this.src = "' + require('../../images/loadError02.png') + '"';
          break;
        case 2:
          var n = Math.floor(Math.random() * 3);
          defaultImg = 'this.src = "' + require('../../images/head-photo' + n + '.png') + '"';
          break;
        case 3:
          defaultImg = 'this.src = "' + require('../../images/prize-jdcard.png') + '"';
          break;
      }
      return defaultImg;
    }

    /*弹出框显示时，禁止底层滑动*/
    Vue.prototype.setSlide = function (option) {
      this.clientType(function () {
        var html = document.documentElement, body = document.body, scrollTop = body.scrollTop;
        if (option === 0) {
          html.style.overflow = 'hidden';
          body.style.overflow = 'hidden';
          body.className = 'body-fixed';
          body.style.top = scrollTop * -1 + 'px';
        } else {
          html.style.overflowY = 'scroll';
          body.style.overflowY = 'scroll';
          body.className = '';
          body.scrollTop = body.style.top.slice(0, -2) * -1;
          body.style.top = null;
        }
      }, function () {
        let body = document.body;
        if (option === 0) {
          body.addEventListener('touchmove', function (e) {
            e.preventDefault();
          })
        } else {
          body.addEventListener('touchmove', function (e) {
            e.returnValue = true;
          })
        }
      })
    }

    /*APP内关闭浏览器*/
    Vue.prototype.closeBrowser = function () {
      this.clientType(function () {
        clearInterval(window.rainTimer);
        clearInterval(window.timer20);
        clearInterval(window.timer10);
        window.Android.startFunctionBack();
      }, function () {
        window.webkit.messageHandlers.AppModel.postMessage('back');
      })
    }

    /*返回按钮设置*/
    Vue.prototype.goBack = function () {
      this.setSlide();
      if (this.$route.query.native == 0) {
        this.$router.go(-1);
      } else if (this.$route.query.backHref == 1) {
        window.history.back();
      } else {
        if (this.$route.query.router && this.$route.query.router.indexOf('native=0') > -1) {
          this.$router.go(-1);
        } else {
          this.closeBrowser();
        }
      }
    }

    // 判断是否微信浏览器打开
    Vue.prototype.isWachat = function (isisWachat, isweibo, notWachat) {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        isisWachat();
      } else if (ua.match(/WeiBo/i) == "weibo") {
        isweibo();
      } else {
        notWachat();
      }
    }

    //设置cookie
    Vue.prototype.setCookie = function (name, value, expiresDays) {
      var cookieString = name + "=" + escape(value);
      //判断是否设置过期时间
      var date = new Date();
      date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
      cookieString = cookieString + "; expires=" + date.toGMTString() + "; path=/";
      document.cookie = cookieString;
    }

    //获取cookie
    Vue.prototype.getCookie = function (name) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name)return arr[1];
      }
      return "";
    }

    //跳转到登录页面
    Vue.prototype.goLogin = function () {
      let ua = navigator.userAgent;
      if (ua.indexOf("jfjingbao") > -1) {
        this.clientType(function () {
          window.Android.exitApp();
        }, function () {
          window.webkit.messageHandlers.AppModel.postMessage('logout');
        })
      } else if (ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        let url = window.location.origin + '/card/#/transition';
        switch (this.$route.path) {
          case '/openBox':
            url = url + '?open=2';
            break;
          case '/winningRecord':
            url = url + '?open=3';
            break;
          case '/prizeRecord':
            url = url + '?open=4';
            break;
          case '/exchange':
            url = url + '?open=5';
            break;
          case '/inviteFriends':
            url = url + '?open=6';
            break;
          case '/presentRecord':
            url = url + '?open=7';
            break;
          case '/prizeList':
            url = url + '?open=8';
            break;
        }
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx303bd1d29db76d97&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect';
      } else {
        let url = window.location.href,
          from = this.$route.path.slice(1);
        window.location.replace(url.slice(0, url.indexOf('/box')) + '/card/#/bindings?noWeChat=1&from=' + from)
      }
    }
  }
}
