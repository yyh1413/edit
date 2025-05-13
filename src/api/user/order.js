import request from "@/utils/request";

// 新增订单新增订单
export function addOrder(data) {
  return request({
    url: "/payment/orders/addOrder",
    method: "post",
    data: data,
  });
}

// 获取支付二维码
export function preOrder(data) {
  return request({
    url: "/payment/payment/preOrder",
    method: "post",
    data: data,
  });
}

// 查询支付状态
export function checkPaymentStatus(paymentNo) {
  return request({
    url: `/payment/payment/checkPaymentStatus/${paymentNo}`,
    method: "get",
  });
}

// 查询我的订单列表
export function listMyOrdersPortal(params) {
  return request({
    url: `/payment/orders/listMyOrdersPortal`,
    method: "get",
    params,
  });
}

// 手动查询渠道交易状态
export function queryChannelPaymentStatus(paymentNo) {
  return request({
    url: `/payment/payment/queryChannelPaymentStatus/${paymentNo}`,
    method: "get",
  });
}

// 新增开票申请
export function invoiceApplication(data) {
  return request({
    url: "/payment/invoiceApplication/add",
    method: "post",
    data: data,
  });
}

// 查询未支付订单总数
export function myUnpaidCount(paymentNo) {
  return request({
    url: `/payment/orders/myUnpaidCount`,
    method: "get",
  });
}

// 余额支付
export function balancePay(data) {
  return request({
    url: "/payment/payment/balancePay",
    method: "post",
    data: data,
  });
}

// 退款申请
export function refundMoneyApplication(data) {
  return request({
    url: "/payment/payment/refundMoneyApplication",
    method: "post",
    data: data,
  });
}

// 查询我的未支付订单列表
export function listMyUnpaidOrders(params) {
  return request({
    url: `/payment/orders/listMyUnpaidOrders`,
    method: "get",
    params,
  });
}

// 查询我的已支付订单列表
export function listPaidOrdersPortal(params) {
  return request({
    url: `/payment/orders/listPaidOrdersPortal`,
    method: "get",
    params,
  });
}
