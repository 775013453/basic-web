/**
 * description：系统及请求接口配置
 * organization：self
 * author: almostSir
 * date：2024-07-17 17:36:16
 */

import { COMMON_FUNC } from '@/components/utils/common-func';

export const SYSTEM_CONFIG = {
  systemName: '',
  version: '0.0.0.1',
  visitorMode: false // 游客模式，免登录，访问静态菜单，设置成false则走后端服务登录并动态获取服务端配置的菜单信息
};

// 系统基本的URI路径配置
let BASE_URL = import.meta.env.VITE_APP_BASE_API;
COMMON_FUNC.ajaxRequest({
  url: './json/server-ip.json',
  method: 'GET',
  isAsync: false,
  callBack: (data) => {
    BASE_URL = data.basePath;
    SYSTEM_CONFIG.systemName = data.systemName || import.meta.env.VITE_APP_TITLE;
  }
});

// 系统请求接口配置
export const API_URLS = {
  // 登录/登出/验证码接口
  login: `${BASE_URL}/api/login`, // 登录
  logout: `${BASE_URL}/api/logout`, // 登出
  getPhoneVerifyCode: `${BASE_URL}/api/getPhoneVerifyCode`, // 获取短信验证码
  updatePassword: `${BASE_URL}/api/updatePassword`, // 更新密码

  // 字典管理接口
  dictList: `${BASE_URL}/api/dict/list`, // 字典列表
  dictDetail: `${BASE_URL}/api/dict/findById`, // 字典详情
  dictListAll: `${BASE_URL}/api/dict/listAll`, // 字典列表所有数据
  dictSaveOrUpdate: `${BASE_URL}/api/dict/saveOrUpdateAll`, // 字典列表批量新增/更新
  dictDelete: `${BASE_URL}/api/dict/delete` // 字典删除
};
