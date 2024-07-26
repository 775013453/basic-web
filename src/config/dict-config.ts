/**
 * description：公共表格配置案例（此处为一个使用例子）
 * organization：self
 * author: almostSir
 * date：2024-07-17 18:07:26
 */

import { systemDict } from '@/components/utils/system-dict';
import { FormRules } from 'element-plus';

export const TB_HEADER = [
  { label: '类别名称', prop: 'typeName' },
  { label: '类别编码', prop: 'type' },
  { label: '字典名称', prop: 'name' },
  { label: '字典值', prop: 'value' },
  { label: '字典状态', prop: 'status', dict: 'valid' },
  { label: '更新日期', prop: 'updateTime' }
];

export const TB_FORM: Array<FormItem> = [
  {
    type: 'input',
    label: '类别名称',
    prop: 'typeName',
    placeholder: '请输入类别名称'
  },
  {
    type: 'input',
    label: '字典名称',
    prop: 'name',
    placeholder: '请输入字典名称'
  },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    placeholder: '请选择状态',
    options: systemDict.valid,
    labelWidth: '50px'
  }
];

export const EDIT_FORM: Array<FormItem> = [
  {
    type: 'input',
    label: '类别名称',
    prop: 'typeName',
    placeholder: '请输入类别名称',
    labelWidth: '80px'
  },
  {
    type: 'input',
    label: '类别编码',
    prop: 'type',
    placeholder: '请输入类别编码',
    labelWidth: '80px'
  },
  {
    type: 'input',
    label: '字典名称',
    prop: 'name',
    placeholder: '请输入字典名称',
    labelWidth: '80px'
  },
  {
    type: 'input',
    label: '字典值',
    prop: 'value',
    placeholder: '请输入字典值',
    labelWidth: '80px'
  },
  {
    type: 'select',
    label: '是否有效',
    prop: 'status',
    placeholder: '请选择状态',
    options: systemDict.valid,
    labelWidth: '80px'
  }
];

export const EDIT_FORM_RULES = reactive<FormRules>({
  type: [{ required: true, message: '请输入类别编码', trigger: 'blur' }],
  typeName: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
});

// 患者详情页配置，如果需要转换字典需要传递 |[dict] 标识
export const DETAIL_CONFIG = {
  typeName: '类别名称',
  type: '类别编码',
  name: '字典名称',
  value: '字典值',
  status: '字典状态|[dict]valid',
  parentValue: '父级字典',
  updateTime: '更新日期'
};
