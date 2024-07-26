/**
 * description：组织架构图数据配置案例（此处为一个使用例子）
 * organization：self
 * author: almostSir
 * date：2024-07-26 10:09:36
 */

export const TREE_MOCK = {
  nodes: {
    isRoot: true,
    id: 'root',
    title: '手术学院',
    content: '内部职级评估',
    iconClass: 'icon-class',
    iconType: 'icon-shujuji',
    endpoints: [
      {
        id: '1',
        orientation: [0, 1],
        pos: [0.5, 0]
      }
    ],
    children: [
      {
        id: 'subNode1',
        title: '护师',
        content: '1-10级',
        // collapsed: true,
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        endpoints: [
          {
            id: '1',
            orientation: [0, -1],
            pos: [0.5, 0]
          },
          {
            id: '2',
            orientation: [0, 1],
            pos: [0.5, 0]
          }
        ],
        children: [
          {
            id: 'subNode1-1',
            title: '理论知识',
            content: '理论知识学习与考核',
            iconType: 'icon-guize-kai',
            iconClass: 'icon-class',
            color: '#249544',
            endpoints: [
              {
                id: '1',
                orientation: [0, -1],
                pos: [0.5, 0]
              }
            ]
          },
          {
            id: 'subNode1-2',
            title: '操作技能',
            content: '上手操作学习与考核',
            iconType: 'icon-guize-kai',
            iconClass: 'icon-class',
            endpoints: [
              {
                id: '1',
                orientation: [0, -1],
                pos: [0.5, 0]
              }
            ]
          }
        ]
      },
      {
        id: 'subNode2',
        title: '医师',
        content: '1-10级',
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        // collapsed: true,
        endpoints: [
          {
            id: '1',
            orientation: [0, -1],
            pos: [0.5, 0]
          },
          {
            id: '2',
            orientation: [0, 1],
            pos: [0.5, 0]
          }
        ],
        children: [
          {
            id: 'subNode2-1',
            title: '理论知识',
            content: '理论知识学习与考核',
            iconType: 'icon-guize-kai',
            iconClass: 'icon-class',
            endpoints: [
              {
                id: '1',
                orientation: [0, -1],
                pos: [0.5, 0]
              }
            ]
          },
          {
            id: 'subNode2-2',
            title: '操作技能',
            content: '上手操作学习与考核',
            iconType: 'icon-guize-kai',
            iconClass: 'icon-class',
            endpoints: [
              {
                id: '1',
                orientation: [0, -1],
                pos: [0.5, 0]
              }
            ]
          }
        ]
      },
      {
        id: 'subNode3',
        title: '其他',
        content: '沟通、协调能力',
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        endpoints: [
          {
            id: '1',
            orientation: [0, -1],
            pos: [0.5, 0]
          }
        ]
      }
    ]
  },
  edges: [
    {
      id: '0',
      source: '1',
      target: '1',
      sourceNode: 'root',
      targetNode: 'subNode1',
      type: 'endpoint'
    },
    {
      id: '1',
      source: '1',
      target: '1',
      sourceNode: 'root',
      targetNode: 'subNode2',
      type: 'endpoint'
    },
    {
      id: '2',
      source: '1',
      target: '1',
      sourceNode: 'root',
      targetNode: 'subNode3',
      type: 'endpoint'
    },
    {
      id: '3',
      source: '2',
      target: '1',
      sourceNode: 'subNode1',
      targetNode: 'subNode1-1',
      type: 'endpoint'
    },
    {
      id: '4',
      source: '2',
      target: '1',
      sourceNode: 'subNode1',
      targetNode: 'subNode1-2',
      type: 'endpoint'
    },
    {
      id: '5',
      source: '2',
      target: '1',
      sourceNode: 'subNode2',
      targetNode: 'subNode2-1',
      type: 'endpoint'
    },
    {
      id: '6',
      source: '2',
      target: '1',
      sourceNode: 'subNode2',
      targetNode: 'subNode2-2',
      type: 'endpoint'
    }
  ]
};
