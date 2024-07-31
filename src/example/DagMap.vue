<template>
  <article class="main">
    <tree-map :treeData="menus"></tree-map>
  </article>
</template>

<script lang="ts" setup>
  import { TREE_MOCK } from '@/config/tree-config';
  const menus = TREE_MOCK;
</script>
<style lang="scss" scoped>
  .main {
    background: rgba(0, 0, 0, 0.15);
  }
</style>
