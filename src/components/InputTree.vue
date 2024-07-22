<template>
  <div class="tree-content">
    <div
      class="tree-selected"
      :class="{ 'tree-selected-data': selectedNames.length > 0 }"
      @click="
        () => {
          showTree = !showTree;
        }
      "
    >
      <template v-if="selectedNames.length > 0">
        <span v-if="selectedNames.length <= 4">
          {{ selectedNames.join('、') }}
        </span>
        <span v-else>已选中&nbsp;{{ selectedNames.length }}&nbsp;项</span>
      </template>
      <template v-else>
        <span>{{ '请选择' }}</span>
      </template>
    </div>
    <div
      v-if="showTree"
      class="tree-search"
    >
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      ></el-input>
      <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="props.treeData"
        :props="props.defaultProps"
        default-expand-all
        :node-key="props.primaryKey"
        :filter-node-method="filterNode"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-checked-keys="selectedKeys"
        :show-checkbox="props.isMulti"
        :check-strictly="props.checkStrictly"
        highlight-current
        @check="sendSelectedNode()"
        @node-click="sendSelectedNode()"
      ></el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ElTree } from 'element-plus';
  import { TreeKey, TreeNodeData } from 'element-plus/es/components/tree-v2/src/types.mjs';

  /**
   * description：单选/多选树形结构输入框
   * author: almostSir
   * date：2024-07-17 18:46:56
   */

  const emit = defineEmits(['update:selectedNodes']);
  const props = defineProps({
    // 树形数据
    treeData: {
      type: Array<TreeNodeData>,
      required: true,
      default() {
        return [];
      }
    },
    // 配置选项
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label'
        };
      }
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      default: true
    },
    // 父子不互相关联，默认为true，不互相关联
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 选中节点
    selectedNodes: {
      type: Array<TreeNodeData>,
      default() {
        return [];
      }
    },
    // 主键值
    primaryKey: {
      type: String,
      required: true
    }
  });

  const filterText: Ref<string> = ref(''),
    selectedKeys: Ref<Array<TreeKey>> = ref([]),
    selectedNames: Ref<Array<string>> = ref([]),
    showTree: Ref<boolean> = ref(false),
    treeRef = ref<InstanceType<typeof ElTree>>();
  let innerSelectedNodes: Array<TreeNodeData> = [];

  onMounted(() => {
    innerSelectedNodes = props.selectedNodes;
    selectedKeys.value = [];
    innerSelectedNodes.forEach((e) => {
      selectedKeys.value.push(e[props.primaryKey]);
    });
    setSelectedNodeName();
  });

  watch(filterText, (val) => {
    treeRef.value?.filter(val);
  });

  function filterNode(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }

  function sendSelectedNode() {
    let selectedNodes;
    if (props.isMulti) {
      selectedNodes = treeRef.value?.getCheckedNodes();
      emit('update:selectedNodes', selectedNodes);
      innerSelectedNodes = selectedNodes;
    } else {
      selectedNodes = treeRef.value?.getCurrentNode();
      emit('update:selectedNodes', [selectedNodes]);
      innerSelectedNodes = [selectedNodes];
    }
    setSelectedNodeName();
  }

  function setSelectedNodeName() {
    selectedNames.value = [];
    innerSelectedNodes.forEach((e) => {
      selectedNames.value.push(e[props.defaultProps.label]);
    });
  }

  export interface TreeDefaultProps {
    children: string; // 子节点key值
    label: string; // 节点展示名称的key值
  }
</script>

<style lang="scss" scoped>
  .tree-content {
    width: 241px;
    position: relative;
  }

  .tree-selected {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    color: #c0c4cc;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .tree-selected:hover {
    border: 1px solid #66b1ff;
  }

  .tree-selected-data {
    color: #606266;
  }

  .tree-search {
    width: 100%;
    min-width: 241px;
    position: absolute;
    right: 0;
    box-shadow: 0 0 4px 0 #ccc;
    z-index: 2000;
  }

  :deep() {
    .el-tree {
      padding-right: 11px;
      max-height: 400px;
      overflow: auto;
    }

    .el-tree-node__content {
      height: 36px;
    }

    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background: #66b1ff;
      color: #fff;

      .el-tree-node__expand-icon {
        color: #fff;
      }
    }
  }
</style>
