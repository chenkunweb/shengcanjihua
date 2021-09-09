import axios from 'axios';
const qs = require('qs')
let baseURL =  'https://www.zanty.net:444/'
//json
let http = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json;charset=utf-8'  },
});
function apiAxios(method, url, params, response) {
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
  }).then(function (res) {
    response(res);
  }).catch(function (err) {
    response(err);
  })
}
//通用
let https = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
  transformRequest: [function (data) {
    let newData = '';
    for (let k in data) {
      if (data.hasOwnProperty(k) === true) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
      }
    }
    return newData;
  }]
}); 
function apiAxio(method, url, params, response) {
  https({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
  }).then(function (res) {
    response(res);
  }).catch(function (err) {
    // response(err);
  })
}
//同步
const api = {
  
  async get (url, data) {
    try {
      let res = await axios.get(`${baseURL}${url}`, {params: data})
      res = res.data
      return new Promise((resolve) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    } catch (err) {
      console.log('服务器出错')
      console.log(data)
      let res = await axios.get(`${baseURL}${url}`, {params: data})
      res = res.data
      console.log(res)
      return new Promise((resolve) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    }
  },
  async post (url, data) {
    try {
      let res = await axios.post(`${baseURL}${url}`, qs.stringify(data))
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      // return (e.message)
      // alert('服务器出错')
      console.log(err)
    }
  },
}


export default {
  // 调用 this.$api.postJson
  postJson: function (url,params,response) {
    return apiAxios('POST', url,params,response)
  },
  // 调用 this.$api.get
  get: function (url,params,response) {
    return apiAxio('GET', url,params,response)
  },
  // 调用 this.$api.post
  post: function (url,params,response) {
    return apiAxio('POST', url,params,response)
  },
  // 调用 this.$api.api.get
  api
  
  
  
  
  
}