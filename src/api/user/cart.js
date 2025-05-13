import request from "@/utils/request";

// 查询购物车列表
export function listMyCart(query) {
  return request({
    url: "/payment/cart/listMyCart",
    method: "get",
    params: query,
  });
}

// 修改购物车商品数量
export function editQuantity(data) {
  return request({
    url: "/payment/cart/editQuantity",
    method: "post",
    data: data,
  });
}

// 删除购物车
export function delCart(id) {
  return request({
    url: "/payment/cart/" + id,
    method: "delete",
  });
}

// 批量修改购物车商品选中状态
export function editSelectedBatch(data) {
  return request({
    url: "/payment/cart/editSelectedBatch",
    method: "post",
    data: data,
  });
}

// 分享购物车
export function shareCartItem(id) {
  return request({
    url: "/payment/cart/shareCartItem/" + id,
    method: "post",
  });
}

// 验证优惠券选择（同时兼容优惠券查询）
export function validateCoupon(data) {
  return request({
    url: "/payment/userCoupon/validateCouponSelectionPortal",
    method: "post",
    data,
  });
}

// 校验购物车下单商品是否存在过期商品
export function checkExpired(query) {
  return request({
    url: "/payment/cart/checkExpired",
    method: "post",
    params: query,
  });
}
