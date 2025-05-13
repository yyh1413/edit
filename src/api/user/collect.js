import request from "@/utils/request";

// 查询我收藏的商品
export function productCollection(params) {
  return request({
    url: `/product/productCollection`,
    method: "get",
    params,
  });
}

// 查询我收藏的工具
export function toolCollection(params) {
  return request({
    url: `/product/toolCollection`,
    method: "get",
    params,
  });
}

// 查询我收藏的博客
export function blogCollection(params) {
  return request({
    url: `/home/forumArticle/forumArticleCollection`,
    method: "get",
    params,
  });
}

// 查询我收藏的博主
export function userCollection(params) {
  return request({
    url: `/system/user/userCollection`,
    method: "get",
    params,
  });
}

// 查询我收藏的商铺
export function representativeCollection(params) {
  return request({
    url: `/system/representative/representativeCollection`,
    method: "get",
    params,
  });
}
