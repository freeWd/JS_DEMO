const fetch = require("node-fetch");
const config = require('../config');

class SafeFetch {
  constructor(url, params) {
    this.url =  config.baseUrl  + url;
    this.params = params || {};
  }

  fetch() {
    return new Promise((resolve, reject) => {
      const resultJson = {
        code: 0,
        msg: "",
        data: null
      };
      fetch(this.url, this.params)
        .then(res => {
          let jsonResult = {};
          try {
            jsonResult = res.json();
          } catch (error) {
            // 预警 发邮件
          }
          return jsonResult;
        })
        .then(result => {
          if (result) {
            resultJson.data = result;
            resolve(resultJson);
          }
        })
        .catch(err => {
          console.log(err);
          resultJson.code = 1;
          resultJson.msg = "通讯异常";
          reject(resultJson);
        });
    });
  }
}


module.exports = SafeFetch;