//  mockProdServer.ts

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly
// You can use the import.meta.glob function to import all

import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

import mockModule from '@/mock/index';

export function setupProdMockServer() {
  createProdMockServer([...mockModule]);
}
