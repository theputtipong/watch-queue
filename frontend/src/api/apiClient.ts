const BASE_URL = 'http://localhost:3001/api';
export class ApiError extends Error {
  constructor(public message: string, public status: number, public type: 'NETWORK' | 'SERVER') {
    super(message);
    this.name = 'ApiError';
  }
}
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(errorBody.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', res.status, 'SERVER');
  }
  return res.json();
}
function handleFetchError(error: any): never {
  if (error.name === 'AbortError') {
    throw error; 
  }
  if (error instanceof ApiError) {
    throw error;
  }
  throw new ApiError(`Network Error: ${error.message}`, 0, 'NETWORK');
}
export const apiClient = {
  get: async (endpoint: string, options?: RequestInit) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      return await handleResponse(res);
    } catch (error) {
      handleFetchError(error);
    }
  },
  put: async (endpoint: string, body: any, options?: RequestInit) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options,
      });
      return await handleResponse(res);
    } catch (error) {
      handleFetchError(error);
    }
  },
  delete: async (endpoint: string, body: any, options?: RequestInit) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options,
      });
      return await handleResponse(res);
    } catch (error) {
      handleFetchError(error);
    }
  }
};
