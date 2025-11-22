import { ApiService } from './api.service';
import { Venta, CreateVenta, EstadoVenta } from '@/types';
import { isDemoMode, getDemoData } from './mockDataService';

const apiService = new ApiService();
const VENTA_ENDPOINT = 'ventas';

export const getVentas = async (empresaId?: number, estado?: EstadoVenta): Promise<Venta[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    let ventas = data.ventas;

    if (empresaId) {
      ventas = ventas.filter(v => v.empresaId === empresaId);
    }
    if (estado) {
      ventas = ventas.filter(v => v.estado === estado);
    }

    return ventas;
  }

  try {
    const params = new URLSearchParams();
    if (empresaId) {
      params.append('empresaId', empresaId.toString());
    }
    if (estado) {
      params.append('estado', estado);
    }
    const response = await apiService.get<Venta[]>(`${VENTA_ENDPOINT}/all-relations?${params.toString()}`);

    // Return the raw dates from the database without any transformation
    return response;
  } catch (error: unknown) {
    console.error("Error fetching ventas:", error);
    throw error;
  }
};

export const getVentaById = async (id: number): Promise<Venta> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const venta = data.ventas.find(v => v.id === id);
    if (!venta) {
      throw new Error(`Venta with ID ${id} not found`);
    }
    return venta;
  }

  try {
    return await apiService.get<Venta>(`${VENTA_ENDPOINT}/getById/${id}`);
  } catch (error: unknown) {
    console.error(`Error fetching venta with ID ${id}:`, error);
    throw error;
  }
};

export const createVenta = async (venta: CreateVenta): Promise<Venta> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.ventas.map(v => v.id), 0) + 1;
    const now = new Date();
    const newVenta: Venta = {
      id: newId,
      empresaId: venta.empresaId,
      codigo: venta.codigo,
      fecha: venta.fecha,
      hora: venta.hora,
      total: venta.total,
      pagado: venta.pagado,
      cambio: venta.cambio,
      usuarioId: venta.usuarioId,
      clienteId: venta.clienteId,
      cajaId: venta.cajaId,
      estado: (venta.estado as EstadoVenta) || 'completada',
      detalles: venta.detalles.map((d, i) => ({
        ...d,
        id: i + 1,
        ventaCodigo: venta.codigo,
      })),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: null,
    };
    data.ventas.push(newVenta);
    return newVenta;
  }

  return await apiService.post<Venta, CreateVenta>(`${VENTA_ENDPOINT}/create`, venta);
};

export const updateVenta = async (id: number, venta: Partial<Venta>): Promise<Venta> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.ventas.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Venta with ID ${id} not found`);
    }
    data.ventas[index] = {
      ...data.ventas[index],
      ...venta,
      updatedAt: new Date().toISOString(),
    };
    return data.ventas[index];
  }

  return await apiService.patch<Venta>(`${VENTA_ENDPOINT}/update/${id}`, venta);
};

export const deleteVenta = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.ventas.findIndex(v => v.id === id);
    if (index !== -1) {
      data.ventas[index].deletedAt = new Date().toISOString();
    }
    return;
  }

  return await apiService.delete(`${VENTA_ENDPOINT}/delete/${id}`);
};

export const getVentasByProductoId = async (productoId: number): Promise<Venta[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return data.ventas.filter(v =>
      v.detalles.some(d => d.productoId === productoId)
    );
  }

  try {
    const response = await apiService.get<Venta[]>(`${VENTA_ENDPOINT}/all-relations?productoId=${productoId}`);
    return response;
  } catch (error: unknown) {
    console.error(`Error fetching ventas for producto ID ${productoId}:`, error);
    throw error;
  }
};

export const getVentaByCodigo = async (codigo: string): Promise<Venta> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const venta = data.ventas.find(v => v.codigo === codigo);
    if (!venta) {
      throw new Error(`Venta with codigo ${codigo} not found`);
    }
    return venta;
  }

  try {
    const response = await apiService.get<Venta>(`${VENTA_ENDPOINT}/by-codigo/${codigo}`);
    return response;
  } catch (error: unknown) {
    console.error(`Error fetching venta with codigo ${codigo}:`, error);
    throw error;
  }
};
