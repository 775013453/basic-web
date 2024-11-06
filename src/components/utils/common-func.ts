/**
 * description：常用的公共方法
 * organization：self
 * author: almostSir
 * date：2024-10-31 15:35:03
 */

import { SYSTEM_DICT } from './system-dict';

export const COMMON_FUNC = {
  // 算法：将数组类型组装成树形结构数据,childrenNullDisabled（子元素为空不可选设置,true时，不存在子元素不能选）
  arrayAssembleTree(treeData: TreeConfig, childrenNullDisabled?: boolean): TNode {
    // 默认初始根目录，一般用于初始构建根目录使用，如果设置了value，则以value匹配的值作为根目录
    let rootNode: TNode = {
      label: 'root',
      id: 'root'
    }; // 根节点
    function switchHandle(treeData: TreeConfig, id?: string | number) {
      const data: Array<TNode> = [];
      treeData.data.forEach((e) => {
        // 数据对象下字段field配置字段的值作为根目录节点，如果没有设置值则默认新建root根节点
        if (treeData.value && e[treeData.field] === treeData.value) {
          rootNode = e;
        }

        if (id === e[treeData.parentField]) {
          if (e.children && e.children.length === 0) {
            // isLeaf表示叶子节点
            e.isLeaf = true;
            if (childrenNullDisabled && e.disabled === undefined) {
              e.disabled = true;
            }
          } else {
            e.isLeaf = false;
          }
          data.push(e);
          e.children = switchHandle(treeData, e[treeData.field] as string | number);
          e.children.forEach((m) => {
            m.parent = {
              id: m.id,
              label: m.label
            };
          });
        }
      });
      return data;
    }

    const data = switchHandle(treeData, treeData.value);
    rootNode.children = data;
    rootNode.children.forEach((m) => {
      m.parent = {
        id: rootNode.id,
        label: rootNode.label
      };
    });
    return rootNode;
  },
  // 全局字典value转换label过滤器
  dictSwitch(val: Array<string | number> | string, type: string): string | number {
    const value: Array<string> = [];
    const list: Array<DNode> = SYSTEM_DICT[type];
    if (val instanceof Array) {
      val = val.join(',');
    }
    if (type && String(val)) {
      const valArr = (val + '').split(',').sort(function (a: string, b: string) {
        return Number(a) - Number(b);
      });
      if (list && type) {
        if (valArr.length > 1) {
          valArr.forEach((m: string) => {
            list.some((e) => {
              if (e.value == m && m != '99') {
                value.push(e.label);
                return true;
              }
            });
          });
        } else {
          list.some((e) => {
            if (e.value == valArr[0]) {
              value.push(e.label);
              return true;
            }
          });
        }
      }
      // 如果value长度为0表名在字典中没有找到，做原值返回处理
      if (value.length === 0) {
        value.push(val);
      }
    } else {
      // 如果value长度为0表名在字典中没有找到，做原值返回处理
      if (value.length === 0) {
        value.push(val);
      }
    }
    return value.length === 1 ? value[0] : value.join('、');
  },
  // 生成32位uuid
  uuid(): string {
    function S4(): string {
      // tslint:disable-next-line:no-bitwise
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  },
  // 自定义ajax请求方法
  ajaxRequest({ url, method, headers = {}, params, isAsync = true, callBack, errorBack }: RequestOptions) {
    // 同步请求server-ip.json文件数据获取服务端地址配置
    let xhr: XMLHttpRequest;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open(method, url, isAsync);
    for (const k of Object.keys(headers)) {
      // 必须在open与send之间调用
      xhr.setRequestHeader(k, headers[k]);
    }
    xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        let data: object = {};
        if (typeof xhr.responseText === 'string') {
          data = JSON.parse(xhr.responseText);
        }
        callBack && callBack(data);
      } else {
        errorBack && errorBack(xhr.responseText);
      }
    };
    xhr.send(params && JSON.stringify(params));
  }
};
