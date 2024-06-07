import Cookies from 'js-cookie'
import qs from 'qs'

const TOKEN_KEY = 'TOKEN_KEY'
// 长缓存
export const loStore = {
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v))
  },
  get(k) {
    let val = ''
    try {
      val = JSON.parse(localStorage.getItem(k))
    } catch (error) {
      val = localStorage.getItem(k)
    }
    return val
  },
  clear() {
    localStorage.clear()
  }
}
export const seStore = {
  set(k, v) {
    sessionStorage.setItem(k, JSON.stringify(v))
  },
  get(k) {
    let val = ''
    try {
      val = JSON.parse(sessionStorage.getItem(k))
    } catch (error) {
      val = sessionStorage.getItem(k)
    }
    return val
  },
  clear() {
    sessionStorage.clear()
  }
}

export const setToken = (token) => {
  Cookies.set('user_token', token)
}
export const getToken = () => {
  return Cookies.get('user_token') || null
}
export const clearToken = () => {
  Cookies.remove('user_token')
}

export const downLoad = (url, method, fileName, data) => {
  let xmlResquest = new XMLHttpRequest()
  let qustr = ''
  if (method == 'GET') {
    qustr = qs.stringify(data)
  }
  xmlResquest.open(method, url + '?' + qustr, true) //post请求,根据路径和参数下载
  xmlResquest.withCredentials = true //携带Cookie
  xmlResquest.setRequestHeader('Content-type', 'application/json')
  xmlResquest.setRequestHeader('Authorization', getToken())
  xmlResquest.responseType = 'blob'
  xmlResquest.onload = function () {
    let content = xmlResquest.response
    let elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    let blob = new Blob([content])
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    document.body.removeChild(elink)
  }
  xmlResquest.send(data) //传递参数
}

export function reverseString(str) {
  // str.split('').reduceRight((prev,curr)=>prev+curr)
  var splitString = str.split('') // var splitString = "hello".split("");
  var reverseArray = splitString.reverse() // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
  var joinArray = reverseArray.join('') // var joinArray = ["o", "l", "l", "e", "h"].join("");
  return joinArray
}
/**
 * 静态资源路径转换
 * @param {} src
 * @param {*} dist
 */
export function repalceOrigin(src, targetOrgin) {
  // let s = new URL(src);
  return `${targetOrgin}${src}`
}

/**
 * 动态加载js
 * @param {*} url
 * @returns
 */
export const loadScript = (url) => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = url
  script.setAttribute('data-callType', 'callScript')
  document.body.appendChild(script)
  return new Promise((resolve, reject) => {
    script.onload = function () {
      resolve()
    }
    script.onerror = function (err) {
      reject(err)
    }
  })
}
/**
 * 删除js
 */
export const deleteScript = () => {
  const callScript = document.querySelectorAll("script[data-callType='callScript']")
  if (Array.isArray(callScript)) {
    for (let i = callScript.length - 1; i >= 0; i--) {
      // 一定要倒序，正序是删不干净的，可自行尝试
      document.body.removeChild(callScript[i])
    }
  }
}
