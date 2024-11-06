<template>
  <div
    id="app"
    :class="{ 'dark-theme': theme }"
  >
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import { useShareStore } from '@/store';

  const shareStore = useShareStore();
  const theme = computed(() => shareStore.theme);
</script>

<style scoped>
  #app {
    font-family: Helvetica, Tahoma, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    min-width: 480px;
    overflow: hidden;
  }
</style>
