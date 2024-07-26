/**
 * description：mock数据接口配置-字典
 * organization：self
 * author: almostSir
 * date：2024-07-22 15:10:35
 */

export default [
  {
    url: '/api/dict/list',
    method: 'post',
    timeout: 0,
    response: () => {
      const datas: Array<object> = [];
      const json = {
        typeName: '@string(6)',
        type: '@string(3)',
        name: '@cname',
        value: '@pick(["1","2","3","4","5","6"])',
        status: '@pick(["0","1"])',
        parentValue: '@pick(["1","2","3","4","5","6"])',
        updateTime: '@date'
      };
      for (let index = 0; index < 20; index++) {
        datas.push(json);
      }
      return {
        datas,
        operateSuccess: true,
        totals: 20
      };
    }
  },
  {
    url: '/api/dict/findById',
    method: 'post',
    timeout: 0,
    response: () => {
      const json = {
        typeName: '@string(6)',
        type: '@string(3)',
        name: '@cname',
        value: '@pick(["1","2","3","4","5","6"])',
        status: '@pick(["0","1"])',
        parentValue: '@pick(["1","2","3","4","5","6"])',
        updateTime: '@date'
      };
      return {
        datas: json,
        operateSuccess: true
      };
    }
  },
  {
    url: '/api/dict/listAll',
    method: 'post',
    timeout: 0,
    response: () => {
      const datas: Array<object> = [];
      const json = {
        typeName: '@string(6)',
        type: '@string(3)',
        name: '@cname',
        value: '@pick(["1","2","3","4","5","6"])',
        status: '@pick(["0","1"])',
        updateTime: '@date'
      };
      for (let index = 0; index < 20; index++) {
        datas.push(json);
      }
      return {
        datas,
        operateSuccess: true,
        totals: 20
      };
    }
  },
  {
    url: '/api/dict/delete',
    method: 'post',
    timeout: 0,
    response: () => {
      const datas = {
        operateSuccess: true,
        msg: '删除成功'
      };
      return datas;
    }
  },
  {
    url: '/api/dict/saveOrUpdateAll',
    method: 'post',
    timeout: 0,
    response: () => {
      const datas = {
        operateSuccess: true,
        msg: '新增/更新成功'
      };
      return datas;
    }
  }
];
