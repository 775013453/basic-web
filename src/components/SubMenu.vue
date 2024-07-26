<template>
  <template
    v-for="item in props.menu"
    :key="item.id"
  >
    <template v-if="item.children && item.children.length > 0">
      <el-sub-menu :index="item.id">
        <template #title>
          <el-button
            link
            :icon="switchIcon(item.icon)"
          ></el-button>
          <span>{{ item.label }}</span>
        </template>
        <sub-menu :menu="item.children"></sub-menu>
      </el-sub-menu>
    </template>
    <el-menu-item
      v-else
      :index="item.id"
      :title="item.label"
      @click="(item.clickCallback && item.clickCallback(item)) || jumpPage(item)"
    >
      <el-button
        link
        :icon="switchIcon(item.icon)"
      ></el-button>
      <span>{{ item.label }}</span>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
  // menus为菜单子树
  const props = defineProps({
    menu: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const router = useRouter();

  /**
   * description：icon截取处理
   * author: almostSir
   * date：2024-07-26 11:55:51
   */
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
<style lang="scss" scoped>
  .el-sub-menu__title:hover {
    color: #2c2c2c;
  }

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
    background: rgba(255, 255, 255, 1);
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
</style>
