import axios from 'axios';
import store from '../store';
import { getLocal } from './storage';

// 当第一次请求显示loading, 剩下的请求都不调用，当都请求完毕后，再隐藏loading
class AjaxRequest {
    constructor() {
        // 请求的路径
        this.baseUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';
        this.timeout = 3000;
        this.queue = {};
    }

    mergeOption(options) {
        return {
            ...options,
            baseURL: this.baseUrl,
            timeout: this.timeout
        }
    }

    // 设置拦截器
    setInterceptor(url) {
        // 如果上一个promise返回了一个常量 会作为下一个promise的输入
        // 请求拦截器 - 可以添加自定义的请求头
        if (axios.interceptors.request.handlers.length === 0) {
            axios.interceptors.request.use(req => {
                req.headers.authorization = getLocal('token');
                if (Object.keys(this.queue).length === 0) {
                    store.commit('showLoading');
                }
                this.queue[url] = url;
                return req;
            });
        }
        if (axios.interceptors.response.handlers.length === 0) {
            // 响应数据拦截器
            axios.interceptors.response.use((res) => {
                delete this.queue[url]; // 每次请求结束后删除队列里面的路径
                if (Object.keys(this.queue).length === 0) {
                    store.commit('hiddenLoading');
                }
                return res.data;
            });
        }
    }

    request(options) {
        this.setInterceptor(options.url);
        return axios(this.mergeOption(options));
    }
}

export default new AjaxRequest();