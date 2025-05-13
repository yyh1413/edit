import request from "@/utils/request";

// 用户盲盒列表
export function userBlindBox(params) {
  return request({
    url: `/payment/userBlindBox/list`,
    method: "get",
    params,
  });
}

// 拆开盲盒
export function userBlindBoxOpen(id) {
  return request({
    url: `/payment/userBlindBox/open/${id}`,
    method: "post",
  });
}
