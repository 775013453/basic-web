<template>
  <div class="detail-box">
    <el-row>
      <el-col
        v-for="(item, k) in props.detailConfig"
        :key="k"
        :span="24"
      >
        <div
          v-if="item.includes('|[dict]')"
          class="detail-row"
        >
          <div class="detail-text">{{ item.split('|[dict]')[0] }}：</div>
          <div class="detail-value">
            {{ (props.detailData[k] && COMMON_FUNC.dictSwitch(props.detailData[k], item.split('|[dict]')[1])) || '' }}
          </div>
        </div>
        <div
          v-else-if="item.includes('|[length]')"
          class="detail-row"
        >
          <div class="detail-text">{{ item.split('|[length]')[0] }}：</div>
          <div class="detail-value">
            {{ props.detailData[k] && props.detailData[k].substr(0, item.split('|[length]')[1]) }}
          </div>
        </div>
        <div
          v-else
          class="detail-row"
        >
          <div class="detail-text">{{ item }}：</div>
          <div class="detail-value">
            {{ props.detailData[k] }}
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="btns">
      <el-button
        type="primary"
        :icon="'Close'"
        @click="handleReturn"
      >
        关闭
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { COMMON_FUNC } from './utils/common-func';

  /**
   * description：公共详情
   * author: almostSir
   * date：2024-10-31 18:49:27
   */

  const props = defineProps({
    detailConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    // 详情数据,示例：{key:value}
    detailData: {
      type: Object,
      default() {
        return {};
      }
    }
  });

  const emit = defineEmits(['detailReturn']);

  /**
   * description：关闭按钮处理方法
   * author: almostSir
   * date：2024-10-31 11:50:20
   */
  function handleReturn() {
    emit('detailReturn');
  }
</script>

<style lang="scss" scoped>
  .detail-box {
    height: 100%;
  }

  .detail-text {
    display: inline-block;
    width: 80px;
    text-align: right;
    color: #409eff;
  }

  .detail-value {
    width: calc(100% - 80px);
    text-align: left;
  }

  .detail-row {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
  }

  .btns {
    margin: 0;
    text-align: center;
    padding: 16px 0;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    height: 60px;
  }

  :deep() {
    .el-row {
      display: block;
      height: calc(100% - 40px);
      padding: 0 16px;
      overflow-y: auto;
    }

    .el-col {
      padding: 8px 0;
    }
  }
</style>
