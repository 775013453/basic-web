/**
 * description：静态信息，用于游客模式登录使用,icon使用elementPlus内部的icon
 * organization：self
 * author: almostSir
 * date：2024-07-17 18:06:29
 */

// icon参考地址：https://element-plus.org/zh-CN/component/icon.html#icon-collection
export const loginInfo = {
  accessToken: 'abcd123456789',
  baseAccountQueryVo: {
    accountName: '超级管理员'
  },
  datas: [
    {
      id: 1, // 菜单id
      label: '系统设置', // 菜单名
      icon: 'Setting', // 图标
      seq: 1 // 菜单编码
    },
    {
      id: 2, // 菜单id
      label: '字典管理',
      icon: 'Memo',
      seq: 2,
      parentSeq: 1, // 父级菜单编码
      url: '/home/table'
    }
  ]
};
