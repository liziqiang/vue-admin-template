import request from '@/utils/request'
import { getToken } from '@/utils/auth' // get token from cookie

export function getPerm(params) {
  const hasToken = getToken()
  if (hasToken) {
    return request({
      url: '/vue-admin-template/perm/list',
      method: 'get',
      params
    }).then((res) => res?.data?.perms || [])
  } else {
    return Promise.resolve([])
  }
}
