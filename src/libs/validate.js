let specialText = ''
/**
 * 特殊字符规则
 */
function checkSpecialKey(str) {
  if (str === null || str === undefined || str === '') return true
  const specialKey = `~!#$%^&*=<>?"{}|;'\\[]·~！#¥%……&*——={}|《》？：“”【】、；‘'，。、`
  const special =
    '----|____|select|update|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute'
  const arry = special.split('|')
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
      specialText = str.substr(i, 1)
      return false
    }
  }
  for (let k = 0; k < arry.length; k++) {
    if (str.indexOf(arry[k]) !== -1) {
      specialText = arry[k]
      return false
    }
  }
  specialText = ''
  return true
}

// 特殊字符校验
function validateSpecialKey(rule, value, callback) {
  if (!checkSpecialKey(value.toString())) {
    callback(new Error(`不能输入特殊字符 ${specialText}`))
  } else {
    callback()
  }
}
/**
 * 表单校验规则对象添加特殊字符校验
 */
export function validateSpecial(obj) {
  Object.values(obj).forEach((val) => {
    val.push({ validator: validateSpecialKey, trigger: 'blur' })
  })
}
