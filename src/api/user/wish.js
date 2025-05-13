import request from "@/utils/request";

// 我的需求池
export function listMyDemandPool(paymentNo) {
  return request({
    url: `/system/demandPool/listMyDemandPool`,
    method: "get",
  });
}

// 我的投票
export function listMyVotes(paymentNo) {
  return request({
    url: `/system/demandPool/listMyVotes`,
    method: "get",
  });
}
