/**
 * description：登录静态信息，用于游客模式登录使用,icon使用elementPlus内部的icon
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
      label: '组件用例', // 菜单名
      icon: 'Setting', // 图标
      seq: 1 // 菜单编码
    },
    {
      id: 2,
      label: '公共表格',
      icon: 'Memo',
      seq: 2,
      parentSeq: 1, // 父级菜单编码
      url: '/home/table'
    },
    {
      id: 3,
      label: '404页面',
      icon: 'Memo',
      seq: 3,
      parentSeq: 1,
      url: '/home/noFound'
    },
    {
      id: 4,
      label: '树形输入框',
      icon: 'Memo',
      seq: 4,
      parentSeq: 1,
      url: '/home/formTree'
    },
    {
      id: 5,
      label: '组织架构图',
      icon: 'Memo',
      seq: 5,
      parentSeq: 1,
      url: '/home/dagMap'
    },
    {
      id: 6,
      label: '树形穿梭框',
      icon: 'Memo',
      seq: 6,
      parentSeq: 1,
      url: '/home/transferInput'
    }
  ]
};
