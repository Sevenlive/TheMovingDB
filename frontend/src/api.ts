import type { Box, Item, DashboardStats } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Boxes API
export const boxesApi = {
  getAll: async (params?: { search?: string; location?: string }) => {
    const url = new URL(`${API_BASE_URL}/boxes`);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.location) url.searchParams.set('location', params.location);
    const response = await fetch(url.toString());
    return response.json() as Promise<Box[]>;
  },

  getOne: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/boxes/${id}`);
    return response.json() as Promise<Box>;
  },

  create: async (box: Omit<Box, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await fetch(`${API_BASE_URL}/boxes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(box),
    });
    return response.json() as Promise<Box>;
  },

  update: async (id: number, box: Partial<Box>) => {
    const response = await fetch(`${API_BASE_URL}/boxes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(box),
    });
    return response.json() as Promise<Box>;
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/boxes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  getItems: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/boxes/${id}/items`);
    return response.json() as Promise<Item[]>;
  },
};

// Items API
export const itemsApi = {
  getAll: async (params?: { search?: string; box_id?: number; category?: string }) => {
    const url = new URL(`${API_BASE_URL}/items`);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.box_id) url.searchParams.set('box_id', params.box_id.toString());
    if (params?.category) url.searchParams.set('category', params.category);
    const response = await fetch(url.toString());
    return response.json() as Promise<Item[]>;
  },

  getOne: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    return response.json() as Promise<Item>;
  },

  create: async (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json() as Promise<Item>;
  },

  update: async (id: number, item: Partial<Item>) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json() as Promise<Item>;
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    return response.json() as Promise<DashboardStats>;
  },
};
