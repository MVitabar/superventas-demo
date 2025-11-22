import { VentaPendiente } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

const api = new ApiService();

const VENTA_PENDIENTE_BASE_URL = 'ventas';

export const getVentasPendientes = async (empresaId?: number): Promise<VentaPendiente[]> => {
  if (isDemoMode()) {
    console.log('🎭 DEMO MODE: Getting ventas pendientes from mock data');
    const data = getDemoData();
    return empresaId
      ? data.ventasPendientes.filter(v => v.empresaId === empresaId)
      : data.ventasPendientes;
  }

  try {
    const url = empresaId
      ? `${VENTA_PENDIENTE_BASE_URL}/all-relations?estado=pendiente&empresaId=${empresaId}`
      : `${VENTA_PENDIENTE_BASE_URL}/all-relations?estado=pendiente`;
    return await api.get<VentaPendiente[]>(url);
  } catch (error: any) {
    console.error("Error fetching ventas pendientes:", error.response?.data || error.message);
    throw error;
  }
};

export const getVentaPendienteById = async (id: number): Promise<VentaPendiente> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const venta = data.ventasPendientes.find(v => v.id === id);
    if (!venta) throw new Error(`VentaPendiente with ID ${id} not found`);
    return venta;
  }

  try {
    return await api.get<VentaPendiente>(`${VENTA_PENDIENTE_BASE_URL}/getById/${id}`);
  } catch (error: any) {
    console.error("Error fetching venta pendiente by ID:", error.response?.data || error.message);
    throw error;
  }
};

export const createVentaPendiente = async (venta: Omit<VentaPendiente, 'id'>): Promise<VentaPendiente> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.ventasPendientes.map(v => v.id), 0) + 1;
    const newVenta: VentaPendiente = {
      ...venta,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as VentaPendiente;
    data.ventasPendientes.push(newVenta);
    return newVenta;
  }

  try {
    return await api.post<VentaPendiente>(`${VENTA_PENDIENTE_BASE_URL}/create`, venta);
  } catch (error: any) {
    console.error("Error creating venta pendiente:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVentaPendiente = async (id: number, venta: Partial<VentaPendiente>): Promise<VentaPendiente> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.ventasPendientes.findIndex(v => v.id === id);
    if (index === -1) throw new Error(`VentaPendiente with ID ${id} not found`);
    data.ventasPendientes[index] = {
      ...data.ventasPendientes[index],
      ...venta,
      updatedAt: new Date().toISOString(),
    };
    return data.ventasPendientes[index];
  }

  try {
    return await api.patch<VentaPendiente>(`${VENTA_PENDIENTE_BASE_URL}/update/${id}`, venta);
  } catch (error: any) {
    console.error("Error updating venta pendiente:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteVentaPendiente = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.ventasPendientes.findIndex(v => v.id === id);
    if (index !== -1) {
      data.ventasPendientes[index].deletedAt = new Date().toISOString();
    }
    return;
  }

  try {
    await api.delete(`${VENTA_PENDIENTE_BASE_URL}/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting venta pendiente:", error.response?.data || error.message);
    throw error;
  }
};

export const convertirVentaPendienteAVenta = async (id: number): Promise<any> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const ventaPendiente = data.ventasPendientes.find(v => v.id === id);
    if (!ventaPendiente) throw new Error(`VentaPendiente with ID ${id} not found`);

    // Remove from pendientes
    const index = data.ventasPendientes.findIndex(v => v.id === id);
    if (index !== -1) {
      data.ventasPendientes.splice(index, 1);
    }

    // Add to ventas
    const newVentaId = Math.max(...data.ventas.map(v => v.id), 0) + 1;
    const newVenta = {
      ...ventaPendiente,
      id: newVentaId,
      estado: 'completada' as const,
      deletedAt: null,
    } as any; // Type assertion to avoid type conflicts between VentaPendiente and Venta
    data.ventas.push(newVenta);

    return newVenta;
  }

  try {
    return await api.post(`${VENTA_PENDIENTE_BASE_URL}/convertir/${id}`, {});
  } catch (error: any) {
    console.error("Error converting venta pendiente:", error.response?.data || error.message);
    throw error;
  }
};

export const completarVentaPendiente = async (id: number, pagoInfo: {
  pagado: string;
  cambio: string;
  cajaId: number;
  usuarioId: number;
  empresaId: number;
}): Promise<any> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const ventaPendiente = data.ventasPendientes.find(v => v.id === id);
    if (!ventaPendiente) throw new Error(`VentaPendiente with ID ${id} not found`);

    // Remove from pendientes
    const index = data.ventasPendientes.findIndex(v => v.id === id);
    if (index !== -1) {
      data.ventasPendientes.splice(index, 1);
    }

    // Add to ventas as completed
    const newVentaId = Math.max(...data.ventas.map(v => v.id), 0) + 1;
    const newVenta = {
      ...ventaPendiente,
      id: newVentaId,
      estado: 'completada' as const,
      pagado: pagoInfo.pagado,
      cambio: pagoInfo.cambio,
      cajaId: pagoInfo.cajaId,
      deletedAt: null,
    } as any;
    data.ventas.push(newVenta);

    return newVenta;
  }

  try {
    return await api.patch(`${VENTA_PENDIENTE_BASE_URL}/update/${id}`, {
      estado: 'completada',
      ...pagoInfo,
    });
  } catch (error: any) {
    console.error("Error completing venta pendiente:", error.response?.data || error.message);
    throw error;
  }
};

export const actualizarYFinalizarVenta = async (
  id: number,
  ventaData: any,
  pagoInfo: {
    pagado: string;
    cambio: string;
    cajaId: number;
    usuarioId: number;
    empresaId: number;
  }
): Promise<any> => {
  if (isDemoMode()) {
    console.log('🎭 DEMO MODE: Actualizando y finalizando venta pendiente');

    // First update the venta pendiente
    await updateVentaPendiente(id, ventaData);

    // Then complete it
    return await completarVentaPendiente(id, pagoInfo);
  }

  try {
    console.log('🔄 Actualizando venta pendiente antes de finalizar...');

    // Update the venta pendiente first
    await updateVentaPendiente(id, ventaData);
    console.log('✅ Venta pendiente actualizada correctamente');

    // Then finalize it
    console.log('🚀 Finalizando la venta...');
    const ventaFinalizada = await api.patch(`${VENTA_PENDIENTE_BASE_URL}/update/${id}`, {
      estado: 'completada',
      ...pagoInfo,
      detalles: ventaData.detalles || []
    });

    console.log('🎉 Venta finalizada exitosamente');
    return ventaFinalizada;
  } catch (error: any) {
    console.error('❌ Error al actualizar y finalizar la venta:', error);
    throw error;
  }
};

