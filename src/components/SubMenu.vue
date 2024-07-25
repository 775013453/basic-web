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
  console.log(props.menu);
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
