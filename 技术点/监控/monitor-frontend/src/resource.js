class Resource {
  static init(callBackFn) {
    const performance =
      window.performance ||
      window.mozPerformance ||
      window.msPerformance ||
      window.webkitPerformance;

    if (!performance) {
      return;
    }

    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const resourceInfoArr = Util.format(entries);
        console.log("=====> resource ====>");
        callBackFn(resourceInfoArr);
      });
      observer.observe({ entryTypes: ["resource"] });
    } else {
      if (performance.readyState === "complete") {
        const entries = performance.getEntriesByType("resource");
        const resourceInfoArr = Util.format(entries);
        console.log("=====> resource ====>");
        callBackFn(resourceInfoArr);
      } else {
        window.addEventListener("load", () => {
          const entries = performance.getEntriesByType("resource");
          const resourceInfoArr = Util.format(entries);
          console.log("=====> resource ====>");
          callBackFn(resourceInfoArr);
        });
      }
    }
  }
}

const Util = {
  format(entries) {
    return entries.map((item) => this.resolvePerformanceTiming(item));
  },

  resolvePerformanceTiming(timing) {
    function filterTime(a, b) {
      return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
    }

    return {
      initiatorType: timing.initiatorType, // initiatorType 表示初始化性能条目的资源类型 eg：xmlhttprequest
      name: timing.name, // name == resources URL | eg: http://localhost:8080/sockjs-node/info?t=1589418505919
      duration: parseInt(timing.duration), // 它是responseEnd和startTime属性之间的差异
      redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 重定向
      dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS解析
      connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连
      network: filterTime(timing.connectEnd, timing.startTime), // 网络总耗时

      send: filterTime(timing.responseStart, timing.requestStart), // 发送开始到接受第一个返回
      receive: filterTime(timing.responseEnd, timing.responseStart), // 接收总时间
      request: filterTime(timing.responseEnd, timing.requestStart), // 总时间

      ttfb: filterTime(timing.responseStart, timing.requestStart), // 首字节时间
    };
  },
};

export default Resource;
