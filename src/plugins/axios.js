// "use strict";
//
// import Vue from 'vue';
// import axios from "axios";
//
// // Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = import.meta.env.baseURL || import.meta.env.apiUrl || '';
// // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//
// let config = {
//   // baseURL: import.meta.env.baseURL || import.meta.env.apiUrl || ""
//   // timeout: 60 * 1000, // Timeout
//   // withCredentials: true, // Check cross-site Access-Control
// };
//
// const _axios = axios.create(config);
//
// _axios.interceptors.request.use(
//   function(config) {
//     // Do something before request is sent
//     return config;
//   },
//   function(error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );
//
// // Add a response interceptor
// _axios.interceptors.response.use(
//   function(response) {
//     // Do something with response data
//     return response;
//   },
//   function(error) {
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );
//
// Plugin.install = function(Vue, options) {
//   Vue.axios = _axios;
//   window.axios = _axios;
//   Object.defineProperties(Vue.prototype, {
//     axios: {
//       get() {
//         return _axios;
//       }
//     },
//     $axios: {
//       get() {
//         return _axios;
//       }
//     },
//   });
// };
//
// Vue.use(Plugin)
//
// export default Plugin;

import axios from "axios";

// Axios 기본 설정
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || '';

// Axios 인스턴스 생성
let config = {
  // 예시로 timeout이나 credentials 설정
  // timeout: 60 * 1000,
  // withCredentials: true,
};

const _axios = axios.create(config);

// 요청 인터셉터 추가
_axios.interceptors.request.use(
    function(config) {
      // 요청 전에 할 작업
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
_axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      return Promise.reject(error);
    }
);

const Plugin = {
  install(app) {
    app.config.globalProperties.$axios = _axios;
    // window.axios도 설정하려면 추가할 수 있음
    window.axios = _axios;
  }
};

export default Plugin;
