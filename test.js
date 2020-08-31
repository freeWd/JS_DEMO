function ismobile() {
  var mobileArry = [
    "iPhone",
    "iPad",
    "Android",
    "Windows Phone",
    "BB10; Touch",
    "BB10; Touch",
    "PlayBook",
    "Nokia",
  ];
  var ua = navigator.userAgent;
  var res = mobileArry.filter(function (arr) {
    return ua.indexOf(arr) > 0;
  });
  return res.length > 0;
}


var flag = ismobile();



if (!flag) {
  let zftoken = localStorage.getItem("zftoken");
  if (zftoken) {
    var str = window.atob(zftoken);
    if (!/\d+@\d+/.test(str)) {
      localStorage.removeItem("zftoken");
    }
  }
  let zftoken2 = localStorage.getItem("zftoken");
  if (!zftoken2) {
    let str = prompt("please input your username");
    if (/\d+@\d{4}/.test(str)) {
      var enc = window.btoa(str);
      localStorage.setItem("zftoken", enc);
    } else {
      window.location = "http://www.zhufengpeixun.cn";
    }
  }
}
