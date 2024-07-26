/**
 * description：axios请求封装及接口拦截处理
 * organization：self
 * author: almostSir
 * date：2024-07-17 17:54:43
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let vm: any; // vue全局变量
/**
 * description：设置vue全局变量，主要供loading,message等组件使用
 * author: almostSir
 * date：2024-07-26 11:07:09
 */
export const vueThis = (_this) => {
  vm = _this.config.globalProperties;
};

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
    const loading = vm.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    });
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
            if (loading.visible) {
              loading.close();
            }
            clearTimeout(t);
          }, 500);
        })
        .catch((error) => {
          // 处理接口外部异常，包括无网络，http协议内status为非200的所有情况
          const data = error?.response?.data;
          if (vm) {
            vm.$message({
              showClose: true,
              message: data.msg || data.error || '服务异常，请联系网站管理员！',
              type: 'error',
              duration: 1500,
              onClose: () => {
                if (data.opCode === '00002') {
                  sessionStorage.clear();
                  vm.$router.push(`${location.host}${location.pathname}`);
                }
              }
            });
          } else {
            alert(data.msg || data.error || '服务异常，请联系网站管理员！');
          }
          reject(data);
          const t = setTimeout(() => {
            if (loading.visible) {
              loading.close();
            }
            clearTimeout(t);
          }, 500);
        });
    });
  } else {
    if (vm) {
      vm.$message({
        showClose: true,
        message: '抱歉，账户已失效，请重新登录！',
        type: 'error',
        duration: 1500,
        onClose: () => {
          sessionStorage.clear();
          vm.$router.push(`${location.host}${location.pathname}`);
        }
      });
    } else {
      alert('抱歉，账户已失效，请重新登录！');
      window.open(`${location.host}${location.pathname}`);
    }
    return new Promise((resolve) => {
      resolve('抱歉，账户已失效，请重新登录！');
    });
  }
}

export const axiosRequest = request;
