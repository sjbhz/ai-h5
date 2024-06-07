import Axios from 'axios'
import { getToken, loStore, clearToken } from '@/libs/util'
import { encrypt, SHA256 } from '@/libs/aes.js'
class HttpRequest {
  constructor() {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }
  // 销毁请求实例
  destroy(url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors(instance) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // console.log("******************上送报文*****************");
        const token = getToken()
        if (token && token !== 'undefined') {
          config.headers['Authorization'] = token // 让每个请求携带token
          config.headers['x-access-token'] = token
          config.headers['token'] = token
          if (config.data !== '' && typeof config.data !== 'undefined') {
            // AES加密
            let encryptRes = encrypt(JSON.stringify(config.data))
            // sha256摘要
            let sign = SHA256(encryptRes)
            config.headers['sign'] = sign
          }
        }
        return config
      },
      (error) => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
    // 添加响应拦截器
    instance.interceptors.response.use(
      (res) => {
        let { data } = res
        console.log('******************返回报文*****************')
        return data
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
  // 创建实例
  create() {
    let conf = {
      // baseURL: '/',
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 60 * 1000,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json; charset=utf-8',
        'X-URL-PATH': location.pathname
      }
    }
    return Axios.create(conf)
  }

  handleError(error) {
    return Promise.reject(error)
  }
  // 请求实例
  request(options) {
    const instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }

  get(url, params) {
    return this.request({ url, params, method: 'get' }).catch(this.handleError)
  }

  post(url, data) {
    return this.request({ url, data, method: 'post' }).catch(this.handleError)
  }

  put(url, data) {
    return this.request({ url, data, method: 'put' }).catch(this.handleError)
  }

  delete(url, data) {
    return this.request({ url, data, method: 'delete' }).catch(this.handleError)
  }
}

const http = new HttpRequest()
export default http
