import { Compra } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

const api = new ApiService();

const COMPRA_BASE_URL = 'compras';

export const getCompras = async (empresaId?: number): Promise<Compra[]> => {
  if (isDemoMode()) {
    console.log('🎭 DEMO MODE: Getting compras from mock data');
    const data = getDemoData();
    return empresaId ? data.compras.filter(c => c.empresaId === empresaId) : data.compras;
  }

  try {
    const url = empresaId
      ? `${COMPRA_BASE_URL}/all?empresaId=${empresaId}`
      : `${COMPRA_BASE_URL}/all`;
    return await api.get<Compra[]>(url);
  } catch (error: any) {
    console.error("Error fetching compras:", error.response?.data || error.message);
    throw error;
  }
};

export const getCompraById = async (id: number): Promise<Compra> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const compra = data.compras.find(c => c.id === id);
    if (!compra) throw new Error(`Compra with ID ${id} not found`);
    return compra;
  }

  try {
    return await api.get<Compra>(`${COMPRA_BASE_URL}/getById/${id}`);
  } catch (error: any) {
    console.error("Error fetching compra by ID:", error.response?.data || error.message);
    throw error;
  }
};

export const getCompraByCodigo = async (codigo: string): Promise<Compra> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const compra = data.compras.find(c => c.codigo === codigo);
    if (!compra) throw new Error(`Compra with codigo ${codigo} not found`);
    return compra;
  }

  try {
    return await api.get<Compra>(`${COMPRA_BASE_URL}/by-codigo/${codigo}`);
  } catch (error: any) {
    console.error("Error fetching compra by codigo:", error.response?.data || error.message);
    throw error;
  }
};

export const createCompra = async (compra: Omit<Compra, 'id'>): Promise<Compra> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.compras.map(c => c.id), 0) + 1;
    const newCompra: Compra = {
      ...compra,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as Compra;
    data.compras.push(newCompra);
    return newCompra;
  }

  try {
    return await api.post<Compra>(`${COMPRA_BASE_URL}/create`, compra);
  } catch (error: any) {
    console.error("Error creating compra:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCompra = async (id: number, compra: Partial<Compra>): Promise<Compra> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.compras.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Compra with ID ${id} not found`);
    data.compras[index] = {
      ...data.compras[index],
      ...compra,
      updatedAt: new Date().toISOString(),
    };
    return data.compras[index];
  }

  try {
    return await api.patch<Compra>(`${COMPRA_BASE_URL}/update/${id}`, compra);
  } catch (error: any) {
    console.error("Error updating compra:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCompra = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.compras.findIndex(c => c.id === id);
    if (index !== -1) {
      data.compras[index].deletedAt = new Date().toISOString();
    }
    return;
  }

  try {
    await api.delete(`${COMPRA_BASE_URL}/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting compra:", error.response?.data || error.message);
    throw error;
  }
};
