import axios from '../libs/ajaxRequest';

export const login = (username) => {
    return axios.request({
        url: '/login',
        method: 'post',
        data: {
            username
        }
    })
}

export const valideUser = () => {
    return axios.request({
        url: '/verify',
        method: 'get',
    })
}