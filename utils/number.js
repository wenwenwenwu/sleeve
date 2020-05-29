//JavaScript语言本身的问题，造成了浮点数计算的不精确
//凡是涉及浮点数计算，都要使用这些方法

function accAdd(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (Math.round(num1 * baseNum) + Math.round(num2 * baseNum)) / baseNum;
}

function accMultiply(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (Math.round(num1 * baseNum) * Math.round(num2 * baseNum)) / baseNum / baseNum;
}

function accSubtract(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (Math.round(num1 * baseNum) - Math.round(num2 * baseNum)) / baseNum;
}


export {
  accAdd,
  accMultiply,
  accSubtract
}