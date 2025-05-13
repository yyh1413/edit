import request from "@/utils/request";

// 查询我的会员信息
export function myMemberInfo() {
  return request({
    url: "/member/member/myMemberInfo",
    method: "get",
  });
}

// 发送支付密码设置验证码
export function getResetSms(data) {
  return request({
    url: "/member/member/payment/sms",
    method: "post",
    data: data,
  });
}

// 发送支付密码设置验证码
export function updatePaymentPassword(data) {
  return request({
    url: "/member/member/payment/updatePaymentPassword",
    method: "post",
    data: data,
  });
}
//
export function setPaymentPassword(data) {
  return request({
    url: "/member/member/payment/setPaymentPassword",
    method: "post",
    data: data,
  });
}

// 查询所有会员等级
export function memLevelAll() {
  return request({
    url: "/member/memLevel/all",
    method: "get",
  });
}

// 查询所有会员等级并计算升级提示
export function listWithUpgradeInfo() {
  return request({
    url: "/member/memLevel/listWithUpgradeInfo",
    method: "get",
  });
}

// 查询我的从账号列表
export function mySubAccounts() {
  return request({
    url: "/member/member/mySubAccounts",
    method: "get",
  });
}

// 绑定从账号
export function bindSubAccount(params) {
  return request({
    url: "/member/member/bindSubAccount",
    method: "post",
    params,
  });
}

// 删除从账号绑定
export function unbindSubAccount(params) {
  return request({
    url: "/member/member/unbindSubAccount",
    method: "post",
    params,
  });
}

// 查询当前会员是否已设置支付密码
export function paymentPasswordStatus() {
  return request({
    url: "/member/member/paymentPassword/status",
    method: "get",
  });
}

// 创建充值订单
export function rechargeCreate(data) {
  return request({
    url: "/payment/recharge/create",
    method: "post",
    data: data,
  });
}

// 首次设置支付密码
export function setInitialPaymentPassword(data) {
  return request({
    url: "/member/member/payment/setInitialPaymentPassword",
    method: "post",
    data: data,
  });
}

// PLUS会员包购买金额查询
export function plusAmount() {
  return request({
    url: "/member/memLevel/plusAmount",
    method: "get",
  });
}

// 创建订阅订单(plus)
export function memberPlusRecharge(data) {
  return request({
    url: "/payment/memberPlusRecharge/create",
    method: "post",
    data: data,
  });
}
