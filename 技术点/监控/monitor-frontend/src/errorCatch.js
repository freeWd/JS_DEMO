class ErrorCatch {
  static init(callBackFn) {
    let _error = window.onerror;
    window.onerror = function (...args) {
      const [msg, url, lineTo, columnNo, error] = args;
      const errorInfo = Util.formatError(error);
      errorInfo._errorMsg = msg;
      errorInfo._scriptURI = url;
      errorInfo._lineTo = lineTo;
      errorInfo._columnNo = columnNo;
      errorInfo._type = 'onerror';
    
      console.log('异常信息处理 =====》 onerror =====》')
      callBackFn(errorInfo);
      // _error && _error.apply(this, args);
      return true;
    };

    let _onunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = function(...args) {
        let e = args[0];
        let reason = e.reason;
        
        const errorInfo = {
            type: e.type || 'unhandledrejection',
            reason
        }

        console.log('异常信息处理 =====》 onunhandledrejection =====》')
        callBackFn(errorInfo);
        return false;
        // _onunhandledrejection && _onunhandledrejection.apply(this, args);
    }
  }
}

const Util = {
  formatError(errObj) {
    let col = errObj.column || errObj.columnNumber; // Safari Firefox
    let row = errObj.line || errObj.lineNumber; // Safari Firefox
    let message = errObj.message;
    let name = errObj.name;
    let { stack } = errObj;
    // ReferenceError: b is not defined at http://localhost:8080/:10:21
    if (stack) {
      let matchUrl = stack.match(/https?:\/\/[^\n]+/)[0];
      let rowColumn = matchUrl.match(/https?:\/\/[\S]+(:\d+:\d+)/)[1];
      let index = matchUrl.indexOf(rowColumn);

      let errorUrl = matchUrl.slice(0, index);
      let [, errRow, errColumn] = rowColumn.match(/:(\d+):(\d+)/);

      return {
        content: stack,
        col: Number(col || errColumn),
        row: Number(row || errRow),
        message,
        name,
        errorUrl,
      };
    }
    return {
      col,
      row,
      message,
      name,
    };
  },
};

export default ErrorCatch;


// 关于异常的信息获取还有要考虑 现代化的使用webpack打包后的应用，应用的代码都被混淆压缩，无法准确获取错误信息
// 关于这类错误，需要保留打包后的sourceMap文件，通过工具将编译后的代码转化为源码
// 查看 app-source-map.js文件 查看此类问题的demo
