// Mock Data Service for SuperVentas Demo
// Generates realistic test data for all entities

import { faker } from '@faker-js/faker';
import type {
    Empresa,
    Usuario,
    Producto,
    Cliente,
    Proveedor,
    Categoria,
    Venta,
    VentaDetalle,
    Compra,
    CompraDetalle,
    Gasto,
    VentaPendiente,
    CreateEmpresa,
} from '@/types';
import type { Caja } from '@/types/caja.interface';

// Faker is already configured with default locale
// Note: In newer versions of Faker, locale is set differently

// ============================================================================
// CONSTANTS
// ============================================================================

const EMPRESA_ID = 1;
const DEMO_PASSWORD = 'demo123'; // Same password for all demo users

// Departamentos de Guatemala
const DEPARTAMENTOS_GUATEMALA = [
    'Guatemala',
    'Alta Verapaz',
    'Baja Verapaz',
    'Chimaltenango',
    'Chiquimula',
    'El Progreso',
    'Escuintla',
    'Huehuetenango',
    'Izabal',
    'Jalapa',
    'Jutiapa',
    'Petén',
    'Quetzaltenango',
    'Quiché',
    'Retalhuleu',
    'Sacatepéquez',
    'San Marcos',
    'Santa Rosa',
    'Sololá',
    'Suchitepéquez',
    'Totonicapán',
    'Zacapa',
];

// Municipios ejemplo (algunos de los principales)
const MUNICIPIOS_GUATEMALA: Record<string, string[]> = {
    Guatemala: ['Guatemala', 'Mixco', 'Villa Nueva', 'San Miguel Petapa', 'Villa Canales'],
    Quetzaltenango: ['Quetzaltenango', 'Salcajá', 'Olintepeque', 'San Mateo'],
    Escuintla: ['Escuintla', 'Santa Lucía Cotzumalguapa', 'La Democracia', 'Siquinalá'],
};

// Categorías de productos
const CATEGORIAS_PRODUCTOS = [
    { nombre: 'Electrónica', ubicacion: 'Pasillo A' },
    { nombre: 'Ropa', ubicacion: 'Pasillo B' },
    { nombre: 'Alimentos', ubicacion: 'Pasillo C' },
    { nombre: 'Bebidas', ubicacion: 'Pasillo D' },
    { nombre: 'Hogar', ubicacion: 'Pasillo E' },
    { nombre: 'Deportes', ubicacion: 'Pasillo F' },
    { nombre: 'Juguetes', ubicacion: 'Pasillo G' },
    { nombre: 'Libros', ubicacion: 'Pasillo H' },
];

// Marcas de productos
const MARCAS = [
    'Samsung', 'LG', 'Sony', 'Panasonic', 'Philips',
    'Nike', 'Adidas', 'Puma', 'Reebok',
    'Coca-Cola', 'Pepsi', 'Gallo', 'Dos Pinos',
    'Bimbo', 'Diana', 'Marinela',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatDateTime(date: Date): string {
    return date.toISOString();
}

function generateNIT(): string {
    const num = Math.floor(Math.random() * 9999999);
    return `${num}-${Math.floor(Math.random() * 9)}`;
}

function generateDPI(): string {
    return String(Math.floor(1000000000000 + Math.random() * 9000000000000));
}

// ============================================================================
// EMPRESA
// ============================================================================

export const mockEmpresa: Empresa = {
    id: EMPRESA_ID,
    nombre: 'SuperVentas Demo',
    nit: '12345678-9',
    telefono: '+502 2345-6789',
    email: 'info@superventas-demo.com',
    direccion: 'Zona 10, Ciudad de Guatemala',
    owner: 1, // Owner user ID
    foto: 'https://via.placeholder.com/150/0088FE/FFFFFF?text=SV',
};

// ============================================================================
// USUARIOS
// ============================================================================

export const mockUsuarios: Usuario[] = [
    {
        id: 1,
        empresaId: EMPRESA_ID,
        nombre: 'Carlos',
        apellido: 'Administrador',
        email: 'owner@superventas.com',
        usuario: 'owner',
        clave: DEMO_PASSWORD,
        cargo: 'Owner',
        foto: 'https://i.pravatar.cc/150?img=12',
        cajaId: 1,
        estado: 'activo',
        hasChangedPassword: true,
    },
    {
        id: 2,
        empresaId: EMPRESA_ID,
        nombre: 'María',
        apellido: 'González',
        email: 'admin@superventas.com',
        usuario: 'admin',
        clave: DEMO_PASSWORD,
        cargo: 'Administrador',
        foto: 'https://i.pravatar.cc/150?img=5',
        cajaId: 1,
        estado: 'activo',
        hasChangedPassword: true,
    },
    {
        id: 3,
        empresaId: EMPRESA_ID,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'cajero@superventas.com',
        usuario: 'cajero',
        clave: DEMO_PASSWORD,
        cargo: 'Cajero',
        foto: 'https://i.pravatar.cc/150?img=33',
        cajaId: 1,
        estado: 'activo',
        hasChangedPassword: true,
    },
    {
        id: 4,
        empresaId: EMPRESA_ID,
        nombre: 'Ana',
        apellido: 'Martínez',
        email: 'vendedor@superventas.com',
        usuario: 'vendedor',
        clave: DEMO_PASSWORD,
        cargo: 'Vendedor',
        foto: 'https://i.pravatar.cc/150?img=9',
        cajaId: 2,
        estado: 'activo',
        hasChangedPassword: true,
    },
];

// ============================================================================
// CAJAS
// ============================================================================

export const mockCajas: Caja[] = [
    {
        id: 1,
        numero: 1,
        empresaId: EMPRESA_ID,
        nombre: 'Caja Principal',
        estado: 'abierta',
        efectivo: '1000.00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        deletedAt: undefined,
    } as unknown as Caja,
    {
        id: 2,
        numero: 2,
        empresaId: EMPRESA_ID,
        nombre: 'Caja Secundaria',
        estado: 'abierta',
        efectivo: '500.00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        deletedAt: undefined,
    } as unknown as Caja,
];

// ============================================================================
// CATEGORÍAS
// ============================================================================

export const mockCategorias: Categoria[] = CATEGORIAS_PRODUCTOS.map((cat, index) => ({
    id: index + 1,
    empresaId: EMPRESA_ID,
    nombre: cat.nombre,
    ubicacion: cat.ubicacion,
    createdAt: formatDateTime(new Date('2024-01-01')),
    updatedAt: formatDateTime(new Date()),
    deletedAt: null,
}));

// ============================================================================
// PRODUCTOS
// ============================================================================

function generateProducto(id: number): Producto {
    const categoria = getRandomElement(mockCategorias);
    const marca = getRandomElement(MARCAS);
    const precioCompra = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
    const precioVenta = precioCompra * faker.number.float({ min: 1.2, max: 2.5, fractionDigits: 2 });

    return {
        id,
        empresaId: EMPRESA_ID,
        codigo: `PROD-${String(id).padStart(5, '0')}`,
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        stockTotal: faker.number.int({ min: 0, max: 200 }),
        tipoUnidad: getRandomElement(['Unidad', 'Caja', 'Paquete', 'Litro', 'Kilogramo']),
        precioCompra: precioCompra.toFixed(2),
        precioVenta: precioVenta.toFixed(2),
        marca,
        modelo: `${marca}-${faker.string.alphanumeric(4).toUpperCase()}`,
        estado: 'activo',
        foto: `https://via.placeholder.com/300/0088FE/FFFFFF?text=${categoria.nombre}`,
        categoriaId: categoria.id,
        createdAt: formatDateTime(getRandomDate(180)),
        updatedAt: formatDateTime(new Date()),
        deletedAt: null,
    };
}

export const mockProductos: Producto[] = Array.from({ length: 50 }, (_, i) => generateProducto(i + 1));

// ============================================================================
// CLIENTES
// ============================================================================

function generateCliente(id: number): Cliente {
    const departamento = getRandomElement(DEPARTAMENTOS_GUATEMALA);
    const municipios = MUNICIPIOS_GUATEMALA[departamento] || [departamento];
    const municipio = getRandomElement(municipios);

    return {
        id,
        empresaId: EMPRESA_ID,
        tipoDocumento: getRandomElement(['DPI', 'NIT', 'Pasaporte']),
        numeroDocumento: generateDPI(),
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),
        departamento,
        municipio,
        direccion: faker.location.streetAddress(),
        telefono: `+502 ${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        email: faker.internet.email(),
        createdAt: formatDateTime(getRandomDate(365)),
        updatedAt: formatDateTime(new Date()),
        deletedAt: null,
    };
}

export const mockClientes: Cliente[] = Array.from({ length: 20 }, (_, i) => generateCliente(i + 1));

// ============================================================================
// PROVEEDORES
// ============================================================================

function generateProveedor(id: number): Proveedor {
    const departamento = getRandomElement(DEPARTAMENTOS_GUATEMALA);
    const municipios = MUNICIPIOS_GUATEMALA[departamento] || [departamento];
    const municipio = getRandomElement(municipios);

    return {
        id,
        empresaId: EMPRESA_ID,
        tipoDocumento: 'NIT',
        numeroDocumento: generateNIT(),
        nombre: faker.company.name(),
        departamento,
        municipio,
        direccion: faker.location.streetAddress(),
        telefono: `+502 ${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        email: faker.internet.email(),
        createdAt: formatDateTime(getRandomDate(365)),
        updatedAt: formatDateTime(new Date()),
        deletedAt: null,
    };
}

export const mockProveedores: Proveedor[] = Array.from({ length: 10 }, (_, i) => generateProveedor(i + 1));

// ============================================================================
// VENTAS Y DETALLES
// ============================================================================

function generateVentaDetalle(venta_codigo: string, productos: Producto[]): VentaDetalle[] {
    const numItems = faker.number.int({ min: 1, max: 5 });
    const detalles: VentaDetalle[] = [];

    for (let i = 0; i < numItems; i++) {
        const producto = getRandomElement(productos);
        const cantidad = faker.number.int({ min: 1, max: 10 });
        const precioVenta = typeof producto.precioVenta === 'string' ? parseFloat(producto.precioVenta) : producto.precioVenta;
        const precioCompra = typeof producto.precioCompra === 'string' ? parseFloat(producto.precioCompra) : producto.precioCompra;
        const total = cantidad * precioVenta;

        detalles.push({
            id: detalles.length + 1,
            productoId: producto.id,
            cantidad,
            precioVenta: precioVenta.toFixed(2),
            precioCompra: precioCompra.toFixed(2),
            total: total.toFixed(2),
            descripcion: producto.nombre,
            empresaId: EMPRESA_ID,
            ventaCodigo: venta_codigo,
            producto,
        });
    }

    return detalles;
}

function generateVenta(id: number): Venta {
    const fecha = getRandomDate(180);
    const codigo = `V-${formatDate(fecha).replace(/-/g, '')}-${String(id).padStart(4, '0')}`;
    const cliente = getRandomElement(mockClientes);
    const usuario = getRandomElement(mockUsuarios.filter(u => u.cargo !== 'Owner'));
    const caja = getRandomElement(mockCajas);

    const detalles = generateVentaDetalle(codigo, mockProductos);
    const total = detalles.reduce((sum, d) => sum + (typeof d.total === 'string' ? parseFloat(d.total) : d.total), 0);
    const pagado = total + faker.number.float({ min: 0, max: 100, fractionDigits: 2 });
    const cambio = pagado - total;

    return {
        id,
        empresaId: EMPRESA_ID,
        codigo,
        fecha: formatDate(fecha),
        hora: formatTime(fecha),
        total: total.toFixed(2),
        pagado: pagado.toFixed(2),
        cambio: cambio.toFixed(2),
        usuarioId: usuario.id,
        clienteId: cliente.id,
        cajaId: caja.id,
        estado: getRandomElement(['completada', 'completada', 'completada', 'pendiente', 'cancelada'] as const),
        detalles,
        cliente,
        usuario,
        createdAt: formatDateTime(fecha),
        updatedAt: formatDateTime(fecha),
        deletedAt: null,
    };
}

export const mockVentas: Venta[] = Array.from({ length: 100 }, (_, i) => generateVenta(i + 1));

// Extract all venta detalles
export const mockVentaDetalles: VentaDetalle[] = mockVentas.flatMap(v => v.detalles);

// ============================================================================
// COMPRAS Y DETALLES
// ============================================================================

function generateCompraDetalle(compra_codigo: string, productos: Producto[]): CompraDetalle[] {
    const numItems = faker.number.int({ min: 1, max: 8 });
    const detalles: CompraDetalle[] = [];

    for (let i = 0; i < numItems; i++) {
        const producto = getRandomElement(productos);
        const cantidad = faker.number.int({ min: 5, max: 50 });
        const precioCompra = parseFloat(producto.precioCompra);
        const total = cantidad * precioCompra;

        detalles.push({
            id: detalles.length + 1,
            empresaId: EMPRESA_ID,
            cantidad,
            precioCompra: precioCompra.toFixed(2),
            total: total.toFixed(2),
            productoId: producto.id,
            compraCodigo: compra_codigo,
            createdAt: formatDateTime(new Date()),
            updatedAt: formatDateTime(new Date()),
            deletedAt: null,
        });
    }

    return detalles;
}

function generateCompra(id: number): Compra {
    const fecha = getRandomDate(90);
    const codigo = `C-${formatDate(fecha).replace(/-/g, '')}-${String(id).padStart(4, '0')}`;
    const proveedor = getRandomElement(mockProveedores);
    const usuario = getRandomElement(mockUsuarios.filter(u => ['Owner', 'Administrador'].includes(u.cargo)));
    const caja = getRandomElement(mockCajas);

    const detalles = generateCompraDetalle(codigo, mockProductos);
    const total = detalles.reduce((sum, d) => sum + parseFloat(d.total), 0);
    const pagado = total;
    const cambio = 0;

    return {
        id,
        empresaId: EMPRESA_ID,
        codigo,
        fecha: formatDate(fecha),
        hora: formatTime(fecha),
        total: total.toFixed(2),
        pagado: pagado.toFixed(2),
        cambio: cambio.toFixed(2),
        usuarioId: usuario.id,
        proveedorId: proveedor.id,
        cajaId: caja.id,
        detalles,
        createdAt: formatDateTime(fecha),
        updatedAt: formatDateTime(fecha),
        deletedAt: null,
    };
}

export const mockCompras: Compra[] = Array.from({ length: 30 }, (_, i) => generateCompra(i + 1));

// Extract all compra detalles
export const mockCompraDetalles: CompraDetalle[] = mockCompras.flatMap(c => c.detalles);

// ============================================================================
// GASTOS
// ============================================================================

function generateGasto(id: number): Gasto {
    const razones = [
        'Pago de servicios',
        'Mantenimiento',
        'Publicidad',
        'Transporte',
        'Alquiler',
        'Salarios',
        'Suministros de oficina',
        'Reparaciones',
        'Limpieza',
        'Seguridad',
    ];

    return {
        id,
        empresaId: EMPRESA_ID,
        razon: getRandomElement(razones),
        monto: faker.number.float({ min: 50, max: 2000, fractionDigits: 2 }).toFixed(2),
        fondo: getRandomElement(['Efectivo', 'Transferencia', 'Tarjeta'] as const),
        cajaId: getRandomElement(mockCajas).id,
        createdAt: formatDateTime(getRandomDate(90)),
        updatedAt: formatDateTime(new Date()),
        deletedAt: null,
    };
}

export const mockGastos: Gasto[] = Array.from({ length: 20 }, (_, i) => generateGasto(i + 1));

// ============================================================================
// VENTAS PENDIENTES
// ============================================================================

function generateVentaPendiente(id: number): VentaPendiente {
    const fecha = getRandomDate(7); // Last 7 days
    const codigo = `VP-${formatDate(fecha).replace(/-/g, '')}-${String(id).padStart(4, '0')}`;
    const cliente = Math.random() > 0.3 ? getRandomElement(mockClientes) : null;
    const usuario = getRandomElement(mockUsuarios.filter(u => u.cargo !== 'Owner'));
    const caja = getRandomElement(mockCajas);

    const detalles = generateVentaDetalle(codigo, mockProductos);
    const total = detalles.reduce((sum, d) => sum + (typeof d.total === 'string' ? parseFloat(d.total) : d.total), 0);
    const pagado = faker.number.float({ min: 0, max: total, fractionDigits: 2 });
    const cambio = 0;

    return {
        id,
        usuarioId: usuario.id,
        empresaId: EMPRESA_ID,
        productos: detalles as any,
        detalles: detalles as any,
        clienteId: cliente?.id || null,
        clienteName: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente General',
        total: total.toFixed(2),
        nombreVendedor: `${usuario.nombre} ${usuario.apellido}`,
        estado: 'pendiente',
        fecha: formatDate(fecha),
        hora: formatTime(fecha),
        pagado: pagado.toFixed(2),
        cambio: cambio.toFixed(2),
        cajaId: caja.id,
        codigo,
        createdAt: formatDateTime(fecha),
        updatedAt: formatDateTime(fecha),
        deletedAt: null,
        cliente,
        usuario,
        caja,
    };
}

export const mockVentasPendientes: VentaPendiente[] = Array.from({ length: 15 }, (_, i) =>
    generateVentaPendiente(i + 1)
);

// ============================================================================
// HELPER FUNCTIONS FOR CRUD OPERATIONS
// ============================================================================

// In-memory storage for demo mode (simulates database)
let demoData = {
    empresa: mockEmpresa,
    usuarios: [...mockUsuarios],
    cajas: [...mockCajas],
    categorias: [...mockCategorias],
    productos: [...mockProductos],
    clientes: [...mockClientes],
    proveedores: [...mockProveedores],
    ventas: [...mockVentas],
    ventaDetalles: [...mockVentaDetalles],
    compras: [...mockCompras],
    compraDetalles: [...mockCompraDetalles],
    gastos: [...mockGastos],
    ventasPendientes: [...mockVentasPendientes],
};

// Reset all data to initial state
export function resetMockData(): void {
    demoData = {
        empresa: mockEmpresa,
        usuarios: [...mockUsuarios],
        cajas: [...mockCajas],
        categorias: [...mockCategorias],
        productos: [...mockProductos],
        clientes: [...mockClientes],
        proveedores: [...mockProveedores],
        ventas: [...mockVentas],
        ventaDetalles: [...mockVentaDetalles],
        compras: [...mockCompras],
        compraDetalles: [...mockCompraDetalles],
        gastos: [...mockGastos],
        ventasPendientes: [...mockVentasPendientes],
    };
}

// Get current demo data
export function getDemoData() {
    return demoData;
}

// Check if demo mode is active
export function isDemoMode(): boolean {
    return import.meta.env.VITE_DEMO_MODE === 'true';
}
