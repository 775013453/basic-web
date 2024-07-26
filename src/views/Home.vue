<template>
  <article class="main">
    <system-header
      :systemName="systemName"
      :accountName="accountName"
      :menuOptions="menuOptions"
      @logoClick="logoClick"
      @exitClick="exitClick"
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
</template>

<script lang="ts" setup>
  import { commonFunc } from '@/components/utils/common-func';
  import { loginInfo } from '@/config/login-config';
  import { SYSTEM_CONFIG } from '@/utils/system-config';

  const menuCollapse = ref(false);

  const tempMenus = commonFunc.arrayAssembleTree({
    data: loginInfo.datas as Array<TNode>,
    field: 'seq',
    parentField: 'parentSeq'
  });
  const menus = tempMenus.children;

  const systemName = SYSTEM_CONFIG.systemName;
  const systemVersion = 'v1.0.0';
  const accountName = '陈浩南';
  // 顶部菜单栏下来项
  const menuOptions = [
    {
      label: '修改密码',
      clickHandle: () => {
        console.log('修改密码');
      }
    },
    {
      label: '退出登录',
      clickHandle: () => {
        console.log('退出登录');
      }
    }
  ];

  /**
   * description：头部logo点击处理
   * author: almostSir
   * date：2024-07-26 16:37:25
   */
  function logoClick() {
    console.log('头部logo点击处理');
  }

  /**
   * description：头部退出按钮点击处理
   * author: almostSir
   * date：2024-07-26 16:38:03
   */
  function exitClick() {
    console.log('头部退出按钮点击处理');
  }

  /**
   * description：切换菜单栏
   * author: almostSir
   * date：2024-07-26 16:18:24
   */
  function switchMenu() {
    menuCollapse.value = !menuCollapse.value;
  }
</script>
<style lang="scss" scoped>
  @use '@/scss/variable' as v;

  .content {
    height: calc(100% - v.$theme-header-height);
    display: flex;
    .system-menu {
      height: calc(100% - v.$home-version-height);
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
    .el-icon:hover {
      color: #e63f31;
    }
  }
</style>
