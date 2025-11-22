


import { Cliente } from '@/types';
import { ApiService } from './api.service';
import { isDemoMode, getDemoData } from './mockDataService';

const api = new ApiService();

const CLIENTE_BASE_URL = 'clientes';

export const getAllClientes = async (empresaId?: number): Promise<Cliente[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return empresaId ? data.clientes.filter(c => c.empresaId === empresaId) : data.clientes;
  }

  try {
    let url = `${CLIENTE_BASE_URL}/all`;
    if (empresaId) {
      url += `?empresaId=${empresaId}`;
    }
    return await api.get<Cliente[]>(url);
  } catch (error: any) {
    console.error("Error fetching clientes:", error.response?.data || error.message);
    throw error;
  }
};

export const getClienteById = async (id: number): Promise<Cliente> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const cliente = data.clientes.find(c => c.id === id);
    if (!cliente) throw new Error(`Cliente with ID ${id} not found`);
    return cliente;
  }

  try {
    return await api.get<Cliente>(`${CLIENTE_BASE_URL}/getById/${id}`);
  } catch (error: any) {
    console.error("Error fetching cliente by ID:", error.response?.data || error.message);
    throw error;
  }
};

export const createCliente = async (cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Cliente> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.clientes.map(c => c.id), 0) + 1;
    const newCliente: Cliente = {
      ...cliente,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as Cliente;
    data.clientes.push(newCliente);
    return newCliente;
  }

  try {
    return await api.post<Cliente>(`${CLIENTE_BASE_URL}/create`, cliente);
  } catch (error: any) {
    console.error("Error creating cliente:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCliente = async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.clientes.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Cliente with ID ${id} not found`);
    data.clientes[index] = {
      ...data.clientes[index],
      ...cliente,
      updatedAt: new Date().toISOString(),
    };
    return data.clientes[index];
  }

  try {
    return await api.patch<Cliente>(`${CLIENTE_BASE_URL}/update/${id}`, cliente);
  } catch (error: any) {
    console.error("Error updating cliente:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCliente = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      data.clientes[index].deletedAt = new Date().toISOString();
    }
    return;
  }

  try {
    await api.delete(`${CLIENTE_BASE_URL}/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting cliente:", error.response?.data || error.message);
    throw error;
  }
};
