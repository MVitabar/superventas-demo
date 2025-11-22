# Modo Demo - SuperVentas

## ¿Qué es el Modo Demo?

El Modo Demo es una funcionalidad que permite explorar y probar SuperVentas con datos de prueba pre-generados, sin necesidad de conectarse a un servidor backend real.

## Activar/Desactivar el Modo Demo

### Activar Modo Demo

1. Edita el archivo `.env.development` en la raíz del proyecto
2. Asegúrate que contenga:
   ```
   VITE_DEMO_MODE=true
   VITE_API_URL=http://localhost:3000
   ```
3. Reinicia el servidor de desarrollo:
   ```bash
   bun run dev
   ```

### Desactivar Modo Demo

1. Edita el archivo `.env.development`
2. Cambia a:
   ```
   VITE_DEMO_MODE=false
   VITE_API_URL=http://localhost:3000
   ```
3. Reinicia el servidor de desarrollo

## Credenciales de Acceso

Cuando el modo demo está activo, puedes iniciar sesión con cualquiera de estas credenciales:

### Owner (Propietario)
- **Usuario**: `owner`
- **Email**: `owner@superventas.com`
- **Contraseña**: `demo123`
- **Permisos**: Acceso total al sistema

### Administrador
- **Usuario**: `admin`
- **Email**: `admin@superventas.com`
- **Contraseña**: `demo123`
- **Permisos**: Gestión completa de la empresa

### Cajero
- **Usuario**: `cajero`
- **Email**: `cajero@superventas.com`
- **Contraseña**: `demo123`
- **Permisos**: Operaciones de caja y ventas

### Vendedor
- **Usuario**: `vendedor`
- **Email**: `vendedor@superventas.com`
- **Contraseña**: `demo123`
- **Permisos**: Solo ventas

## Datos Disponibles

El modo demo incluye los siguientes datos de prueba:

- **1 Empresa**: SuperVentas Demo
- **4 Usuarios**: Owner, Administrador, Cajero, Vendedor
- **2 Cajas**: Caja Principal y Caja Secundaria
- **8 Categorías**: Electrónica, Ropa, Alimentos, Bebidas, Hogar, Deportes, Juguetes, Libros
- **50 Productos**: Variedad de productos en diferentes categorías
- **20 Clientes**: Con datos completos de Guatemala
- **10 Proveedores**: Empresas proveedoras
- **100 Ventas**: Distribuidas en los últimos 6 meses
- **30 Compras**: De los últimos 3 meses
- **20 Gastos**: Gastos variados
- **15 Ventas Pendientes**: De la última semana

## Funcionalidades del Modo Demo

### Banner de Demo
El componente `DemoBanner` está disponible en `src/components/layout/DemoBanner.tsx` pero no se muestra por defecto en el layout principal. Puede activarse descomentándolo en `Layout.tsx`.

### Resetear Datos
Para resetear los datos (ya que el banner está oculto), se puede recargar la página (F5), lo cual reiniciará el estado en memoria.

### Operaciones CRUD
Todas las operaciones funcionan normalmente:
- ✅ Crear nuevos registros
- ✅ Leer/Ver registros existentes
- ✅ Actualizar registros
- ✅ Eliminar registros (soft delete)

**Nota**: Los cambios se mantienen en memoria durante la sesión actual. Al recargar la página, los datos vuelven a su estado inicial.

## Limitaciones del Modo Demo

1. **Persistencia**: Los datos NO se guardan en una base de datos real. Al recargar la página, los cambios se pierden.

2. **Sin Backend**: No hay conexión a un servidor real. Todas las operaciones se simulan en el frontend.

3. **Autenticación Simulada**: El login es simulado. Cualquier combinación de las credenciales demo funcionará.

4. **Imágenes**: Las imágenes de productos y usuarios se generan localmente (SVG) para funcionar sin internet.

5. **Reportes**: Los reportes se generan con los datos mock, pero no se envían a ningún servidor.

## Datos Específicos de Guatemala

Los datos de prueba están configurados para Guatemala:

- **Moneda**: Quetzal (GTQ)
- **Formato de Fecha**: es-GT
- **Departamentos**: Todos los 22 departamentos de Guatemala
- **Municipios**: Principales municipios de cada departamento
- **Teléfonos**: Formato guatemalteco (+502)
- **Documentos**: DPI y NIT con formato correcto

## Desarrollo y Testing

El modo demo es ideal para:

- **Desarrollo**: Trabajar en nuevas funcionalidades sin backend
- **Testing**: Probar flujos completos de la aplicación
- **Demos**: Mostrar la aplicación a clientes o stakeholders
- **Capacitación**: Entrenar usuarios sin afectar datos reales
- **UI/UX**: Diseñar y probar interfaces con datos realistas

## Troubleshooting

### El banner de demo no aparece
- Verifica que `VITE_DEMO_MODE=true` en `.env.development`
- Reinicia el servidor de desarrollo
- Limpia la caché del navegador

### Los datos no se cargan
- Abre la consola del navegador (F12)
- Busca errores relacionados con `mockDataService`
- Verifica que `@faker-js/faker` esté instalado

### El login no funciona
- Usa exactamente las credenciales listadas arriba
- Verifica que el modo demo esté activo
- Revisa la consola por errores

### Los cambios no se guardan
- Esto es normal en modo demo
- Los datos se resetean al recargar
- Usa el botón "Resetear Datos" para volver al estado inicial

## Soporte

Para problemas o preguntas sobre el modo demo:
1. Revisa este documento
2. Consulta los logs de la consola del navegador
3. Revisa el código en `src/services/mockDataService.ts`

---

**Última actualización**: Noviembre 2025
