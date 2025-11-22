import { VentaDetalle } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

const api = new ApiService();

const VENTA_DETALLE_BASE_URL = 'venta-detalles';

export const getVentaDetalles = async (empresaId?: number): Promise<VentaDetalle[]> => {
  if (isDemoMode()) {
    console.log('🎭 DEMO MODE: Getting venta detalles from mock data');
    const data = getDemoData();
    return empresaId ? data.ventaDetalles.filter(d => d.empresaId === empresaId) : data.ventaDetalles;
  }

  try {
    const url = empresaId
      ? `${VENTA_DETALLE_BASE_URL}/all?empresaId=${empresaId}`
      : `${VENTA_DETALLE_BASE_URL}/all`;
    return await api.get<VentaDetalle[]>(url);
  } catch (error: any) {
    console.error("Error fetching venta detalles:", error.response?.data || error.message);
    throw error;
  }
};

export const getVentaDetalleById = async (id: number): Promise<VentaDetalle> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const detalle = data.ventaDetalles.find(d => d.id === id);
    if (!detalle) throw new Error(`VentaDetalle with ID ${id} not found`);
    return detalle;
  }

  try {
    return await api.get<VentaDetalle>(`${VENTA_DETALLE_BASE_URL}/getById/${id}`);
  } catch (error: any) {
    console.error("Error fetching venta detalle by ID:", error.response?.data || error.message);
    throw error;
  }
};

export const createVentaDetalle = async (detalle: any): Promise<VentaDetalle> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.ventaDetalles.map(d => d.id), 0) + 1;
    const newDetalle: VentaDetalle = {
      ...detalle,
      id: newId,
    } as VentaDetalle;
    data.ventaDetalles.push(newDetalle);
    return newDetalle;
  }

  try {
    return await api.post<VentaDetalle>(`${VENTA_DETALLE_BASE_URL}/create`, detalle);
  } catch (error: any) {
    console.error("Error creating venta detalle:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVentaDetalle = async (id: number, detalle: Partial<VentaDetalle>): Promise<VentaDetalle> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.ventaDetalles.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`VentaDetalle with ID ${id} not found`);
    data.ventaDetalles[index] = {
      ...data.ventaDetalles[index],
      ...detalle,
    };
    return data.ventaDetalles[index];
  }

  try {
    return await api.patch<VentaDetalle>(`${VENTA_DETALLE_BASE_URL}/update/${id}`, detalle);
  } catch (error: any) {
    console.error("Error updating venta detalle:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteVentaDetalle = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.ventaDetalles.findIndex(d => d.id === id);
    if (index !== -1) {
      data.ventaDetalles.splice(index, 1);
    }
    return;
  }

  try {
    await api.delete(`${VENTA_DETALLE_BASE_URL}/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting venta detalle:", error.response?.data || error.message);
    throw error;
  }
};

export const getDetallesByVentaId = async (ventaId: number): Promise<VentaDetalle[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    // Filter detalles by venta codigo - need to find the venta first
    const venta = data.ventas.find(v => v.id === ventaId);
    if (!venta) return [];
    return data.ventaDetalles.filter(d => d.ventaCodigo === venta.codigo);
  }

  try {
    const response = await api.get<VentaDetalle[]>(`${VENTA_DETALLE_BASE_URL}/all-relations?ventaId=${ventaId}`);
    return response;
  } catch (error: any) {
    console.error(`Error fetching venta detalles for venta ID ${ventaId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const getVentaDetalleByCodigo = async (codigo: string): Promise<VentaDetalle[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return data.ventaDetalles.filter(d => d.ventaCodigo === codigo);
  }

  try {
    const response = await api.get<VentaDetalle[]>(`${VENTA_DETALLE_BASE_URL}/by-codigo/${codigo}`);
    return response;
  } catch (error: any) {
    console.error(`Error fetching venta detalle with codigo ${codigo}:`, error.response?.data || error.message);
    throw error;
  }
};
