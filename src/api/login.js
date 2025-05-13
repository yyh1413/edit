import request from "@/utils/request";

// 短信登录方法
export function smsLogin(mobile, smsCode, uuid) {
  const data = {
    mobile,
    smsCode,
    uuid,
  };
  return request({
    url: "/sms/login",
    method: "post",
    data: data,
  });
}

// 发送短信验证码
export function getSmsCode(data) {
  return request({
    url: "/sendEmailCaptcha",
    method: "post",
    data,
  });
}

// 发送邮箱验证码
export function getEmailCode(email) {
  const data = {
    email,
  };

  return request({
    url: "/email/code",
    method: "post",
    data: data,
  });
}
// getIpLocationApi
export function getIpLocationApi(params) {
  return request({
    url: "/api/homeIp/address",
    method: "post",
    data: params,
  });
}
// 数据上报
export function reportDataApi(data) {
  return request({
    url: "/system/address/add",
    method: "post",
    data,
  });
}


// 登录方法
// export function login(username, password, code, uuid) {
//   const data = {
//     username,
//     password,
//     code,
//     uuid
//   }
//   return request({
//     url: '/login',
//     headers: {
//       isToken: false,
//       repeatSubmit: false
//     },
//     method: 'post',
//     data: data
//   })
// }

// 账号密码登录方法
export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data: data,
  });
}

// 注册方法
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get",
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    headers: {
      isToken: false,
    },
    method: "get",
    timeout: 20000,
  });
}

//获取用户助力信息
export function getSupportInfo() {
  return request({
    url: "/getSupportInfo",
    method: "get",
  });
}

// 获取微信登录二维码参数
export function getQrcodeParams() {
  return request({
    url: "/wechatLogin/qrcodeParams",
    method: "get",
  });
}

// 绑定手机号
export function bindPhone(data) {
  return request({
    url: "/wechatLogin/bind/phone",
    method: "post",
    data: data,
  });
}

// 发送验证码
export function sendCode(phone, tmpTk, captchaToken) {
  return request({
    url: "/wechatLogin/bind/code",
    method: "post",
    data: { phone: phone, tempToken: tmpTk, captchaToken: captchaToken },
  });
}

// 检查登录状态
export function checkLoginStatus(state) {
  return request({
    url: "/wechatLogin/checkStatus/" + state,
    method: "get",
  });
}

// 发送找回密码验证码
export function getResetSms(data) {
  return request({
    url: "/resetPassword/sms",
    method: "post",
    data: data,
  });
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: "/resetPassword/reset",
    method: "post",
    data: data,
  });
}

export function clearPhonenum(data) {
  return request({
    url: "/resetPassword/clearPhonenum",
    method: "post",
    data: data,
  });
}

export function setPhonenum(data) {
  return request({
    url: "/resetPassword/setPhonenum",
    method: "post",
    data: data,
  });
}
