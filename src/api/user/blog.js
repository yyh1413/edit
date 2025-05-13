import request from "@/utils/request";

// 我的帖子
export function blogCollection(params) {
  return request({
    url: `/home/forumArticle/list`,
    method: "get",
    params,
  });
}

export function commentList(params) {
  return request({
    url: `/home/forumArticle/commentList`,
    method: "get",
    params,
  });
}

//删除我的帖子
export function deleteForumArticle(id) {
  return request({
    url: "/home/forumArticle/delete/"+id,
    method: "get"
  });
}
