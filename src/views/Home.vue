<template>
  <article class="main">
    <div>
      <h1>{{ systemConfig.systemName }}-{{ systemConfig.version }}-{{ systemConfig.visitorMode }}</h1>
      <h2>主题：{{ theme }}</h2>
      <button @click="shareStore.switchTheme()">切换主题</button>
    </div>
  </article>
</template>

<script lang="ts" setup>
  import { useShareStore } from '@/store';
  import { SYSTEM_CONFIG } from '@/utils/system-config';

  const shareStore = useShareStore(),
    theme = computed(() => shareStore.theme),
    systemConfig = SYSTEM_CONFIG; // 主题色，默认为false（白色），可以设置成true（黑色）
</script>
<style lang="scss" scoped>
  .main {
    padding: 16px;
  }
</style>
