<template>
  <article class="main">
    <transfer-tree
      ref="transferTree"
      v-model:selectedData="selectedData"
      :serviceData="courseData"
      leftTitle="可选择项"
      rightTitle="已选项"
      :childrenNullDisabled="false"
    ></transfer-tree>
  </article>
</template>

<script lang="ts" setup>
  import { LOGIN_INFO } from '@/config/login-config';

  let courseData = [];
  const selectedData = ref([]);
  const rootId = 1; // 根节点ID与field对于字段比较，如果没有则不设置rootId
  const serviceData: TreeConfig = {
    data: LOGIN_INFO.datas as TNode[],
    value: rootId,
    field: 'seq',
    parentField: 'parentSeq'
  };
  courseData = JSON.parse(JSON.stringify(serviceData));
</script>
<style lang="scss" scoped></style>
