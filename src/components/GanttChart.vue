<template>
  <article
    ref="ganttRef"
    class="gantt"
  >
    <div class="gantt-chart">
      <div
        class="gantt-header"
        :style="{ width: 6 * timeLine.length + stableWidth + 'px' }"
      >
        <div
          class="stable-column"
          :style="{ flex: stableFixWidth }"
        >
          <div
            v-for="(item, index) in stableColumn"
            :key="'gantt-' + index"
            :style="{ width: item.width, 'text-align': item.align }"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="gantt-time">
          <template v-for="(item, index) in timeLine">
            <span
              v-if="index % 10 === 0"
              :key="'ganttTime-' + index"
              style="flex: 0 0 60px"
            >
              {{ showTime(item) }}
            </span>
          </template>
        </div>
      </div>
      <div
        class="timeline"
        :style="{ 'margin-left': stableWidth + 36 + 'px', width: `calc(100% + ${stableWidth + 36 + 'px'})` }"
      >
        <div
          v-for="item in calcParams(timeLine.length)"
          :key="'ganttTimeline-' + item"
        ></div>
        <el-tooltip
          :content="currentTime"
          placement="right"
        >
          <div
            class="timeline__current"
            :style="{ left: currentTimePosX }"
          ></div>
        </el-tooltip>
      </div>
      <div class="gantt-content">
        <div
          v-for="item in tableData"
          :key="item.id"
          ref="ganttRowRef"
          class="gantt-row"
        >
          <div
            class="stable-column"
            :style="{ flex: stableFixWidth }"
          >
            <div
              v-for="(s, index) in stableColumn"
              :key="'ganttAtr-' + index"
              class="row-abstract"
              :style="{ width: s.width, 'text-align': s.align }"
            >
              <slot
                name="rowAbstract"
                :row="item"
              ></slot>
            </div>
          </div>
          <slot
            name="rowBars"
            :row="item.bars"
          ></slot>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
  import dayjs, { ManipulateType } from 'dayjs';
  import { PropType } from 'vue';

  const props = defineProps({
    tableData: {
      type: Array<GanttTableData>,
      default: () => {
        return [];
      }
    },
    stableColumn: {
      type: Array<StableColumn>,
      default: () => {
        return [];
      }
    },
    // 固定列宽度
    stableWidth: {
      type: Number,
      default: 150
    },
    // 整个时间轴的开始时间
    startDateTime: {
      type: String,
      default: ''
    },
    // 整个时间轴的结束时间
    endDateTime: {
      type: String,
      default: ''
    },
    // 时间轴显示时间的结束时间
    showEndDateTime: {
      type: String,
      default: ''
    },
    // 时间类型
    timeType: {
      type: String as PropType<ManipulateType>,
      default: 'minute'
    },
    // 时间轴展示的时间位置，截取的时间开始与结束位置
    showTimePos: {
      type: Array<number>,
      default: [11, 16]
    },
    // 是否滚动到当前时间点
    isScrollCurrentTime: {
      type: Boolean,
      default: true
    },
    // 自动滚动配置
    autoScroll: {
      type: Object as PropType<AutoScroll>,
      default: () => {
        return {
          state: false,
          intervalTime: 3000,
          times: 1
        };
      }
    }
  });

  const ganttRef = ref();
  const ganttRowRef = ref();

  // 时间线数据
  const timeLine: Array<string> = [];

  let startTime: number = new Date(props.startDateTime).getTime();
  const endTime: number = new Date(props.endDateTime).getTime();

  // 根据开始时间与结束时间以及时间类型拼装时间线数据
  do {
    timeLine.push(dayjs(startTime).format('YYYY-MM-DD HH:mm'));
    const s = dayjs(startTime).add(1, props.timeType).format('YYYY-MM-DD HH:mm');
    startTime = new Date(s).getTime();
  } while (startTime <= endTime);

  // 获取当前时间
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  // 根据时间类型，获取当前时间距离开始时间的间隔数
  const columnWidth = Math.ceil(dayjs(currentTime).diff(props.startDateTime, props.timeType));
  // 当前时间的偏移位置
  const currentTimePosX = `${columnWidth * 6}px`;

  // 设置固定列宽度
  const stableFixWidth = `0 0 ${props.stableWidth}px`;

  let timer: NodeJS.Timeout;
  if (props.isScrollCurrentTime) {
    let t = setTimeout(() => {
      scrollPos(columnWidth * 6 - 400);
      let currentScrollPosY: number = 0;
      // 监听鼠标或者手放上去事件
      ganttRef.value.addEventListener('mouseover', () => {
        currentScrollPosY = ganttRef.value.scrollTop;
        clearInterval(timer);
      });

      // 监听鼠标或者手离开去事件
      ganttRef.value.addEventListener('mouseleave', () => {
        if (props.autoScroll.state) {
          timer = autoScrollY(props.autoScroll.intervalTime, props.autoScroll.times, currentScrollPosY);
        }
      });
      if (props.autoScroll.state) {
        timer = autoScrollY(props.autoScroll.intervalTime, props.autoScroll.times, currentScrollPosY);
      }
      clearTimeout(t);
    }, 0);
  }

  props.tableData.forEach((m) => {
    m.bars.forEach((e) => {
      const posX = dayjs(e.beginDate).diff(props.startDateTime, props.timeType) / 10;
      const w = dayjs(e.endDate).diff(e.beginDate, props.timeType) / 10;
      e.posX = `${posX * 60 + props.stableWidth + 40}px`;
      e.width = `${w * 60}px`;
    });
  });

  /**
   * description：根据时间拆分为以10单位的分段数，len为时间线数组长度
   * author: almostSir
   * date：2024-10-31 15:09:41
   */
  function calcParams(len: number): number {
    return Math.ceil(len / 10);
  }

  /**
   * description：与显示时间范围比较，超出时间不显示，time为指定时间
   * author: almostSir
   * date：2024-10-31 18:45:02
   */
  function showTime(time: string): string {
    const s = dayjs(time).diff(props.showEndDateTime, props.timeType) <= 0;
    if (s) {
      return time.substring(props.showTimePos[0], props.showTimePos[1]);
    } else {
      return '';
    }
  }

  /**
   * description：滚动到指定位置，posX为横向滚动距离，posY为纵向滚动距离
   * author: almostSir
   * date：2024-10-31 09:12:28
   */
  function scrollPos(posX: number, posY: number = 0): void {
    if (ganttRef.value) {
      ganttRef.value.scrollLeft = posX;
      ganttRef.value.scrollTop = posY;
    }
  }

  /**
   * description：自动纵向滚动控制，intervalTime为滚动间隔时间,times为滚动间隔元素个数,startPosY为开始位置
   * author: almostSir
   * date：2024-10-31 09:52:52
   */
  function autoScrollY(intervalTime = 3000, times = 1, startPosY = 0): NodeJS.Timeout {
    let posY = startPosY;
    const eleH = ganttRowRef.value[0].clientHeight;
    const timer = setInterval(() => {
      posY += eleH * times;
      scrollPos(ganttRef.value?.scrollLeft || 0, posY);
    }, intervalTime);
    return timer;
  }

  export type GanttTableData = {
    id: string;
    bars: Array<DateConfig>;
    [key: string]: unknown;
  };

  export type DateConfig = {
    beginDate: string;
    endDate: string;
    detail: {
      [key: string]: unknown;
    };
    [key: string]: unknown;
    posX?: string;
    width?: string;
  };

  //  固定列配置参数描述
  export type StableColumn = {
    label: string;
    width: string;
    align: 'left' | 'right' | 'center';
  };

  // 自动滚动配置参数描述
  export type AutoScroll = {
    state: boolean; // 自动滚动开关
    intervalTime: number; // 滚动时间间隔
    times: number; // 一次滚动的行数
  };
</script>
<style lang="scss" scoped>
  .gantt {
    overflow: auto;
    background: #fff;
    color: #4a4955;
    margin: 8px;
    height: calc(100% - 16px) !important;
  }
  .gantt-chart {
    width: fit-content;
    height: fit-content;
    display: flex;
    background: #fff;
    box-sizing: border-box;
    position: relative;
    flex-wrap: wrap;
  }

  .gantt-content {
    width: 100%;
  }
  .gantt-header {
    display: flex;
    padding-top: 16px;
    position: sticky;
    top: 0;
    z-index: 2;
    background: #fff;
  }

  .stable-column {
    font-weight: 700;
    position: sticky;
    left: 0;
    background: #fff;
    z-index: 2;
    flex-wrap: wrap;
    padding: 8px;
    box-sizing: border-box;
    height: calc(100% - 8px);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .row-abstract {
    width: 100%;
    height: 100%;
    border: 1px solid #cfe1ea;
    border-radius: 8px;
    color: #4a4955;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    box-sizing: border-box;
    padding: 8px;
  }

  .gantt-time {
    display: flex;
    padding: 8px 0;
    margin-left: 2px;
  }

  .gantt-row {
    width: 100%;
    display: flex;
    color: #0a5a81;
    position: relative;
    height: 88px;
    align-items: center;
    position: sticky;
  }

  .timeline {
    width: 100%;
    height: calc(100% - 50px);
    position: absolute;
    top: 50px;
    display: flex;
    > div {
      flex: 0 0 60px;
      border-left: 1px solid #eee;
      box-sizing: border-box;
    }

    .timeline__current {
      height: 100%;
      flex: 0;
      border-left: 3px solid #e94043;
      position: absolute;
      z-index: 2;
      cursor: pointer;
    }
  }
</style>
