import { Gasto } from '../types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

const GASTOS_BASE_URL = 'gastos';
const apiService = new ApiService();

export const getGastos = async (): Promise<Gasto[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return data.gastos;
  }

  try {
    const response = await apiService.get<Gasto[]>(`${GASTOS_BASE_URL}/all`);
    return response;
  } catch (error: unknown) {
    console.error("Error fetching gastos:", error);
    if (error instanceof Error) {
      throw new Error(`Error al obtener gastos: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al obtener los gastos');
  }
};

export const getGastoById = async (id: number): Promise<Gasto> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const gasto = data.gastos.find(g => g.id === id);
    if (!gasto) throw new Error(`Gasto with ID ${id} not found`);
    return gasto;
  }

  try {
    const response = await apiService.get<Gasto>(`${GASTOS_BASE_URL}/getById/${id}`);
    return response;
  } catch (error: unknown) {
    console.error(`Error fetching gasto with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(`Error al obtener el gasto: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al obtener el gasto');
  }
};

export const createGasto = async (gastoData: Omit<Gasto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Gasto> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.gastos.map(g => g.id), 0) + 1;
    const newGasto: Gasto = {
      ...gastoData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as Gasto;
    data.gastos.push(newGasto);
    return newGasto;
  }

  try {
    const response = await apiService.post<Gasto>(`${GASTOS_BASE_URL}/create`, gastoData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating gasto:", error);
    if (error instanceof Error) {
      throw new Error(`Error al crear el gasto: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al crear el gasto');
  }
};

export const updateGasto = async (id: number, gastoData: Partial<Gasto>): Promise<Gasto> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.gastos.findIndex(g => g.id === id);
    if (index === -1) throw new Error(`Gasto with ID ${id} not found`);
    data.gastos[index] = {
      ...data.gastos[index],
      ...gastoData,
      updatedAt: new Date().toISOString(),
    };
    return data.gastos[index];
  }

  try {
    const response = await apiService.patch<Gasto>(`${GASTOS_BASE_URL}/update/${id}`, gastoData);
    return response;
  } catch (error: unknown) {
    console.error(`Error updating gasto with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(`Error al actualizar el gasto: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al actualizar el gasto');
  }
};

export const deleteGasto = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.gastos.findIndex(g => g.id === id);
    if (index !== -1) {
      data.gastos[index].deletedAt = new Date().toISOString();
    }
    return;
  }

  try {
    await apiService.delete(`${GASTOS_BASE_URL}/delete/${id}`);
  } catch (error: unknown) {
    console.error(`Error deleting gasto with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(`Error al eliminar el gasto: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al eliminar el gasto');
  }
};
