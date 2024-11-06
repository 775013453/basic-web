<template>
  <article>
    <header class="header">
      <div
        class="header-left"
        @click="logoClick"
      >
        <img
          class="header-left--logo"
          src="@/assets/img/logo.png"
          alt=""
        />
        <strong class="header-left--name">{{ systemName }}</strong>
      </div>
      <div class="header-right">
        <el-tooltip
          class="theme-switch"
          effect="dark"
          :content="'切换【' + (theme ? '明亮' : '黑暗') + '主题】'"
          placement="left"
        >
          <el-switch
            v-model="theme"
            :size="'large'"
            :inactive-action-icon="'Moon'"
            :active-action-icon="'Sunny'"
            @change="switchTheme()"
          ></el-switch>
        </el-tooltip>
        <img
          class="header-avatar"
          src="@/assets/img/avatar.png"
          alt=""
        />
        <el-dropdown>
          <span class="header-right--name">
            <strong>{{ accountName }}</strong>
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in menuOptions"
                :key="'header-' + index"
                @click="item.clickHandle && item.clickHandle()"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-icon
          :size="20"
          @click="exitClick"
        >
          <SwitchButton />
        </el-icon>
      </div>
    </header>
  </article>
</template>

<script lang="ts" setup>
  import { useShareStore } from '@/store';

  defineProps({
    systemName: {
      type: String,
      default: '系统名称'
    },
    accountName: {
      type: String,
      default: 'admin'
    },
    menuOptions: {
      type: Array<{ [key: string]: unknown; clickHandle: () => void }>,
      default: []
    }
  });
  const emit = defineEmits(['logoClick', 'exitClick']);

  const shareStore = useShareStore();
  const theme = computed(() => shareStore.theme);

  /**
   * description：头部logo点击处理
   * author: almostSir
   * date：2024-10-31 16:37:25
   */
  function logoClick() {
    emit('logoClick');
  }

  /**
   * description：头部退出按钮点击处理
   * author: almostSir
   * date：2024-10-31 16:38:03
   */
  function exitClick() {
    emit('exitClick');
  }

  /**
   * description：切换主题
   * author: almostSir
   * date：2024-11-01 09:24:03
   */
  function switchTheme() {
    shareStore.switchTheme();
  }
</script>
<style lang="scss" scoped>
  @use '@/scss/variable' as v;

  .header {
    height: v.$theme-header-height;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: v.$theme-header-bg;
    color: v.$theme-header-text-color;

    .header-left,
    .header-right {
      display: flex;
      align-items: center;
      padding: 0 24px;
    }

    .header-left {
      cursor: pointer;
    }

    .header-left--logo {
      width: 42px;
    }
    .header-left--name {
      font-size: 18px;
      margin: 0 8px;
    }
    .header-avatar {
      width: 32px;
      border-radius: 50%;
      margin-left: 16px;
    }
    .header-right--name {
      cursor: pointer;
      margin: 4px;
      display: flex;
      align-items: center;
      > strong {
        margin: 4px;
      }
      &:focus-visible {
        outline: none;
      }
      &:hover {
        color: v.$theme-btn-bg;
        transform: scale(1.1);
      }
    }
  }
</style>
