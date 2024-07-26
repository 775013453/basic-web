<template>
  <article class="main">
    <div>
      <strong>树形输入框单选：</strong>
      <input-tree
        v-model:selectedNodes="selectedNodes"
        :treeData="menus"
        primaryKey="id"
        :isMulti="false"
      ></input-tree>
    </div>
    <div>
      <strong>树形输入框多选：</strong>
      <input-tree
        v-model:selectedNodes="selectedNodes"
        :treeData="menus"
        primaryKey="id"
        :isMulti="true"
      ></input-tree>
    </div>
    <div>
      <strong>树形输入框多选-父子关联：</strong>
      <input-tree
        v-model:selectedNodes="selectedNodes"
        :treeData="menus"
        primaryKey="id"
        :isMulti="true"
        :checkStrictly="false"
      ></input-tree>
    </div>
    <div>
      <strong>树形输入框多选-父子不关联：</strong>
      <input-tree
        v-model:selectedNodes="selectedNodes"
        :treeData="menus"
        primaryKey="id"
        :isMulti="true"
        :checkStrictly="true"
      ></input-tree>
    </div>
  </article>
</template>

<script lang="ts" setup>
  import { commonFunc } from '@/components/utils/common-func';
  import { loginInfo } from '@/config/login-config';

  const tempMenus = commonFunc.arrayAssembleTree({
    data: loginInfo.datas as Array<TNode>,
    field: 'seq',
    parentField: 'parentSeq'
  });
  const menus = tempMenus.children;

  const selectedNodes = ref([]);
</script>
<style lang="scss" scoped>
  .main {
    display: flex;
    padding: 32px;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, 0.15);
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      > strong {
        width: 240px;
        text-align: right;
      }
    }
  }
</style>
