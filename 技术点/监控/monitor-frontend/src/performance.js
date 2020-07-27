// 参考文档：https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming
// 主要获取页面加载性能相关的数据

class Performance {
  static init(callBackFn) {
    const performance =
      window.performance ||
      window.mozPerformance ||
      window.msPerformance ||
      window.webkitPerformance;
    Util.domReady(performance).then((result) => {
      console.log('性能分析结构 =====》 DomReady 阶段 =====》')
      callBackFn(result)
    });
    Util.onload(performance).then((result) => {
      console.log('性能分析结构 =====》 Onload 阶段 =====》')
      callBackFn(result)
    });
  }
}

const Util = {
  // DOM解析完成
  domReady(performance) {
    return new Promise((resolve) => {
      if (document.readyState === "interactive") {
        resolve(runCheck());
      } else {
        Util.addEventListener("DOMContentLoaded", function () {
          resolve(runCheck());
        });
      }
    });

    function runCheck() {
      return new Promise((resolve) => {
        let timer;
        if (performance.timing.domInteractive) {
          clearTimeout(timer);
          resolve(reportPerformance(performance));
        } else {
          timer = setTimeout(() => {
            resolve(runCheck());
          }, 100);
        }
      });
    }
  },

  // DOM加载完成
  onload(performance) {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(runCheck());
      } else {
        Util.addEventListener("load", function () {
          resolve(runCheck());
        });
      }
    });

    function runCheck() {
      return new Promise((resolve) => {
        let timer;
        if (performance.timing.loadEventEnd) {
          clearTimeout(timer);
          resolve(reportPerformance(performance));
        } else {
          timer = setTimeout(() => {
            resolve(runCheck());
          }, 100);
        }
      });
    }
  },

  addEventListener: function (name, callback) {
    if (window.addEventListener) {
      return window.addEventListener(name, callback);
    } else if (window.attachEvent) {
      return window.attachEvent("on" + name, callback);
    }
  },
};

function reportPerformance(performance) {
  function filterTime(a, b) {
    return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
  }
  const perTime = performance.timing;
  return {
    // 网络建连
    pervPage: filterTime(perTime.fetchStart, perTime.navigationStart), // 上一个页面完全销毁时间
    redirect: filterTime(perTime.responseEnd, perTime.redirectStart), // 页面重定向时间
    dns: filterTime(perTime.domainLookupEnd, perTime.domainLookupStart), // DNS查找时间
    connect: filterTime(perTime.connectEnd, perTime.connectStart), // TCP建连时间
    network: filterTime(perTime.connectEnd, perTime.navigationStart), // 网络总耗时

    // 网络接收
    send: filterTime(perTime.responseStart, perTime.requestStart), // 前端从发送到接收到后端第一个返回
    receive: filterTime(perTime.responseEnd, perTime.responseStart), // 接收页面时间
    request: filterTime(perTime.responseEnd, perTime.requestStart), // 请求页面总时间

    // 前端渲染
    dom: filterTime(perTime.domComplete, perTime.domLoading), // dom解析时间
    loadEvent: filterTime(perTime.loadEventEnd, perTime.loadEventStart), // loadEvent时间
    frontend: filterTime(perTime.loadEventEnd, perTime.domLoading), // 前端总时间

    // 关键阶段
    load: filterTime(perTime.loadEventEnd, perTime.navigationStart), // 页面完全加载总时间
    domReady: filterTime(
      perTime.domContentLoadedEventStart,
      perTime.navigationStart
    ), // domready时间
    interactive: filterTime(perTime.domInteractive, perTime.navigationStart), // 可操作时间
    ttfb: filterTime(perTime.responseStart, perTime.navigationStart), // 首字节时间
  };
}

export default Performance;
