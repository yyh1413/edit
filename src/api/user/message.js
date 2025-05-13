import request from "@/utils/request";

// 分页获取用户未读消息通知
export function notification(params) {
  return request({
    url: `/message/notification/all`,
    method: "get",
    params,
  });
}

//获取未读新消息的总数
export function notificationCount(params) {
  return request({
    url: `/message/notification/count`,
    method: "get",
    params,
  });
}

// 标记单个消息通知为已读
export function noticeRead(id) {
  return request({
    url: "/message/notification/read/" + id,
    method: "post",
  });
}
