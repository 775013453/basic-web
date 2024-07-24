<template>
  <el-menu
    :collapse="props.collapse"
    :default-openeds="props.openeds"
    :class="{ menu__black: props.theme }"
  >
    <template v-for="item in props.menus">
      <sub-menu
        v-if="item.children && item.children.length > 0"
        :key="item.level"
        :menu="item"
      ></sub-menu>
      <el-menu-item
        v-else
        :key="item.level"
        :index="item.level"
        :title="item.label"
        @click="(item.clickCallback && item.clickCallback(item)) || jumpPage(item)"
      >
        <el-button
          link
          :icon="switchIcon(item.icon) || 'Notebook'"
        ></el-button>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
  import SubMenu from '@/components/SubMenu.vue';
  import { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types.mjs';

  // menus为菜单树，collapse为菜单栏伸缩,opened为当前打开的sub-menu的index的数组，theme为主题false为白色，true为黑色
  const props = defineProps({
    menus: {
      type: Array<TreeNodeData>,
      default() {
        return [];
      }
    },
    collapse: {
      type: Boolean,
      default: false
    },
    openeds: {
      type: Array<string>,
      default() {
        return [];
      }
    },
    theme: {
      type: Boolean,
      default: false
    }
  });

  const router = useRouter();

  function switchIcon(icon: string) {
    if (icon) {
      const t = icon.substr(icon.lastIndexOf('-') + 1, icon.length);
      if (t.length > 1) {
        return t.charAt(0).toUpperCase() + t.substr(1, t.length);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  function jumpPage(item) {
    router.push(item.url);
  }
</script>

<style lang="scss">
  .el-menu {
    height: 100%;
    border-right: 0;
    width: 200px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .el-menu-vertical.el-menu {
    overflow-y: auto;
  }

  .el-menu--collapse.el-menu {
    width: auto;
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    min-width: 180px;
  }

  .el-sub-menu__title:hover,
  .el-menu-item:focus,
  .el-menu-item:hover {
    background-color: #409eff;
    color: #fff;

    i {
      color: #fff;
    }
  }

  .el-menu-item.is-active {
    background-color: #409eff;
    color: #fff;
  }

  .el-menu-item.is-active .el-button.is-link {
    color: #fff;
  }

  .el-sub-menu__title {
    background: rgba(255, 255, 245, 1);
  }

  // 修改菜单栏风格为黑色，start
  .menu__black {
    background: rgba(40, 40, 40, 1);

    .el-menu {
      background: rgba(40, 40, 40, 1);
    }

    .el-sub-menu__title {
      background: rgba(0, 0, 0, 1);
    }

    .el-sub-menu__title,
    .el-menu-item {
      color: #fff;

      i {
        color: #fff;
      }
    }
  }
  // 修改菜单栏风格为黑色，end
</style>
