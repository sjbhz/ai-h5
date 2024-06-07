import CryptoJS from 'crypto-js'

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
const key = CryptoJS.enc.Utf8.parse('sRjKHaW6n3cTozey')
// const iv = CryptoJS.enc.Latin1.parse("\x00" * 16);

export function decrypt(str) {
  let decrypt = CryptoJS.AES.decrypt(str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr
}
/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encrypt(str) {
  let encrypted = CryptoJS.AES.encrypt(str, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString()))
}

/**
 * 摘要方法
 * @param data
 * @returns {string}
 */
export function SHA256(encryptedData) {
  return CryptoJS.SHA256(encryptedData).toString()
}
