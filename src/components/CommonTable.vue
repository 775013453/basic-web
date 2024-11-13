<template>
  <div class="table-box">
    <div class="table-search">
      <el-form
        ref="formRef"
        :inline="true"
        :model="formData"
        label-width="80px"
        :class="{ 'form-black': props.theme }"
      >
        <el-form-item
          v-for="(item, index) in props.formList"
          :key="'tbFormItem-' + index"
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
              :key="'tbSelectOpt-' + i"
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
        <el-form-item>
          <el-button
            type="primary"
            icon="Search"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            icon="Refresh"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
        <slot
          name="operations"
          :formData="formData"
        ></slot>
      </el-form>
      <div class="tab-right-content">
        <el-button
          v-for="(item, index) in innerTopBtns"
          :key="'tbBtn-' + index"
          :color="item.color"
          type="primary"
          :icon="item.icon"
          @click="item.handler(selectedData)"
        >
          {{ item.name }}
        </el-button>
      </div>
    </div>
    <div
      v-if="!noData"
      class="table-content"
      :class="{ 'table-black': props.theme }"
    >
      <el-table
        ref="tableRef"
        :data="tableData"
        :stripe="true"
        :highlight-current-row="true"
        tooltip-effect="dark"
        :height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="props.isShowSelect"
          type="selection"
          width="40"
        />
        <el-table-column
          v-for="(item, index) in props.header"
          :key="'td-' + index"
          :label="item.label"
          :width="item.width"
        >
          <template #default="scope">
            <slot
              v-if="item.type === 'custom'"
              name="row"
              :tableData="scope.row"
            ></slot>
            <span v-else>
              {{ COMMON_FUNC.dictSwitch(scope.row[item.prop], item.dictType || '') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="innerOperations.length > 0"
          label="操作"
          :width="operateNum * 30 + innerOperations.length * 24"
          class="operate-column"
        >
          <template #default="scope">
            <template v-for="(item, index) in innerOperations">
              <span
                v-if="item.hiddenHandle ? item.hiddenHandle(scope.row) : true"
                :key="index"
                class="operate-item"
                :class="{ 'operate-dropdown': item.type === 'dropdownBtns' }"
              >
                <el-dropdown v-if="item.type === 'dropdownBtns'">
                  <el-button
                    :style="{ color: item.color }"
                    link
                    :icon="item.icon"
                  >
                    {{ item.name }}
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(e, i) in item.btns"
                        :key="i"
                        :disabled="e.disabled"
                        @click="e.handler(scope.row)"
                      >
                        <span :style="{ color: e.color }">
                          <el-icon
                            v-if="e.icon"
                            :size="16"
                            :color="e.color"
                          >
                            <component :is="e.icon"></component>
                          </el-icon>
                          {{ e.name }}
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button
                  v-else
                  :style="{ color: item.color }"
                  link
                  :icon="item.icon"
                  @click="item.handler(scope.row)"
                >
                  {{ item.name }}
                </el-button>
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-content">
        <el-pagination
          v-model:page-size="pageInfo.pageSize"
          background
          :current-page="pageInfo.currentPage"
          :page-sizes="pageSizes"
          layout="slot, prev, pager, next, sizes, jumper"
          :total="pageInfo.total"
          v-bind="$attrs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="page-total">
            共{{ pageInfo.total || 0 }}条记录 第{{ pageInfo.currentPage || 1 }}/{{ totalPage(pageInfo.total || 0, pageInfo.pageSize) }}页
          </span>
        </el-pagination>
      </div>
    </div>
    <div
      v-else
      class="no-data"
    >
      <img
        src="@/assets/img/wrong/no-data.png"
        alt="加载失败"
      />
      <h1>暂无数据</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { FormInstance } from 'element-plus';
  import { ref } from 'vue';
  import { COMMON_FUNC } from './utils/common-func';
  import { axiosRequest } from './utils/http-service';

  /**
   * description：公共表格
   * author: almostSir
   * date：2024-10-31 18:47:31
   */

  /**
    组件传参：
      header: 表头
      tabList: 数据列表
      topBtns: 表格顶部按钮操作
      operations: 表格操作
      isShowSelect: 是否有选择功能
      pageInfo: 分页配置
      formList: 搜索表单

    分页抛出事件：pagination
    多选抛出事件：selectChange
    搜索抛出事件：handleSearch
    重置抛出事件：resetQuery
  */
  const props = defineProps({
    // 表头
    header: {
      type: Array<TbHeader>,
      default() {
        return [];
      }
    },
    // 表格数据列表
    /*
      {
        label,
        width,
        prop
      }
    */
    tableList: {
      type: Array<object>,
      default() {
        return [];
      }
    },
    // 新增
    /**
      {
        name: "新增",
        icon: "Plus",
        handler: handleAdd
      }
    */
    topBtns: {
      type: Array<OperateBtn>,
      default() {
        return [];
      }
    },
    // 操作
    /**
      {
        name: "删除",
        icon: "Delete",
        color: "red",
        handler: handleDelate
      }
    */
    operations: {
      type: Array<OperateBtn>,
      default() {
        return [];
      }
    },
    // 是否显示选择框
    isShowSelect: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 分页
    /**
      {
        currentPage //当前页
        pageSize // 每页条数
        total // 总数量
      }
    */
    pageDefault: {
      type: Object,
      default() {
        return {
          pageSize: 10,
          currentPage: 1,
          total: 0
        };
      }
    },
    // 搜索条件
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
    url: {
      type: String,
      default: ''
    },
    // 可选参数：GET、POST、PUT、DELETE
    method: {
      type: Object as PropType<Method>,
      default() {
        return 'POST';
      }
    },
    // 默认参数,配置示例：{key:value}
    defaultParams: {
      type: Object,
      default() {
        return {};
      }
    },
    // 按钮权限开关，默认为false不打开
    openBtnAuth: {
      type: Boolean,
      default: false
    },
    // 主题
    theme: {
      type: Boolean,
      default: false
    },
    // 列表接口查询字段对象配置
    findField: {
      type: String,
      default: 'datas'
    },
    // 列表接口返回数据字段实体配置
    resField: {
      type: String,
      default: 'datas'
    },
    // 出去表格高度以外的其他高度总和
    otherHeight: {
      type: Number,
      default: 0
    }
  });
  const formRef = ref<FormInstance>(); // 表单模板变量

  let tableData: Ref<Array<object>> = ref([]),
    pageInfo: Ref<PagingConfig> = ref({ pageSize: 1, currentPage: 10, total: 0 }),
    pageSizes: Ref<Array<number>> = ref([10, 20, 30, 50]),
    formData: Ref<object> = ref({}),
    selectedData: Ref<Array<object>> = ref([]),
    tableHeight: Ref<string> = ref(`calc(100% - 120px)`),
    innerTopBtns: Ref<Array<OperateBtn>> = ref([]),
    innerOperations: Ref<Array<OperateBtn>> = ref([]),
    noData = ref(true),
    operateNum = ref(0); // 操作栏文字个数

  defineExpose({
    searchData
  });

  onBeforeMount(() => {
    tableData.value = props.tableList;
    pageInfo.value = props.pageDefault as PagingConfig;
    let pageInfoParams;
    if (props.pageDefault) {
      pageInfoParams = {
        pageNo: props.pageDefault.currentPage,
        pageSize: props.pageDefault.pageSize
      };
    }
    searchData(pageInfoParams);
    btnAuthHandle(props.topBtns, props.operations);
  });

  onMounted(() => {
    // 54为顶部高度
    const h = document.getElementsByClassName('table-search')[0].clientHeight + 64 + props.otherHeight;
    tableHeight.value = `calc(100vh - ${h}px)`;
    // 监听浏览器窗口编号，实时设置表格高度
    window.onresize = () => {
      const h = document.getElementsByClassName('table-search')[0].clientHeight + 64 + props.otherHeight;
      tableHeight.value = `calc(100vh - ${h}px)`;
    };
  });

  /**
   * description：请求数据处理
   * author: almostSir
   * date：2024-10-31 11:53:42
   */
  function searchData(params = { pageNo: 1, pageSize: 10 }) {
    pageInfo.value.currentPage = params.pageNo;
    params.pageSize = pageInfo.value.pageSize || 10;
    if (props.resField) {
      const data = Object.assign({}, props.defaultParams, formData.value);
      axiosRequest({
        method: props.method,
        url: props.url,
        params: {
          [props.findField]: data,
          ...params
        }
      }).then((response) => {
        tableData.value = response?.data[props.resField];
        if (tableData.value.length > 0) {
          noData.value = false;
        } else {
          noData.value = true;
        }
        pageInfo.value.total = response?.data?.totals;
      });
    }
  }
  /**
   * description：每页数量发生改变处理
   * author: almostSir
   * date：2024-10-31 11:51:37
   */
  function handleSizeChange(val) {
    if (pageInfo.value.currentPage * val > pageInfo.value.total) {
      searchData({ pageNo: 1, pageSize: val });
    } else {
      searchData({
        pageNo: pageInfo.value.currentPage,
        pageSize: val
      });
    }
  }

  /**
   * description：页码改变处理
   * author: almostSir
   * date：2024-10-31 11:51:50
   */
  function handleCurrentChange(val) {
    searchData({
      pageNo: val,
      pageSize: pageInfo.value.pageSize
    });
  }

  /**
   * description：多选处理
   * author: almostSir
   * date：2024-10-31 11:52:03
   */
  function handleSelectionChange(val) {
    selectedData.value = val;
  }

  /**
   * description：搜索处理
   * author: almostSir
   * date：2024-10-31 11:52:28
   */
  function handleQuery() {
    pageInfo.value.currentPage = 1;
    searchData({
      pageNo: 1,
      pageSize: pageInfo.value.pageSize
    });
  }

  /**
   * description：重置处理
   * author: almostSir
   * date：2024-10-31 11:52:45
   */
  function resetQuery() {
    formRef?.value?.resetFields();
    searchData({
      pageNo: 1,
      pageSize: pageInfo.value.pageSize
    });
  }

  /**
   * description：计算总页数
   * author: almostSir
   * date：2024-10-31 11:53:00
   */
  function totalPage(total: number, size: number) {
    // 计算总页数
    let totalPage = 1;
    if (total !== 0) {
      totalPage = total / size;
      if (totalPage % 1 !== 0) {
        totalPage = Math.floor(totalPage) + 1;
      }
    }
    return totalPage;
  }

  /**
   * description：按钮权限校验控制
   * author: almostSir
   * date：2024-10-31 11:53:19
   */
  function btnAuthHandle(topBtns: Array<OperateBtn>, operations: Array<OperateBtn>) {
    innerTopBtns.value = topBtns;
    innerOperations.value = operations;
    if (props.openBtnAuth) {
      const tempTopBtns: Array<OperateBtn> = [];
      const tempOperations: Array<OperateBtn> = [];
      // 获取缓存中mapping结构的按钮权限
      const btnsMapping = JSON.parse(sessionStorage.getItem('btnsMapping') as string) || {};
      topBtns.forEach((e) => {
        if (e.auth && btnsMapping[e.auth]) {
          e.name = btnsMapping[e.auth];
          tempTopBtns.push(e);
        }
      });
      operations.forEach((e) => {
        if (e.auth && btnsMapping[e.auth]) {
          e.name = btnsMapping[e.auth];
          tempOperations.push(e);
        }
      });
      innerTopBtns.value = tempTopBtns;
      innerOperations.value = tempOperations;
    }
    innerOperations.value.forEach((e) => {
      operateNum.value += e.name.length;
    });
  }
</script>

<style lang="scss" scoped>
  .table-content {
    position: relative;
  }

  .table-box {
    padding: 12px 12px 0;
    width: calc(100% - 26px);
    .pagination-content {
      width: 100%;
      display: flex;
    }
  }

  .table-search {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .tab-right-content {
    margin: 6px 16px;
  }

  .page-total {
    font-weight: 400;
    position: absolute;
    left: 16px;
    line-height: 32px !important;
  }

  .no-data {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding-top: 80px;

    img {
      width: 215px;
      height: 240px;
    }

    h1 {
      width: 100%;
      text-align: center;
    }
  }

  :deep() {
    .el-form {
      display: flex;
      justify-self: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }

    .el-form-item {
      margin: 6px 16px 6px 0;
      width: max-content !important;
    }

    .el-table th.el-table__cell {
      background: #f8f8f8;
    }

    .el-table__row:nth-child(even) {
      background: #f8f8f8;
    }

    .el-table .el-table__cell {
      padding: 8px 0;
    }

    .el-table .cell {
      height: 40px;
      line-height: 40px;
    }

    .el-table-column--selection .cell {
      padding-left: 10px;
      padding-right: 10px;
    }

    .operate-item {
      padding: 0 8px;
      border-right: 1px solid #ccc;
      display: inline-flex;
      align-items: center;
      > button > i,
      span {
        color: #409eff;
      }
    }

    .operate-item:first-child {
      padding-left: 0;
    }

    .operate-item:last-child {
      border-right: 0;
    }

    .el-pagination {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 6px;
      background: #fff;
    }

    .el-pagination__jump {
      position: absolute;
      right: 16px;
    }

    .form-black {
      .el-form-item__label {
        color: #444;
      }
    }

    .table-black {
      .page-total,
      .el-pagination__jump {
        color: #fff;
      }
    }

    .el-select {
      width: 200px !important;
    }

    @media screen and (max-width: 800px) {
      .page-total {
        top: 36px;
      }

      .el-pagination__jump {
        top: 36px;
        right: -24px;
      }
    }
  }
</style>
