/**
 *
 * imgBaseUrl: 图片所在域名地址
 *
 */
var host = window.location.hostname, imgBaseUrl, yZBaseUrl, mediaUrl;
if (host == 'card-h5.zuanliantech.com' || host == 'www.zbqibing.com') {
  let urlList = ['http://i0-card.zuanliantech.com', 'http://i1-card.zuanliantech.com', 'http://i2-card.zuanliantech.com', 'http://i3-card.zuanliantech.com'];
  imgBaseUrl = function () {
    return urlList[Math.floor(Math.random() * 4)];
  }
  yZBaseUrl = 'http://www.ihaveu.com';
  mediaUrl = '/box';
} else {
  let urlList = ['http://10.3.201.6:8888'];
  imgBaseUrl = function () {
    return urlList[Math.floor(Math.random() * 1)];
  }
  yZBaseUrl = 'http://dww.ihaveu.com';
  if (host != 't-kp-h5.zuanliantech.com' && host != 'test-card.zuanliantech.com') {
    mediaUrl = '';
  } else {
    mediaUrl = '/box';
  }
}

export {
  imgBaseUrl,
  yZBaseUrl,
  mediaUrl
}
