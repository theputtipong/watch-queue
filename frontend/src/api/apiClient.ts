// src/api/apiClient.ts
/**
 * ตั้งค่า API Client พื้นฐานสำหรับเรียกไปที่ Backend
 * หากเราใช้ Axios ก็สามารถตั้งค่า interceptors ได้ที่นี่
 * แต่เพื่อความง่าย เราจะใช้ native fetch API
 */

const BASE_URL = 'http://localhost:3001/api';

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`GET ${endpoint} failed`);
    return res.json();
  },
  put: async (endpoint: string, body: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (endpoint: string, body: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
