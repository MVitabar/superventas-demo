import { CompraDetalle } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

const api = new ApiService();

const COMPRA_DETALLE_BASE_URL = 'compra-detalles';

export const getCompraDetalles = async (empresaId?: number): Promise<CompraDetalle[]> => {
  if (isDemoMode()) {
    console.log('🎭 DEMO MODE: Getting compra detalles from mock data');
    const data = getDemoData();
    return empresaId
      ? data.compraDetalles.filter(d => d.empresaId === empresaId)
      : data.compraDetalles;
  }

  try {
    const url = empresaId
      ? `${COMPRA_DETALLE_BASE_URL}/all?empresaId=${empresaId}`
      : `${COMPRA_DETALLE_BASE_URL}/all`;
    return await api.get<CompraDetalle[]>(url);
  } catch (error: any) {
    console.error("Error fetching compra detalles:", error.response?.data || error.message);
    throw error;
  }
};

export const getCompraDetalleById = async (id: number): Promise<CompraDetalle> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const detalle = data.compraDetalles.find(d => d.id === id);
    if (!detalle) throw new Error(`CompraDetalle with ID ${id} not found`);
    return detalle;
  }

  try {
    return await api.get<CompraDetalle>(`${COMPRA_DETALLE_BASE_URL}/getById/${id}`);
  } catch (error: any) {
    console.error("Error fetching compra detalle by ID:", error.response?.data || error.message);
    throw error;
  }
};

export const getCompraDetalleByCodigo = async (codigo: string): Promise<CompraDetalle[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return data.compraDetalles.filter(d => d.compraCodigo === codigo);
  }

  try {
    return await api.get<CompraDetalle[]>(`${COMPRA_DETALLE_BASE_URL}/by-compra-codigo/${codigo}`);
  } catch (error: any) {
    console.error(`Error fetching venta detalle with codigo ${codigo}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createCompraDetalle = async (detalle: Omit<CompraDetalle, 'id'>): Promise<CompraDetalle> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.compraDetalles.map(d => d.id), 0) + 1;
    const newDetalle: CompraDetalle = {
      ...detalle,
      id: newId,
    } as CompraDetalle;
    data.compraDetalles.push(newDetalle);
    return newDetalle;
  }

  try {
    return await api.post<CompraDetalle>(`${COMPRA_DETALLE_BASE_URL}/create`, detalle);
  } catch (error: any) {
    console.error("Error creating compra detalle:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCompraDetalle = async (id: number, detalle: Partial<CompraDetalle>): Promise<CompraDetalle> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.compraDetalles.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`CompraDetalle with ID ${id} not found`);
    data.compraDetalles[index] = {
      ...data.compraDetalles[index],
      ...detalle,
    };
    return data.compraDetalles[index];
  }

  try {
    return await api.patch<CompraDetalle>(`${COMPRA_DETALLE_BASE_URL}/update/${id}`, detalle);
  } catch (error: any) {
    console.error("Error updating compra detalle:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCompraDetalle = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.compraDetalles.findIndex(d => d.id === id);
    if (index !== -1) {
      data.compraDetalles.splice(index, 1);
    }
    return;
  }

  try {
    await api.delete(`${COMPRA_DETALLE_BASE_URL}/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting compra detalle:", error.response?.data || error.message);
    throw error;
  }
};
