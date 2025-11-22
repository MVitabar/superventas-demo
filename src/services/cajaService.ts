import { ApiService } from './api.service';
import { Caja, CreateCajaDto, UpdateCajaDto } from '@/types/caja.interface';
import { isDemoMode, getDemoData } from './mockDataService';

const apiService = new ApiService();

export const getAllCajas = async (empresaId?: number): Promise<Caja[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return empresaId ? data.cajas.filter(c => c.empresaId === empresaId) : data.cajas;
  }

  try {
    let url = 'cajas/all';
    if (empresaId) {
      url += `?empresaId=${empresaId}`;
    }
    const response = await apiService.get<any[]>(url);

    console.log('Respuesta de la API de cajas:', response);

    // Mapear los campos de la base de datos a la interfaz Caja
    const cajas = response.map(caja => {
      const cajaMapeada = {
        id: caja.id,
        numero: caja.caja_numero || caja.numero,
        nombre: caja.caja_nombre || caja.nombre,
        efectivo: caja.caja_efectivo || caja.efectivo || '0.00',
        empresaId: caja.empresa_id || caja.empresaId,
        createdAt: caja.created_at || caja.createdAt,
        updatedAt: caja.updated_at || caja.updatedAt,
        deletedAt: caja.deleted_at || caja.deletedAt || null
      };

      console.log('Caja mapeada:', cajaMapeada);
      return cajaMapeada;
    });

    console.log('Cajas después del mapeo:', cajas);
    return cajas;
  } catch (error) {
    console.error('Error al obtener las cajas:', error);
    throw error;
  }
};

export const getCajaById = async (id: number): Promise<Caja> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const caja = data.cajas.find(c => c.id === id);
    if (!caja) throw new Error(`Caja with ID ${id} not found`);
    return caja;
  }

  return await apiService.get<Caja>(`cajas/getById/${id}`);
};

export const createCaja = async (caja: CreateCajaDto): Promise<Caja> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.cajas.map(c => c.id), 0) + 1;
    const newCaja = {
      ...caja,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as unknown as Caja;
    data.cajas.push(newCaja);
    return newCaja;
  }

  return await apiService.post<Caja>('cajas/create', caja as any);
};

export const updateCaja = async (id: number, caja: UpdateCajaDto): Promise<Caja> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.cajas.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Caja with ID ${id} not found`);
    data.cajas[index] = {
      ...data.cajas[index],
      ...caja,
      updatedAt: new Date(),
    } as unknown as Caja;
    return data.cajas[index];
  }

  return await apiService.patch<Caja>(`cajas/update/${id}`, caja as any);
};

export const deleteCaja = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.cajas.findIndex(c => c.id === id);
    if (index !== -1) {
      data.cajas[index].deletedAt = new Date() as any;
    }
    return;
  }

  return await apiService.delete(`cajas/delete/${id}`);
};
