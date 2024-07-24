<template>
  <article class="main">
    <menu-tree :menus="menus"></menu-tree>
    <div class="router"><router-view /></div>
  </article>
</template>

<script lang="ts" setup>
  import { loginInfo } from '@/config/login-config';
  import { commonFunc } from '@/utils/common-func';

  const tempMenus = commonFunc.arrayAssembleTree({
    data: loginInfo.datas as Array<TNode>,
    field: 'seq',
    parentField: 'parentSeq'
  });
  const menus = tempMenus.children;
</script>
<style lang="scss" scoped>
  .main {
    display: flex;
    box-sizing: border-box;
  }
  .router {
    flex: 1;
  }
</style>
