<template>
  <div>
    <common-table
      ref="commonTableRef"
      :header="tbHeader"
      :tableList="tbList"
      :topBtns="tbTopBtns"
      :operations="tbOperation"
      :formList="tbFormList"
      :url="tbUrl"
      :theme="theme"
      findField="dictQueryVo"
    ></common-table>
    <el-drawer
      v-model="dictFormVisible"
      :title="dialogTitle"
      size="400px"
      :wrapperClosable="false"
      :destroy-on-close="true"
    >
      <common-form
        :formList="editFormList"
        :rawData="rawData"
        :rules="rules"
        @formSubmit="dictFormSubmit"
        @formReturn="dictFormReturn"
      ></common-form>
    </el-drawer>
    <el-drawer
      v-model="dictDetailVisible"
      :title="dialogTitle"
      size="400px"
      :wrapperClosable="false"
      :destroy-on-close="true"
    >
      <common-detail
        :detailConfig="dictDetailConfig"
        :detailData="dictDetailData"
        @detailReturn="dictDetailReturn"
      ></common-detail>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
  import CommonTable from '@/components/CommonTable.vue';
  import { DETAIL_CONFIG, EDIT_FORM, EDIT_FORM_RULES, TB_FORM, TB_HEADER } from '@/config/dict-config';
  import { useShareStore } from '@/store';
  import { axiosRequest } from '@/utils/send-http';
  import { ASYNC_URLS } from '@/utils/system-config';
  const shareStore = useShareStore();

  let tbHeader = TB_HEADER, // 表头
    tbList = [], // 初始化表格数据
    currentDictId = '', // 当前选中字典ID
    tbTopBtns = [
      // 表格顶部按钮
      {
        name: '新增',
        icon: 'Plus',
        handler: handleTbAdd
      }
    ],
    tbOperation = [
      // 单行数据操作按钮
      {
        name: '编辑',
        icon: 'Edit',
        color: '#409eff',
        handler: handleTbEdit
      },
      {
        name: '详情',
        icon: 'Reading',
        color: '#409eff',
        handler: handleTbDetail
      },
      {
        name: '删除',
        icon: 'Delete',
        color: '#409eff',
        handler: handleTbDelete
      }
    ],
    tbFormList = TB_FORM, // 表格搜索框配置
    editFormList = EDIT_FORM, // 新增、编辑表单配置
    dictFormVisible = ref(false), // 表单弹框
    rawData: Ref<{ [key: string]: string | number | object }> = ref({}), // 表单数据
    dialogTitle = ref('字典新增'), // 弹框名称
    dictDetailVisible = ref(false), // 详情弹框
    dictDetailConfig = DETAIL_CONFIG, // 详情配置
    dictDetailData: { [key: string]: string | number | object } = {}, // 字典详情数据
    rules = EDIT_FORM_RULES, // 表单校验规则
    tbUrl = ASYNC_URLS.dictList, // 表格接口地址
    theme = computed(() => shareStore.theme); // 主题
  const commonTableRef = ref<InstanceType<typeof CommonTable>>();

  async function handleTbAdd() {
    dialogTitle.value = '字典新增';
    rawData.value = {};
    if (await getDictAll()) {
      dictFormVisible.value = true;
    }
  }

  async function handleTbEdit(data) {
    currentDictId = data.dictId;
    rawData.value = JSON.parse(JSON.stringify(data));
    rawData.value.status += '';
    dialogTitle.value = '字典编辑';
    if (await getDictAll()) {
      dictFormVisible.value = true;
    }
  }

  async function handleTbDetail(data) {
    currentDictId = data.dictId;
    const newData = await getDictDetail(data);
    dictDetailData = JSON.parse(JSON.stringify(newData));
    rawData.value = dictDetailData;
    if (
      await getDictAll({
        dictId: dictDetailData.parentValue,
        data: dictDetailData,
        field: 'parentValue'
      })
    ) {
      dialogTitle.value = '字典详情';
      dictDetailVisible.value = true;
    }
  }

  function handleTbDelete(data) {
    currentDictId = data.dictId;
    ElMessageBox.confirm(`此操作将永久删除该字典【${data.name}】, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        axiosRequest({
          method: 'POST',
          url: `${ASYNC_URLS.dictDelete}`,
          params: {
            dictModifyVo: {
              dictId: currentDictId
            }
          }
        }).then((res) => {
          const data = res.data;
          if (data.operateSuccess) {
            commonTableRef.value?.searchData();
            ElMessage({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            ElMessage({
              type: 'error',
              message: data.msg
            });
          }
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除'
        });
      });
  }

  function dictFormSubmit(data) {
    axiosRequest({
      method: 'POST',
      url: ASYNC_URLS.dictSaveOrUpdate,
      params: {
        dictModifyVos: [data]
      }
    }).then((res) => {
      if (res.data.operateSuccess) {
        commonTableRef.value?.searchData();
        dictFormVisible.value = false;
        if (data.dictId) {
          ElMessage({
            type: 'success',
            message: '字典编辑成功'
          });
        } else {
          ElMessage({
            type: 'success',
            message: '字典新增成功'
          });
        }
      } else {
        ElMessage({
          type: 'error',
          message: res.data.msg
        });
      }
    });
  }

  function dictFormReturn() {
    rawData.value = {};
    dictFormVisible.value = false;
  }

  function dictDetailReturn() {
    dictDetailVisible.value = false;
  }

  function getDictAll(switchData?) {
    return new Promise((resolve) => {
      axiosRequest({
        method: 'POST',
        url: ASYNC_URLS.dictListAll,
        params: {
          dictQueryVo: {
            dictId: switchData && switchData.dictId
          }
        }
      }).then((res) => {
        if (res.data.operateSuccess) {
          for (let i = 0; i < editFormList.length; i++) {
            if (editFormList[i].prop === 'parentValue') {
              editFormList.splice(i, 1);
              i--;
            }
          }
          const options: Array<DNode> = [];
          res.data.datas.forEach((e) => {
            options.push({ label: e.name, value: e.dictId });
          });
          editFormList.push({
            type: 'select',
            label: '父级字典',
            prop: 'parentValue',
            placeholder: '请选择父级字典',
            options,
            labelWidth: '80px'
          });
          if (switchData && switchData.dictId && res.data.datas.length > 0) {
            switchData.data[switchData.field] = res.data.datas[0].name;
          }
          resolve(true);
        }
      });
    });
  }

  function getDictDetail(data?) {
    return new Promise((resolve, reject) => {
      axiosRequest({
        method: 'POST',
        url: ASYNC_URLS.dictDetail,
        params: {
          dictQueryVo: {
            dictId: data && data.dictId
          }
        }
      }).then((res) => {
        const data = res.data;
        if (data.operateSuccess) {
          resolve(data.datas);
        } else {
          reject(data);
        }
      });
    });
  }
</script>
