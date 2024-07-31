/**
 * description：全局系统字典
 * organization：self
 * author: almostSir
 * date：2024-07-17 15:38:41
 */

export let SYSTEM_DICT: DObject = {
  // 性别
  gender: [
    { label: '男性', value: '1' },
    { label: '女性', value: '2' },
    { label: '其他', value: '99' }
  ],
  // 是否有效
  valid: [
    { label: '有效', value: '1' },
    { label: '无效', value: '0' }
  ],
  // 是否有效
  whether: [
    { label: '是', value: '1' },
    { label: '否', value: '0' }
  ]
};

/**
 * description：更新系统字典数据，建议在使用前更新，例如：登录后更新
 * author: almostSir
 * date：2024-07-26 10:28:49
 */
export function updateDict(data: DObject) {
  SYSTEM_DICT = data;
}
