<template>
  <article class="main">
    <gantt-chart
      :tableData="ganttData.tableData"
      :stableColumn="ganttData.stableColumn"
      :stableWidth="ganttData.stableWidth"
      :startDateTime="ganttData.startDateTime"
      :endDateTime="ganttData.endDateTime"
      :showEndDateTime="ganttData.showEndDateTime"
      :timeType="ganttData.timeType"
      :showTimePos="ganttData.showTimePos"
    >
      <template #rowAbstract="scope">
        <div class="room-name">
          <span>{{ scope.row.roomName }}</span>
          <span>{{ scope.row.complete }}</span>
        </div>
        <div>接台率：{{ scope.row.acceptRate || '-' }}</div>
      </template>
      <template #rowBars="scope">
        <div
          v-for="(e, i) in scope.row"
          :key="i"
          class="operate__bar"
          :style="{ left: e.posX, width: e.width }"
          :class="{
            operate__success: e.detail.state === 1,
            operate__ongoing: e.detail.state === 2
          }"
        >
          <el-icon
            v-if="e.detail.state === 1"
            :size="28"
            color="#36CC3D"
          >
            <CircleCheckFilled />
          </el-icon>

          <el-icon
            v-else-if="e.detail.state === 2"
            :size="28"
            color="#FF9E1C"
          >
            <PieChart />
          </el-icon>

          <el-icon
            v-else
            :size="28"
          >
            <Compass />
          </el-icon>
          <div class="rank-no">{{ e.detail.rank }}</div>

          <div class="patient-name">
            <div>{{ e.detail.patientName }}</div>

            <div>{{ e.detail.operateName }}</div>
          </div>

          <div
            v-if="e.detail.circulatingNurse || e.detail.scrubNurse"
            class="nurse-content"
          >
            <div class="circulating-nurse">
              <span>{{ e.detail.circulatingNurse }}</span>
            </div>

            <div class="scrub-nurse">
              <span>{{ e.detail.scrubNurse }}</span>
            </div>
            <div
              v-if="e.detail.isEmergency"
              class="emergency"
            ></div>
          </div>
        </div>
      </template>
    </gantt-chart>
  </article>
</template>

<script lang="ts" setup>
  import { GanttTableData, StableColumn } from '@/components/GanttChart.vue';
  import { ROOM_DATA } from '@/config/gantt-config';
  import { ManipulateType } from 'dayjs';

  const ganttData = {
    tableData: ROOM_DATA as Array<GanttTableData>,
    stableColumn: [{ label: '术间', width: '150px', align: 'center' }] as Array<StableColumn>,
    stableWidth: 150,
    startDateTime: '2024-11-06 10:00',
    endDateTime: '2024-11-06 19:10',
    showEndDateTime: '2024-11-06 19:00',
    timeType: 'minute' as ManipulateType,
    showTimePos: [11, 16]
  };
</script>
<style lang="scss" scoped>
  .room-name {
    width: 100%;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .operate__bar {
    flex: auto;
    height: 52px;
    display: flex;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 32px;
    align-items: center;
    border: 1px solid #dfdfdf;
    position: absolute;
    background: #fff;
    cursor: pointer;
    overflow: hidden;
    .rank-no {
      font-size: 24px;
      padding: 0 8px;
      border-right: 1px solid #ccc;
      font-weight: 700;
    }
    .patient-name {
      font-size: 16px;
      padding: 0 8px;
      font-weight: 700;
      > div:nth-child(2) {
        font-weight: 400;
        font-size: 12px;
        padding: 4px 0;
      }
    }
    .nurse-content,
    .scrub-nurse {
      font-size: 14px;
      display: flex;
      align-items: center;
    }

    .nurse-content::before {
      content: '巡';
      background: #efa15e;
      color: #fff;
      font-weight: 700;
      padding: 2px;
      border-radius: 4px;
      margin: 4px;
    }
    .scrub-nurse::before {
      content: '器';
      background: #e281ac;
      color: #fff;
      font-weight: 700;
      padding: 2px;
      border-radius: 4px;
      margin: 4px;
    }
    .emergency::before {
      content: '急';
      background: #e94043;
      color: #fff;
      font-weight: 700;
      padding: 4px;
      border-radius: 4px;
      margin: 16px;
    }
  }

  .operate__success {
    background: radial-gradient(#fff, #b7f2e8, #55dcb3);
    box-shadow: 0 4px 4px #55dcb3;
    border: none;
  }
  .operate__ongoing {
    background: radial-gradient(#fff, #eee4b1, #f0b051);
    box-shadow: 0 4px 4px #f0b051;
    border: none;
  }
</style>
