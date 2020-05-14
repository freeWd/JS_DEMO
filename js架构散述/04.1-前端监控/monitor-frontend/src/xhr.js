class XhrHook {
  // 自身上报的请求无需拦截 ，不然会死循环！！
  static init(callBackFn) {
    if (window.XMLHttpRequest) {
      Util.handleXHR(callBackFn);
    }

    if (window.fetch) {
      Util.handleFetch(callBackFn);
    }
  }
}

const Util = {
  handleXHR(callBackFn) {
    let xhr = window.XMLHttpRequest;
    if (xhr._hook_flag) {
      return;
    }
    xhr._hook_flag = true;

    let _originOpen = xhr.prototype.open;
    xhr.prototype.open = function (method, url, async) {
      this._hook_xhr_info = {
        url,
        method,
        status: null,
      };
      return _originOpen.apply(this, arguments);
    };

    let _originSend = xhr.prototype.send;
    xhr.prototype.send = function (value) {
      let _self = this;
      _self._startTime = new Date();

      let ajaxEnd = (event) => {
        if (_self.response) {
          let responseSize = null;
          switch (_self.responseType) {
            case "json":
              responseSize = JSON && JSON.stringify(_this.response).length;
              break;
            case "blob":
            case "moz-blob":
              responseSize = _self.response.size;
              break;
            case "arraybuffer":
              responseSize = _self.response.byteLength;
            case "document":
              responseSize =
                _self.response.documentElement &&
                _self.response.documentElement.innerHTML &&
                _self.response.documentElement.innerHTML.length + 28;
              break;
            default:
              responseSize = _self.response.length;
          }
          _self._hook_xhr_info.event = event;
          _self._hook_xhr_info.status = _self.status;
          _self._hook_xhr_info.success =
            (_self.status >= 200 && _self.status <= 206) ||
            _self.status === 304;
          _self._hook_xhr_info.duration = Date.now() - _self._startTime; // 请求持续时间
          _self._hook_xhr_info.responseSize = responseSize; // 响应内容大小
          _self._hook_xhr_info.requestSize = value ? value.length : 0; // 请求内容大小
          _self._hook_xhr_info.type = "xhr"; // 类型

          callBackFn(_self._hook_xhr_info);
        }
      };

      // this ===> XHLHttpRequest
      if (this.addEventListener) {
        this.addEventListener("load", ajaxEnd("load"));
        this.addEventListener("error", ajaxEnd("error"));
        this.addEventListener("abort", ajaxEnd("abort"));
      }
      return _originSend.apply(this, arguments);
    };
  },

  handleFetch(callBackFn) {
      const _originFetch = window.fetch;
      window.fetch = function(...args) {
          const startTime = new Date();
          const fetchInput = args[0];
          let method = "GET";
          let url;

          if (typeof fetchInput === 'string') {
            url = fetchInput;
          } else if ('Request' in window && fetchInput instanceof window.Request) {
            url = fetchInput.url;
            if (fetchInput.method) {
                method = fetchInput.method;
            }
          } else {
              url = '' = fetchInput;
          }

          if (args[1] && args[1].method) {
            method = args[1].method;
          }

          let fetchData = {
            method: method,
            url: url,
            status: null,
          };

          return _originFetch.apply(this, args).then((resp) => {
            fetchData.status = resp.status;
            fetchData.type = 'fetch';
            fetchData.duration = new Date() - startTime;

            callBackFn(fetchData);
            return resp;
          })
      }
  },
};

export default XhrHook;
