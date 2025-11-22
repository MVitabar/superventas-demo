import { CreateEmpresa, Empresa } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

type ApiError = Error & {
  response?: {
    status: number;
    data?: unknown;
  };
};

const EMPRESA_ENDPOINT = 'empresas';
const apiService = new ApiService();

export const getAllEmpresas = async (): Promise<Empresa[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return [data.empresa]; // Return empresa as array
  }

  try {
    const response = await apiService.get<Empresa[]>(`${EMPRESA_ENDPOINT}/all`);
    return response;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error("Error fetching empresas:", error);
    throw error;
  }
};

export const getEmpresaById = async (id: number): Promise<Empresa> => {
  if (isDemoMode()) {
    const data = getDemoData();
    if (data.empresa.id === id) {
      return data.empresa;
    }
    throw new Error(`Empresa with ID ${id} not found`);
  }

  try {
    return await apiService.get<Empresa>(`${EMPRESA_ENDPOINT}/getById/${id}`);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error(`Error fetching empresa with ID ${id}:`, error);
    throw error;
  }
};

export const createEmpresa = async (empresa: Omit<CreateEmpresa, 'empresa_id'>): Promise<CreateEmpresa> => {
  if (isDemoMode()) {
    console.warn('🎭 DEMO MODE: Cannot create empresa in demo mode');
    throw new Error('No se pueden crear empresas en modo demo');
  }

  try {
    return await apiService.post<Empresa>(`${EMPRESA_ENDPOINT}/create`, empresa);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error("Error creating empresa:", error);
    throw error;
  }
};

export const getEmpresaByUsuarioId = async (owner: number): Promise<Empresa | null> => {
  if (isDemoMode()) {
    const data = getDemoData();
    // In demo mode, return the empresa if the owner matches
    if (data.empresa.owner === owner) {
      return data.empresa;
    }
    return null;
  }

  try {
    const response = await apiService.get<Empresa>(`${EMPRESA_ENDPOINT}/by-owner/${owner}`);
    return response || null;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    // Si es un 404, significa que no se encontró la empresa para este usuario
    if (apiError.response?.status === 404) {
      console.warn(`No se encontró empresa para el usuario con ID ${owner}`);
      return null;
    }
    console.error(`Error obteniendo empresa para el usuario con ID ${owner}:`, error);
    throw error;
  }
};

export const getEmpresaByEmpleadoId = async (empleadoId: number): Promise<Empresa | null> => {
  if (isDemoMode()) {
    const data = getDemoData();
    // In demo mode, check if any user with this ID exists in the empresa
    const userExists = data.usuarios.some(u => u.id === empleadoId);
    if (userExists) {
      return data.empresa;
    }
    return null;
  }

  try {
    const response = await apiService.get<Empresa>(`${EMPRESA_ENDPOINT}/by-empleado/${empleadoId}`);
    return response || null;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    // Si es un 404, significa que no se encontró la empresa para este empleado
    if (apiError.response?.status === 404) {
      console.warn(`No se encontró empresa para el empleado con ID ${empleadoId}`);
      return null;
    }
    console.error(`Error obteniendo empresa para el empleado con ID ${empleadoId}:`, error);
    throw error;
  }
};

export const updateEmpresa = async (id: number, empresa: Partial<Empresa>): Promise<Empresa> => {
  if (isDemoMode()) {
    const data = getDemoData();
    if (data.empresa.id === id) {
      // Update in memory
      Object.assign(data.empresa, empresa);
      return data.empresa;
    }
    throw new Error(`Empresa with ID ${id} not found`);
  }

  try {
    return await apiService.patch<Empresa>(`${EMPRESA_ENDPOINT}/update/${id}`, empresa);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error(`Error updating empresa with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmpresa = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    console.warn('🎭 DEMO MODE: Cannot delete empresa in demo mode');
    throw new Error('No se pueden eliminar empresas en modo demo');
  }

  try {
    return await apiService.delete(`${EMPRESA_ENDPOINT}/delete/${id}`);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error(`Error deleting empresa with ID ${id}:`, error);
    throw error;
  }
}
