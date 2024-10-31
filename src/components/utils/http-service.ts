/**
 * description：axios请求封装及接口拦截处理
 * organization：self
 * author: almostSir
 * date：2024-07-17 17:54:43
 */

import { ElLoading } from 'element-plus';

let whitelist = ['login']; // 接口白名单列表，即无论token是否存在均可以调用接口

/**
 * description：设置接口白名单，即无论token是否存在均可以调用接口
 * author: almostSir
 * date：2024-07-26 11:08:03
 */
export function setWhitelist(data: Array<string>) {
  whitelist = data;
}

/**
 * description：根据url检测是否在白名单内，模糊检测
 * author: almostSir
 * date：2024-07-26 11:08:53
 */
function testWhitelist(url: string) {
  const state = whitelist.some((e) => {
    if (url.includes(e)) {
      return true;
    }
  });
  return state;
}

/**
 * description：GET请求参数拼接处理
 * author: almostSir
 * date：2024-07-26 10:45:32
 */
function paramsJoin(url: string, params): string {
  for (const k of Object.keys(params)) {
    if (url.includes('?')) {
      url += `&${k}=${params[k]}`;
    } else {
      url += `?${k}=${params[k]}`;
    }
  }
  return url;
}

/**
 * description：发送请求，data参数：{url, method, params},params参数为{key:value}
 * author: almostSir
 * date：2024-07-26 10:46:03
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function request(data: RequestOptions): Promise<any> {
  const token = sessionStorage.getItem('_sid');
  if (token || testWhitelist(data.url)) {
    const loadingInstance = ElLoading.service({ fullscreen: true });
    let axiosParams = {};
    if (data.method === 'GET') {
      if (data.params) {
        data.url = paramsJoin(data.url, data.params);
      }
      axiosParams = {
        method: data.method,
        url: data.url,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    } else if (data.method === 'POST' || data.method === 'PUT' || data.method === 'DELETE') {
      axiosParams = {
        method: data.method,
        url: data.url,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: data.params
      };
    } else {
      return new Promise((resolve) => {
        resolve('抱歉，请求方法不支持');
      });
    }
    return new Promise((resolve, reject) => {
      axios(axiosParams)
        .then((res) => {
          resolve(res);
          const t = setTimeout(() => {
            loadingInstance.close();
            clearTimeout(t);
          }, 500);
        })
        .catch((error) => {
          // 处理接口外部异常，包括无网络，http协议内status为非200的所有情况
          const data = error?.response?.data;
          ElMessageBox.alert(data.msg || data.error || '服务异常，请联系网站管理员！', '错误', {
            confirmButtonText: '关闭',
            callback: () => {
              sessionStorage.clear();
              window.open('/', '_self');
            }
          });
          reject(data);
          const t = setTimeout(() => {
            loadingInstance.close();
            clearTimeout(t);
          }, 500);
        });
    });
  } else {
    ElMessageBox.alert('抱歉，账户已失效，请重新登录！', '提示', {
      confirmButtonText: '退出',
      callback: () => {
        sessionStorage.clear();
        window.open('/', '_self');
      }
    });

    return new Promise((resolve) => {
      resolve('抱歉，账户已失效，请重新登录！');
    });
  }
}

export const axiosRequest = request;
