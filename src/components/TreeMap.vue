<template>
  <div id="tree-map"></div>
</template>

<script lang="ts" setup>
  const emit = defineEmits(['edit', 'delete']);

  // 基础节点dom拼接
  class BaseNode extends TreeNode {
    draw = (opts) => {
      const node = document.createElement('div');
      node.classList.add('iot-node');
      node.setAttribute('style', `top:${opts.top}px;left:${opts.left}px`);
      node.setAttribute('id', opts.id);
      const nodeClickFunc = this.mouseRightClick.bind(this, opts.id);
      node.addEventListener('contextmenu', nodeClickFunc);

      const titleDom = document.createElement('div');
      titleDom.classList.add(`title`);
      titleDom.setAttribute('style', `background:${opts.options.color}`);
      const titleDomIcon = document.createElement('i');
      const classArr = ['iconfont', opts.options.iconType, opts.options.iconClass];
      titleDomIcon.classList.add(...classArr);
      titleDom.append(titleDomIcon);
      const titleDomSpan = document.createElement('span');
      titleDomSpan.innerText = opts.options.title;
      titleDom.append(titleDomSpan);

      const contentDom = document.createElement('div');
      contentDom.classList.add('node-content');
      contentDom.innerText = opts.options.content;

      node.append(titleDom);
      node.append(contentDom);
      if (opts.options.children) {
        this.showExpandBtn(node);
      }
      return node;
    };

    /**
     * description：先生扩展按钮
     * author: almostSir
     * date：2024-07-26 11:56:39
     */
    showExpandBtn(container) {
      const expandBtn: HTMLDivElement = document.createElement('div');
      expandBtn.classList.add('expand-btn');
      expandBtn.innerText = '...';

      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this.collapsed) {
          // 可以在这里向后端请求数据,把node传进expand
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.expand();
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.collapse();
        }
      });
      container.append(expandBtn);
    }

    /**
     * description：鼠标右键点击处理
     * author: almostSir
     * date：2024-07-26 11:57:17
     */
    mouseRightClick(id, e) {
      // 防止重复创建右键菜单栏
      const t = document.getElementsByClassName('mouse-menu');
      if (t.length > 0) {
        t[0].remove();
      }
      e.preventDefault();
      const u = document.createElement('ul');
      u.classList.add('mouse-menu');
      u.setAttribute('style', `top:${e.clientY}px;left:${e.clientX}px`);
      u.setAttribute('id', id);

      const l1 = document.createElement('li');
      l1.innerText = '编辑';
      l1.classList.add('Edit');
      const clickEditFunc = function () {
        emit('edit', id);
      };
      l1.addEventListener('click', clickEditFunc, true);
      u.appendChild(l1);

      const l2 = document.createElement('li');
      l2.innerText = '删除';
      l2.classList.add('Delete');

      const clickDeleteFunc = function () {
        emit('delete', id);
      };

      l2.addEventListener('click', clickDeleteFunc, true);
      u.appendChild(l2);

      document.body.appendChild(u);
    }
  }

  let canvas;

  const props = defineProps({
    treeData: {
      type: Object,
      default() {
        return {};
      }
    }
  });

  onMounted(() => {
    addNodeClass(props.treeData.nodes);
    drawTree(props.treeData);
  });

  /**
   * description：绘制树形结构
   * author: almostSir
   * date：2024-07-26 11:57:36
   */
  function drawTree(treeData) {
    let root = document.getElementById('tree-map');
    canvas = new TreeCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true, // 可连线
      draggable: true, // 可拖动
      zoomable: true, // 可放大
      moveable: true, // 可平移
      theme: {
        edge: {
          shapeType: 'Manhattan',
          arrow: true
        },
        isMouseMoveStopPropagation: true // 拖动事件是否阻止冒泡
      },
      layout: {
        type: 'compactBox',
        options: {
          direction: 'TB',
          getHeight() {
            return 60;
          },
          getWidth() {
            return 120;
          },
          getHGap() {
            return 20;
          },
          getVGap() {
            return 80;
          }
        }
      }
    });
    canvas.draw(treeData, {}, () => {
      canvas.focusCenterWithAnimate();
    });
    canvas.on('system.canvas.click', () => {
      // 防止重复创建右键菜单栏
      const t = document.getElementsByClassName('mouse-menu');
      if (t.length > 0) {
        t[0].remove();
      }
    });
  }

  /**
   * description：添加树形节点
   * author: almostSir
   * date：2024-07-26 11:57:50
   */
  function addNodeClass(nodes) {
    nodes.Class = BaseNode;
    if (nodes.children && nodes.children.length) {
      nodes.children.forEach((e) => {
        addNodeClass(e);
      });
    }
  }
</script>

<style lang="scss">
  #tree-map {
    height: 100%;
    width: 100%;
    background: #f9f9f9;
  }
  .butterfly-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 3;
  }

  // 节点样式配置
  .iot-node {
    position: absolute;
    min-width: 100px;
    height: 64px;
    cursor: pointer;
    .title {
      color: #fff;
      padding: 6px;
      border-radius: 4px 4px 0 0;
      border: #fff;
      background: #f66902;
      text-align: center;
      .icon-class {
        vertical-align: bottom;
        margin-right: 5px;
      }
    }
    .title:hover {
      background: #1c6573 !important;
    }
    .node-content {
      padding: 8px;
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 0 0 4px 4px;
      font-size: 12px;
      color: #222;
      text-align: center;
    }

    .expand-btn {
      position: relative;
      bottom: -12px;
      left: calc(50% - 10px);
      height: 14px;
      line-height: 8px;
      width: 20px;
      text-align: center;
      border-radius: 4px;
      border: #ddd;
      background: #f66902;
      color: #fff;
      cursor: pointer;
      font-weight: 700;
    }
    .expand-btn:hover {
      background: #1c6573;
    }
  }

  .butterfly-svg {
    position: relative;
    pointer-events: auto !important;
    overflow: visible !important;
  }

  .butterflies-link {
    fill: none;
    stroke: #bfbfbf;
    stroke-width: 1px;
  }

  .butterflies-link:hover {
    stroke: #f66902;
  }

  .butterflies-arrow {
    fill: #bfbfbf;
    stroke: #bfbfbf;
    stroke-width: 1px;
  }

  .butterflie-circle-endpoint {
    position: absolute;
    z-index: 100;
    width: 6px;
    height: 6px;
    border: 1px solid #1c6573;
    border-radius: 50%;
    background: #fff;
  }

  .mouse-menu {
    position: absolute;
    z-index: 2000;
    background: #eee;
    box-shadow: 0px 0px 8px 1px #ccc;
    padding: 0;
    li {
      display: block;
      margin: 8px;
      cursor: pointer;
      padding: 12px 24px;
      border-radius: 4px;
    }
    li::before {
      padding: 0 6px;
    }
    li:hover {
      background: #1c6573;
      color: #fff;
    }
  }
</style>
