/**
 * description：基于pinia的状态管理
 * organization：self
 * author: almostSir
 * date：2024-07-17 18:04:16
 */

export const useShareStore = defineStore(
  'shareStore',
  () => {
    const theme = ref(false); // 主题色，false（白色），true（黑色）
    function switchTheme() {
      theme.value = !theme.value;
    }
    return { theme, switchTheme };
  },
  {
    persist: {
      paths: ['theme']
    }
  } // 数据持久化,仅仅将theme持久化,添加persist: true, 整个store都将被持久化存储
);
