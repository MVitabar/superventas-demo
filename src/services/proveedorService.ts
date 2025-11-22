import { Proveedor } from "@/types";
import { ApiService } from "./api.service";
import { isDemoMode, getDemoData } from './mockDataService';

const api = new ApiService();

const PROVEEDOR_BASE_URL = "proveedores";

export const getAllProveedores = async (
  empresaId?: number
): Promise<Proveedor[]> => {
  if (isDemoMode()) {
    const data = getDemoData();
    return empresaId ? data.proveedores.filter(p => p.empresaId === empresaId) : data.proveedores;
  }

  try {
    let url = `${PROVEEDOR_BASE_URL}/all`;
    if (empresaId) {
      url += `?empresaId=${empresaId}`;
    }
    return await api.get<Proveedor[]>(url);
  } catch (error: any) {
    console.error(
      "Error fetching proveedores:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProveedorById = async (id: number): Promise<Proveedor> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const proveedor = data.proveedores.find(p => p.id === id);
    if (!proveedor) throw new Error(`Proveedor with ID ${id} not found`);
    return proveedor;
  }

  try {
    return await api.get<Proveedor>(`${PROVEEDOR_BASE_URL}/getById/${id}`);
  } catch (error: any) {
    console.error(
      "Error fetching proveedor by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createProveedor = async (
  proveedor: Omit<Proveedor, "id" | "createdAt" | "updatedAt" | "deletedAt">
): Promise<Proveedor> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const newId = Math.max(...data.proveedores.map(p => p.id), 0) + 1;
    const newProveedor: Proveedor = {
      ...proveedor,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as Proveedor;
    data.proveedores.push(newProveedor);
    return newProveedor;
  }

  try {
    return await api.post<Proveedor>(`${PROVEEDOR_BASE_URL}/create`, proveedor);
  } catch (error: any) {
    console.error(
      "Error creating proveedor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProveedor = async (
  id: number,
  proveedor: Partial<Proveedor>
): Promise<Proveedor> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.proveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Proveedor with ID ${id} not found`);
    data.proveedores[index] = {
      ...data.proveedores[index],
      ...proveedor,
      updatedAt: new Date().toISOString(),
    };
    return data.proveedores[index];
  }

  try {
    return await api.patch<Proveedor>(
      `${PROVEEDOR_BASE_URL}/update/${id}`,
      proveedor
    );
  } catch (error: any) {
    console.error(
      "Error updating proveedor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProveedor = async (id: number): Promise<void> => {
  if (isDemoMode()) {
    const data = getDemoData();
    const index = data.proveedores.findIndex(p => p.id === id);
    if (index !== -1) {
      data.proveedores[index].deletedAt = new Date().toISOString();
    }
    return;
  }

  try {
    await api.delete(`${PROVEEDOR_BASE_URL}/delete/${id}`);
  } catch (error: any) {
    console.error(
      "Error deleting proveedor:",
      error.response?.data || error.message
    );
    throw error;
  }
};
