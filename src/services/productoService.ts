import { Producto } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData, mockProductos } from './mockDataService';

const api = new ApiService();

export const getAllProductos = async (empresaId?: number): Promise<Producto[]> => {
  if (isDemoMode()) {
    // Return mock data in demo mode
    const data = getDemoData();
    return empresaId ? data.productos.filter(p => p.empresaId === empresaId) : data.productos;
  }

  try {
    let url = 'productos/all';
    if (empresaId) {
      url += `?empresaId=${empresaId}`;
    }
    return await api.get<Producto[]>(url);
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
};

export const getProductoById = async (id: number): Promise<Producto | undefined> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return data.productos.find(p => p.id === id);
  }

  try {
    return await api.get<Producto>(`productos/getById/${id}`);
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error);
    return undefined;
  }
};

export const createProducto = async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.productos.map(p => p.id), 0) + 1;
    const newProducto: Producto = {
      ...producto,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as Producto;
    data.productos.push(newProducto);
    return newProducto;
  }

  try {
    return await api.post<Producto>('productos/create', producto);
  } catch (error) {
    console.error('Error creating producto:', error);
    throw error;
  }
};

export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto | undefined> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      data.productos[index] = {
        ...data.productos[index],
        ...producto,
        updatedAt: new Date().toISOString(),
      };
      return data.productos[index];
    }
    return undefined;
  }

  try {
    return await api.patch<Producto>(`productos/update/${id}`, producto);
  } catch (error) {
    console.error(`Error updating producto ${id}:`, error);
    return undefined;
  }
};

export const deleteProducto = async (id: number): Promise<boolean> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      data.productos[index].deletedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  try {
    await api.delete(`productos/delete/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting producto ${id}:`, error);
    return false;
  }
};
