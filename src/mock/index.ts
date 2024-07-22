/**
 * description：mock数据接口配置
 * organization：self
 * author: almostSir
 * date：2024-07-22 14:10:11
 */
import { MockMethod } from 'vite-plugin-mock';

import dictMock from './dict.mock';

export default [...dictMock] as MockMethod[];
