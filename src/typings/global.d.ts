/**
 * description：自定义变量类型声明文件
 * organization：self
 * author: almostSir
 * date：2024-10-31 14:31:29
 */

export {};
declare global {
  // 字典节点
  declare type DNode = {
    label: string;
    value: string | number;
    children?: Array<DNode>;
  };

  declare type DObject = {
    [key: string]: Array<DNode>;
  };

  // 树形节点
  declare type TNode = {
    id: string | number;
    label: string;
    children?: Array<TNode>;
    parent?: TNode;
    [key: string]: boolean | string | number | Array<TNode> | Array<string | number | object> | object;
  };

  // 平铺结构转换成树形结构的入参配置
  declare type TreeConfig = {
    data: Array<TNode>; // 平铺结构数组的数据
    value?: string | number; // 根节点值,如果多颗树则不需设置,可用于搜索树形结构数据
    field: string; // 数据比对字段，例如：id。注意：每条数据必须包含此字段以及父级字段
    parentField: string; // 需要比对的父级字段，例如：parentId
    parent?: object; // 父级节点,一般不设置，组件内部使用
  };

  // 请求方法类型
  declare type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

  // 请求接口配置
  declare type RequestOptions = {
    url: string;
    method: Method;
    headers?: { [key: string]: string };
    params?: { [key: string]: string | number | object };
    isAsync?: boolean; // 是否异步，true为异步，false为同步
    callBack?: (res) => void; // 请求成功回调
    errorBack?: (msg) => void; // 请求失败回调
  };

  // 通用对象声明
  declare type NObject = {
    [key: string]: boolean | string | number | Array<T> | object | typeof Function;
  };

  // 表单项配置
  declare type FormItem = {
    type: 'input' | 'select' | 'month' | 'date' | 'dateTime' | 'dateRange' | 'cascader' | 'inputTree'; // 表单项类型
    label: string; // 名称
    prop: string; // 绑定属性
    placeholder: string; // select、cascader类型默认提示文字
    labelWidth?: string | number; // 名称宽度
    options?: Array<DNode>; // select、cascader类型需要
    showPassword?: boolean; // input类型显示密码切换框
    inputLength?: string | number; // input类型输入框长度限制
    disabled?: boolean; // 是否不可用
    multiple?: boolean; // select类型是否多选
    style?: object; // form项样式
    inputType?: text | textarea | password | button | checkbox | file | number | radio; // input类型下的子类型：text、textarea、password、button、checkbox、file、number、radio
    treeConfig?: {
      treeData: Array<TreeNodeData>; // 树形数据
      defaultProps: object; // 配置选项{label,children,disabled,isLeaf,class}，参考elementUI plus树形的props配置
      isMulti: boolean; // 是否多选
      checkStrictly: boolean; // 父子不互相关联，默认为true，不互相关联
      selectedNodes: Array<TreeNodeData>; // 选中节点
      primaryKey: string; // 树节点唯一标识字段
    };
    change?: (data, formData, e) => void; // select类型项改变后的回调函数
  };

  // 操作按钮配置
  declare type OperateBtn = {
    icon: string; // 按钮icon
    name: string; // 按钮名称
    handler: (data) => void; // 点击按钮回调函数
    color?: string; // 按钮颜色
    auth?: string | number; // 按钮权限字符串
    hiddenHandle?: (row) => boolean; // 按钮是否隐藏控制，主要用于单行针对状态动态控制隐藏/显示，默认显示,返回值为true则显示
  };

  // 分页参数配置
  declare type PagingConfig = {
    pageSize: number;
    currentPage: number;
    total: number;
  };

  // 表格头部配置
  declare type TbHeader = {
    label: string;
    width?: string | number;
    prop: string;
    dictType?: string;
  };
}
