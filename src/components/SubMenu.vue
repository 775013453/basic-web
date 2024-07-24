<template>
  <el-sub-menu :index="props?.menu?.level">
    <template #title>
      <el-button
        link
        :icon="switchIcon(props?.menu?.icon) || 'Notebook'"
      ></el-button>
      <span>{{ props?.menu?.label }}</span>
    </template>
    <template v-for="item in props?.menu?.children">
      <sub-menu
        v-if="item.children && item.children.length > 0"
        :key="item.level"
        :menu="item"
      ></sub-menu>
      <el-menu-item
        v-else
        :key="item.level"
        :index="item.level"
        @click="(item.clickCallback && item.clickCallback(item)) || jumpPage(item)"
      >
        <el-button
          link
          :icon="switchIcon(item.icon) || 'Notebook'"
        ></el-button>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </template>
  </el-sub-menu>
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
