import { Usuario } from '@/types';
import { ApiService } from './api.service';

// Define the structure for the user object in the API response
export interface UserResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  cargo: string;
  cajaId: number;
  foto: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  empresaId: number;
  hasChangedPassword: boolean | string | number; // Puede ser boolean, '0'/'1' o 0/1
}

// Define the structure for the login API response
export interface LoginResponse {
  access_token: string;
  user: UserResponse;
}

// Update credentials interface to use username
export interface LoginCredentials {
  username: string;
  password: string;
}

// Instantiate ApiService outside the object
const apiServiceInstance = new ApiService();

// Helper function to map API response to Usuario type
function mapUserResponse(user: UserResponse): Usuario {
  // Convertir hasChangedPassword a booleano (manejar '0'/'1' o true/false)
  const hasChangedPassword = user.hasChangedPassword === true ||
    user.hasChangedPassword === '1' ||
    user.hasChangedPassword === 1;

  return {
    // Original fields with usuario_ prefix
    usuario_id: user.id,
    usuario_nombre: user.nombre,
    usuario_apellido: user.apellido,
    usuario_email: user.email,
    usuario_usuario: user.usuario,
    usuario_cargo: user.cargo,
    caja_id: user.cajaId,
    usuario_foto: user.foto,
    empresaId: user.empresaId,
    usuario_clave: '', // Inicializamos con cadena vacía ya que no deberíamos exponer la contraseña
    has_changed_password: hasChangedPassword,
    hasChangedPassword: hasChangedPassword,
    usuario_creado: user.createdAt,
    usuario_actualizado: user.updatedAt,
    usuario_eliminado: user.deletedAt,
    // Additional fields without prefix (for compatibility)
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    usuario: user.usuario,
    cargo: user.cargo,
    cajaId: user.cajaId,
    foto: user.foto,
    estado: 'activo',
    clave: ''
  } as Usuario;
}

export const usuarioService = {
  apiService: apiServiceInstance,

  async getAllUsuarios(): Promise<Usuario[]> {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('🎭 DEMO MODE: Getting all usuarios from mock data');
      const { mockUsuarios } = await import('./mockDataService');

      // Map mock usuarios to the Usuario format expected by the app
      return mockUsuarios.map(user => ({
        usuario_id: user.id,
        usuario_nombre: user.nombre,
        usuario_apellido: user.apellido,
        usuario_email: user.email,
        usuario_usuario: user.usuario,
        usuario_cargo: user.cargo,
        caja_id: user.cajaId,
        usuario_foto: user.foto,
        empresaId: user.empresaId,
        usuario_clave: '',
        has_changed_password: user.hasChangedPassword,
        hasChangedPassword: user.hasChangedPassword,
        usuario_creado: new Date().toISOString(),
        usuario_actualizado: new Date().toISOString(),
        usuario_eliminado: null,
        // Additional fields that might be needed
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        usuario: user.usuario,
        cargo: user.cargo,
        cajaId: user.cajaId,
        foto: user.foto,
        estado: user.estado,
        clave: ''
      } as Usuario));
    }

    try {
      const response = await apiServiceInstance.get<UserResponse[]>('usuarios/all');
      return response.map(mapUserResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error('Error al obtener la lista de usuarios');
    }
  },

  async getUsuarioById(id: number): Promise<Usuario | undefined> {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('🎭 DEMO MODE: Getting usuario by ID from mock data');
      const { mockUsuarios } = await import('./mockDataService');
      const user = mockUsuarios.find(u => u.id === id);

      if (!user) return undefined;

      return {
        usuario_id: user.id,
        usuario_nombre: user.nombre,
        usuario_apellido: user.apellido,
        usuario_email: user.email,
        usuario_usuario: user.usuario,
        usuario_cargo: user.cargo,
        caja_id: user.cajaId,
        usuario_foto: user.foto,
        empresaId: user.empresaId,
        usuario_clave: '',
        has_changed_password: user.hasChangedPassword,
        hasChangedPassword: user.hasChangedPassword,
        usuario_creado: new Date().toISOString(),
        usuario_actualizado: new Date().toISOString(),
        usuario_eliminado: null,
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        usuario: user.usuario,
        cargo: user.cargo,
        cajaId: user.cajaId,
        foto: user.foto,
        estado: user.estado,
        clave: ''
      } as Usuario;
    }

    try {
      const response = await apiServiceInstance.get<UserResponse>(`usuarios/getById/${id}`);
      return mapUserResponse(response);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return undefined;
    }
  },

  async createUsuario(usuarioData: Omit<Usuario, 'usuario_id' | 'usuario_creado' | 'usuario_actualizado' | 'usuario_eliminado' | 'hasChangedPassword'> & { hasChangedPassword?: boolean }): Promise<Usuario> {
    try {
      // Ensure empresaId is a number and not null/undefined
      if (usuarioData.empresaId === undefined || usuarioData.empresaId === null) {
        throw new Error('empresaId is required when creating a user');
      }

      const empresaId = Number(usuarioData.empresaId);
      if (isNaN(empresaId)) {
        throw new Error('empresaId must be a valid number');
      }

      const payload = {
        nombre: usuarioData.usuario_nombre,
        apellido: usuarioData.usuario_apellido,
        email: usuarioData.usuario_email,
        usuario: usuarioData.usuario_usuario,
        cargo: usuarioData.usuario_cargo,
        cajaId: usuarioData.caja_id,
        foto: usuarioData.usuario_foto,
        clave: usuarioData.usuario_clave,
        empresaId: empresaId, // Ensure it's a number
        hasChangedPassword: usuarioData.has_changed_password ?? false
      };

      console.log('Sending payload to server:', payload);

      console.log('Creating user with payload:', payload);
      const response = await apiServiceInstance.post<UserResponse>('usuarios/create', payload);
      return mapUserResponse(response);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error('Error al crear el usuario');
    }
  },

  async updateUsuario(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    try {
      const payload = {
        nombre: usuario.usuario_nombre,
        apellido: usuario.usuario_apellido,
        email: usuario.usuario_email,
        usuario: usuario.usuario_usuario,
        cargo: usuario.usuario_cargo,
        cajaId: usuario.caja_id,
        foto: usuario.usuario_foto,
        empresaId: usuario.empresaId // Assuming empresaId is part of the payload
      };
      const response = await apiServiceInstance.patch<UserResponse>(`usuarios/update/${id}`, payload);
      return mapUserResponse(response);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw new Error('Error al actualizar el usuario');
    }
  },

  async deleteUsuario(id: number): Promise<void> {
    try {
      // Realizar un soft delete estableciendo la fecha de eliminación y estado
      await apiServiceInstance.patch(`usuarios/update/${id}`, {
        deletedAt: new Date().toISOString(),
        usuario_estado: 'INACTIVO'  // Actualizar el estado a INACTIVO
      });
    } catch (error) {
      console.error(`Error al marcar como eliminado el usuario ${id}:`, error);
      throw new Error('Error al marcar como eliminado el usuario');
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Check if demo mode is active
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('🎭 DEMO MODE: Attempting login with mock data');

      // Import mock data
      const { mockUsuarios } = await import('./mockDataService');

      // Find user by username or email
      const user = mockUsuarios.find(u =>
        (u.usuario === credentials.username || u.email === credentials.username) &&
        u.clave === credentials.password
      );

      if (!user) {
        console.error('🎭 DEMO MODE: Invalid credentials');
        throw new Error('Usuario o contraseña incorrectos');
      }

      console.log('🎭 DEMO MODE: Login successful for user:', user.usuario);

      // Create mock response matching LoginResponse interface
      const mockResponse: LoginResponse = {
        access_token: 'demo_token_' + Date.now(),
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          usuario: user.usuario,
          cargo: user.cargo,
          cajaId: user.cajaId,
          foto: user.foto,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          empresaId: user.empresaId,
          hasChangedPassword: user.hasChangedPassword
        }
      };

      return mockResponse;
    }

    // Original API login code
    try {
      console.log('Intentando iniciar sesión con:', {
        username: credentials.username,
        // No mostramos la contraseña en los logs por seguridad
        password: '***'
      });

      // Usar los nombres de campos que espera el backend
      const response = await apiServiceInstance.post<LoginResponse>('auth/login', {
        username: credentials.username,
        password: credentials.password
      });

      console.log('Inicio de sesión exitoso para el usuario:', credentials.username);
      return response;
    } catch (error: unknown) {
      console.error("Error en el inicio de sesión:", error);

      // Verificar el tipo de error
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; data?: { message?: string }; message: string };

        // Error de credenciales incorrectas
        if (apiError.status === 401) {
          throw new Error('Usuario o contraseña incorrectos');
        }

        // Otros errores con mensaje del servidor
        const serverMessage = apiError.data?.message || apiError.message;
        if (typeof serverMessage === 'string' && serverMessage.toLowerCase().includes('contraseña')) {
          throw new Error(serverMessage);
        }
      }

      // Error genérico
      throw new Error('Error al intentar iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.');
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },


  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<UserResponse> {
    try {
      console.log('Actualizando contraseña para el usuario:', userId);

      // First, update the password
      const response = await apiServiceInstance.patch<UserResponse>(`usuarios/update/${userId}`, {
        current_password: currentPassword, // Current password for verification
        new_password: newPassword,         // New password to set
        clave: newPassword,                // Ensure the password is updated in the 'clave' field
        has_changed_password: true,        // Mark that the password has been changed
        hasChangedPassword: true           // Alternative field name for backward compatibility
      });

      console.log('Respuesta del servidor al actualizar contraseña:', response);

      // Then, update the user's has_changed_password status
      const updateResponse = await this.updateUsuario(userId, {
        has_changed_password: true
      });

      console.log('Respuesta al actualizar estado de contraseña:', updateResponse);

      // Update user in localStorage if it's the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          hasChangedPassword: true,
          has_changed_password: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Usuario actualizado en localStorage:', updatedUser);
      }

      return response;
    } catch (error) {
      console.error("Password update failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la contraseña';
      throw new Error(errorMessage);
    }
  }
};

// Removemos las exportaciones individuales ya que ahora están dentro del objeto usuarioService
