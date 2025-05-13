import request from "@/utils/request";

// 查询我的优惠券(门户)
export function listMyCouponPortal(query) {
  return request({
    url: "/payment/userCoupon/listMyCouponPortal",
    method: "get",
    params: query,
  });
}

// 验证优惠券选择（同时兼容优惠券查询）
export function validateCouponSelectionPortal(data) {
  return request({
    url: "/payment/userCoupon/validateCouponSelectionPortal",
    method: "post",
    data,
  });
}
