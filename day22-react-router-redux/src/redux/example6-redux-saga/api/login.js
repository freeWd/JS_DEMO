export default {
  login(username, passworld) {
    return new Promise((resolve, reject) => {
      if (username === "user" && passworld === "user") {
        const token = window.btoa(username+passworld)
        resolve(token);
      } else {
        reject('用户名&密码不正确');
      }
    });
  },

  logout() {
      return Promise.resolve('成功退出');
  },

  saveToken(token) {
    localStorage.setItem('react-test-token', token);
  },

  getToken() {
    return localStorage.getItem('react-test-token');
  },

  clearToken() {
    localStorage.removeItem('react-test-token');
  }
};

