<template>
  <div class="form-box">
    <el-form
      ref="formDataRef"
      :inline="true"
      :model="formData"
      :rules="props.rules"
      label-width="80px"
      :class="{ 'form-black': props.theme }"
    >
      <el-form-item
        v-for="(item, index) in props.formList"
        :key="index"
        size="default"
        :label="item.label"
        :label-width="item.labelWidth || '80px'"
        :style="item.style"
        :prop="item.prop"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="formData[item.prop]"
          autosize
          clearable
          :placeholder="item.placeholder"
          :show-password="item.showPassword"
          :type="item.inputType"
          :maxlength="item.inputLength"
          :disabled="item.disabled"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          :prop="item.prop"
          :disabled="item.disabled"
          :multiple="item.multiple"
          clearable
          filterable
          @change="
            (data: any) => {
              (item.options || []).some((e: any) => {
                if (e.value === data) {
                  item.change && item.change(data, formData, e);
                  return true;
                }
              });
            }
          "
        >
          <el-option
            v-for="(el, i) in item.options"
            :key="i"
            filterable
            clearable
            :label="el.label"
            :value="el.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'month'"
          v-model="formData[item.prop]"
          format="YYYY-MM"
          value-format="YYYY-MM"
          type="month"
          :prop="item.prop"
          placeholder="选择日期"
          :disabled="item.disabled"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formData[item.prop]"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          type="date"
          :prop="item.prop"
          placeholder="选择日期"
          :disabled="item.disabled"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'dateTime'"
          v-model="formData[item.prop]"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          type="datetime"
          :prop="item.prop"
          placeholder="选择日期"
          :disabled="item.disabled"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'dateRange'"
          v-model="formData[item.prop]"
          style="width: 240px"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :prop="item.prop"
          :disabled="item.disabled"
        />
        <el-cascader
          v-else-if="item.type === 'cascader'"
          v-model="formData[item.prop]"
          filterable
          clearable
          check-strictly
          :options="item.options"
          :props="{
            label: 'name',
            value: 'id',
            emitPath: false,
            checkStrictly: true
          }"
          :disabled="item.disabled"
        />
        <input-tree
          v-else-if="item.type === 'inputTree' && item.treeConfig"
          v-model:selectedNodes="item.treeConfig.selectedNodes"
          :treeData="item.treeConfig.treeData || []"
          :defaultProps="item.treeConfig.defaultProps"
          :isMulti="item.treeConfig.isMulti"
          :checkStrictly="item.treeConfig.checkStrictly"
          :primaryKey="item.treeConfig.primaryKey"
        ></input-tree>
      </el-form-item>
      <slot :formData="formData"></slot>
    </el-form>
    <div class="btns">
      <el-button
        type="primary"
        :icon="'Close'"
        @click="handleReturn"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        :icon="'Collection'"
        :disabled="!props.saveUsed"
        @click="handleSubmit"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  /**
   * description：公共表单
   * author: almostSir
   * date：2024-10-31 18:47:52
   */

  import { FormInstance } from 'element-plus';
  import InputTree from './InputTree.vue';
  const props = defineProps({
    // 表单元素
    /**
      type: 'input' | 'select' | 'month' | 'date' | 'dateTime' | 'dateRange' | 'cascader' | 'inputTree'; // 表单项类型
      label: string; // 名称
      prop: string; // 绑定属性
      placeholder: string; // select、cascader类型默认提示文字
      labelWidth: string | number; // 名称宽度
      options: Array<DNode>; // select、cascader类型需要
      showPassword: boolean; // input类型显示密码切换框
      inputLength: string | number; // input类型输入框长度限制
      disabled: boolean; // 是否不可用
      multiple: boolean; // select类型是否多选
      style: object; // form项样式
      inputType: text | textarea | password | button | checkbox | file | number | radio; // input类型下的子类型：text、textarea、password、button、checkbox、file、number、radio
      treeConfig: {
        treeData: Array<TreeNodeData>; // 树形数据
        defaultProps: object; // 配置选项{label,children,disabled,isLeaf,class}，参考elementUI plus树形的props配置
        isMulti: boolean; // 是否多选
        checkStrictly: boolean; // 父子不互相关联，默认为true，不互相关联
        selectedNodes: Array<TreeNodeData>; // 选中节点
        primaryKey: string; // 树节点唯一标识字段
      };
      change: (data, formData, e) => void; // select类型项改变后的回调函数
      */

    formList: {
      type: Array<FormItem>,
      default() {
        return [];
      }
    },
    // 原始数据
    rawData: {
      type: Object,
      default() {
        return {};
      }
    },
    rules: {
      type: Object,
      default() {
        return {};
      }
    },
    // 保存按钮可用
    saveUsed: {
      type: Boolean,
      default: true
    },
    // 主题
    theme: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['formSubmit', 'formReturn']);
  const formDataRef = ref<FormInstance>(),
    formData: Ref<object> = ref({});

  onMounted(() => {
    formData.value = toRefs(props.rawData);
  });

  /**
   * description：提交按钮处理方法
   * author: almostSir
   * date：2024-10-31 11:51:03
   */
  function handleSubmit() {
    if (formDataRef.value) {
      formDataRef.value.validate((isValid) => {
        if (isValid) {
          emit('formSubmit', formData.value);
        }
      });
    }
  }

  /**
   * description：关闭按钮处理方法
   * author: almostSir
   * date：2024-10-31 11:50:56
   */
  function handleReturn() {
    emit('formReturn');
  }
</script>

<style lang="scss" scoped>
  .form-box {
    height: 100%;
  }

  .btns {
    margin: 0;
    text-align: center;
    padding: 16px 0;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    height: 60px;
  }

  :deep() {
    .el-form {
      height: calc(100% - 40px);
      text-align: center;
      padding: 0 16px;
      overflow-y: auto;
      overflow-x: hidden;

      .el-form-item {
        display: inline-flex !important;
        width: 320px;
      }

      .el-form-item--small.el-form-item {
        background: #fff;
        padding-left: 8px;
        border-radius: 4px;
        display: flex;

        .el-form-item__content {
          width: 100%;
          text-align: left;
          background: #fff;

          .el-date-editor.el-input {
            width: 100%;
          }
        }

        .el-select--small.el-select {
          width: 100%;
        }
      }

      .el-date-editor--date {
        .el-input__inner {
          padding-right: 15px;
        }
      }
    }
  }
</style>
