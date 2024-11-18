<template>
  <article class="main">
    <system-header
      :systemName="systemName"
      :accountName="accountName"
      :menuOptions="menuOptions"
      @logoClick="logoClick"
      @exitClick="exitSystem"
    ></system-header>
    <section class="content">
      <div>
        <menu-tree
          class="system-menu"
          :menus="menus"
          :collapse="menuCollapse"
        ></menu-tree>
        <div class="system-version">
          <strong v-if="!menuCollapse">{{ systemVersion }}</strong>
          <template v-if="menuCollapse">
            <el-icon
              :size="24"
              @click="switchMenu"
            >
              <Expand />
            </el-icon>
          </template>
          <template v-else>
            <el-icon
              :size="24"
              @click="switchMenu"
            >
              <Fold />
            </el-icon>
          </template>
        </div>
      </div>
      <router-view class="router-content" />
    </section>
  </article>
  <el-dialog
    v-model="pwdModifyDialog"
    title="修改密码"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="modifyPwdFormRef"
      :inline="true"
      :model="account"
      :rules="pwdRules"
      label-width="80px"
    >
      <el-form-item
        prop="oldPassword"
        size="default"
        label="原密码"
      >
        <el-input
          v-model="account.oldPassword"
          placeholder="请输入原密码"
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="newPassword"
        size="default"
        label="新密码"
      >
        <el-input
          v-model="account.newPassword"
          placeholder="请输入新密码"
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="againPassword"
        size="default"
        label="确认密码"
      >
        <el-input
          v-model="account.againPassword"
          placeholder="请再次输入新密码"
          :show-password="true"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button
        type="primary"
        @click="closePwdDialog"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="modifyPwd()"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { COMMON_FUNC } from '@/components/utils/common-func';
  import { LOGIN_INFO } from '@/config/login-config';
  import { SYSTEM_CONFIG } from '@/utils/system-config';

  const menuCollapse = ref(false);

  const funcs = LOGIN_INFO.datas || [];
  const tempMenus = COMMON_FUNC.arrayAssembleTree({
    data: funcs as Array<TNode>,
    field: 'seq',
    parentField: 'parentSeq'
  });

  const menus = tempMenus.children,
    systemName = SYSTEM_CONFIG.systemName,
    systemVersion = 'v1.0.0',
    accountName = '陈浩南';

  // 顶部菜单栏下来项
  const menuOptions = [
    {
      label: '修改密码',
      clickHandle: () => {
        account.value = {
          oldPassword: '',
          newPassword: '',
          againPassword: ''
        };
        pwdModifyDialog.value = true;
      }
    },
    {
      label: '退出登录',
      clickHandle: () => {
        exitSystem();
      }
    }
  ];

  // 密码强度校验
  const validatePwd = (_rule, value, callback) => {
    const regExp = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^A-Za-z0-9])(.{8,20})$/;
    if (value && value.length > 0 && !regExp.test(value)) {
      callback(new Error('长度8-20位，包括字母 数字 特殊字符'));
    } else {
      callback();
    }
  };

  if (SYSTEM_CONFIG.visitorMode) {
    sessionStorage.setItem('_sid', LOGIN_INFO.accessToken);
  }

  const pwdModifyDialog = ref(false),
    account = ref({
      oldPassword: '',
      newPassword: '',
      againPassword: ''
    }),
    pwdRules = {
      oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { validator: validatePwd, trigger: 'blur' }
      ],
      againPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validatePwd, trigger: 'blur' }
      ]
    },
    modifyPwdFormRef = ref(),
    router = useRouter();

  /**
   * description：头部logo点击处理
   * author: almostSir
   * date：2024-10-31 16:37:25
   */
  function logoClick() {
    console.log('头部logo点击处理');
  }

  /**
   * description：头部退出按钮点击处理
   * author: almostSir
   * date：2024-10-31 16:38:03
   */
  function exitSystem() {
    ElMessageBox.confirm('您将退出系统,是否继续？', '退出系统', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        sessionStorage.clear();
        router.push('/');
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '退出取消'
        });
      });
  }

  /**
   * description：切换菜单栏
   * author: almostSir
   * date：2024-10-31 16:18:24
   */
  function switchMenu() {
    menuCollapse.value = !menuCollapse.value;
  }

  /**
   * description：修改密码
   * author: almostSir
   * date：2024-11-01 09:31:07
   */
  function modifyPwd() {
    modifyPwdFormRef.value.validate((valid: boolean) => {
      if (valid) {
        if (account.value.newPassword !== account.value.againPassword) {
          ElMessage({
            type: 'error',
            message: '新输入2次密码不一致'
          });
          return false;
        }
        const acInfo = JSON.parse(sessionStorage.getItem('acInfo') || '{}');
        const token = sessionStorage.getItem('_sid');
        const params = {
          accountId: acInfo.accountId,
          accountName: acInfo.accountName,
          oldPwd: account.value.oldPassword,
          password: account.value.newPassword,
          token: token
        };
        console.log(params);
      } else {
        ElMessage({
          type: 'error',
          message: '密码格式不正确'
        });
        return false;
      }
    });
  }

  /**
   * description：关闭密码弹框
   * author: almostSir
   * date：2024-11-01 09:24:20
   */
  function closePwdDialog() {
    pwdModifyDialog.value = false;
  }
</script>
<style lang="scss" scoped>
  @use '@/scss/variable' as v;

  .content {
    height: calc(100% - v.$theme-header-height);
    display: flex;
    .system-menu {
      height: calc(100% - v.$home-version-height);
      background: #4a47b2;
      border-right: 1px solid #666;
    }
    .system-version {
      height: v.$home-version-height;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      background: v.$home-version-bg;
      color: v.$home-version-text-color;
      cursor: pointer;
    }
    .router-content {
      width: 100%;
      height: 100%;
      flex: 1;
    }
  }
  :deep() {
    .el-icon {
      cursor: pointer;
    }
    .el-sub-menu__title {
      background: #4a47b2;
      color: #fff;
    }
    .el-menu-item:focus,
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
      background-color: #8d8dc8;
      color: #fff;
    }
    .el-sub-menu__title > .el-button {
      color: #fff;
    }
    .el-form-item {
      width: 100%;
    }
  }
</style>
