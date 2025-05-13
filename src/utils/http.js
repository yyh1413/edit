import request from "@/utils/request";


const post = (url, data) => {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}
const get = (url, params) => {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

export default {
  post,
  get
}