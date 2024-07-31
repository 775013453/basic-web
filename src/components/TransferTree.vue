<template>
  <div class="content">
    <div class="content__left">
      <div class="model-title">
        {{ props.leftTitle }}
      </div>
      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="id"
        show-checkbox
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
      >
        <template #default="{ node }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
    <div class="content__center">
      <el-button
        type="primary"
        class="content__center__btn"
        icon="ArrowRight"
        @click="addData"
      ></el-button>
      <el-button
        type="primary"
        class="content__center__btn"
        icon="ArrowLeft"
        @click="removeData"
      ></el-button>
    </div>
    <div class="content__right">
      <div class="model-title">
        {{ props.rightTitle }}
      </div>
      <el-checkbox-group v-model="selectedListData">
        <el-checkbox
          v-for="item in listData"
          :key="item.id"
          :label="item"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ElTree } from 'element-plus';
  import { TreeNodeData } from 'element-plus/lib/components/tree-v2/src/types.js';
  import { COMMON_FUNC } from './utils/common-func';

  const emit = defineEmits(['update:selectedData']);
  const props = defineProps({
    serviceData: {
      type: Object,
      default() {
        return {};
      }
    },
    selectedData: {
      type: Array<object>,
      default: []
    },
    leftTitle: {
      type: String,
      default: '组织结构树'
    },
    rightTitle: {
      type: String,
      default: '已选中叶子节点'
    },
    childrenNullDisabled: {
      type: Boolean,
      default: true
    }
  });

  const treeData: Ref<Array<TreeNodeData>> = ref([]), // 树形数据
    listData: Ref<Array<TreeNodeData>> = ref([]), // 列表下的数据,点击添加按钮后将树形结构下选中数据复制到该变量下
    selectedListData: Ref<Array<TNode>> = ref([]),
    treeRef = ref<InstanceType<typeof ElTree>>(); // 列表下的选中数据,点击移除按钮后将选中的数据移动到树形结构数据下

  onMounted(() => {
    setTransferData(props.serviceData, props.selectedData, props.childrenNullDisabled);
  });

  /**
   * description：添加数据
   * author: almostSir
   * date：2024-07-17 18:37:33
   */
  function addData() {
    const selectedTreeData = treeRef.value?.getCheckedNodes() || [];
    const treeConfig = props.serviceData as TreeConfig;

    !listData.value && (listData.value = []);

    for (let i = 0; i < selectedTreeData.length; i++) {
      if (!selectedTreeData[i].isLeaf) {
        selectedTreeData[i].disabled = true;
        selectedTreeData.splice(i, 1);
        i--;
      }
    }
    listData.value.push(...selectedTreeData);
    for (let i = 0; i < treeConfig.data.length; i++) {
      listData.value.some((e) => {
        if (treeConfig.data[i].id === e.id) {
          treeConfig.data.splice(i, 1);
          i--;
          return true;
        }
      });
    }
    const data = COMMON_FUNC.arrayAssembleTree(treeConfig);
    treeData.value = [data];
    emit('update:selectedData', listData.value);
  }

  /**
   * description：移除数据
   * author: almostSir
   * date：2024-07-17 18:37:17
   */
  function removeData() {
    const treeConfig = props.serviceData as TreeConfig;
    for (let i = 0; i < listData.value.length; i++) {
      selectedListData.value.some((e) => {
        if (listData.value[i].id === e.id) {
          listData.value.splice(i, 1);
          i--;
          return true;
        }
      });
    }
    treeConfig.data.push(...selectedListData.value);
    function setTreeDisabled(data, selectedData) {
      if (selectedData.length > 0)
        data.data.forEach((e) => {
          selectedData.forEach((m) => {
            if (m[data.parentField] === e[data.field]) {
              e.disabled = false;
              setTreeDisabled(data, [e]);
            }
          });
        });
    }
    setTreeDisabled(props.serviceData, selectedListData.value);
    const data = COMMON_FUNC.arrayAssembleTree(treeConfig);
    treeData.value = [data];
    // 移除数据后置空选中项，防止重复移除添加到原树形结构中
    selectedListData.value = [];
    emit('update:selectedData', listData.value);
  }

  /**
   * description：设置传输数据
   * author: almostSir
   * date：2024-07-26 11:56:14
   */
  function setTransferData(serviceData, selectedData, state = true) {
    const treeConfig = props.serviceData as TreeConfig;
    // 数组转换成树形结构
    for (let j = 0; j < selectedData.length; j++) {
      const m = selectedData[j];
      for (let i = 0; i < serviceData.data.length; i++) {
        const e = serviceData.data[i];
        if (e[props.serviceData.field] === m[props.serviceData.field]) {
          serviceData.data.splice(i, 1);
          i--;
          break;
        }
      }
    }
    const data = COMMON_FUNC.arrayAssembleTree(treeConfig, state);
    treeData.value = [data];
    listData.value = selectedData;
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap !important;
    height: 100%;
  }

  .content__left,
  .content__right {
    width: 50%;
    height: inherit;
    min-width: 240px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-sizing: border-box;
    background: #fff;
  }

  .content__center {
    width: 60px;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;

    .content__center__btn {
      width: 42px;
      height: 42px;
      font-size: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 16px 0;
    }
  }

  .model-title {
    height: 42px;
    line-height: 48px;
    background: #ecf0ff;
    padding: 0 16px;
    font-weight: 700;
    font-size: 18px;
  }

  :deep() {
    .el-checkbox-group {
      .el-checkbox {
        width: calc(100% - 30px);
        height: 36px;
        line-height: 36px;
        padding-left: 16px;
        box-sizing: border-box;

        .el-checkbox__label {
          font-size: 16px;
        }
      }
    }

    .el-tree,
    .el-checkbox-group {
      overflow-y: auto;
      height: calc(100% - 42px);
    }
  }
</style>
