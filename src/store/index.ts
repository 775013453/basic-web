/**
 * description：基于pinia的状态管理
 * organization：self
 * author: almostSir
 * date：2024-07-17 18:04:16
 */

export const useShareStore = defineStore('shareStore', {
  state: () => {
    return {
      theme: false // 主题色，false（白色），true（黑色）
    };
  },
  actions: {
    // 切换主题
    switchTheme(state: boolean) {
      this.theme = state;
    }
  }
});
