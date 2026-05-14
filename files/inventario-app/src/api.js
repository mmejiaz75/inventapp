// src/api.js - Servicio de comunicación con Google Sheets

const DEMO_DATA = {
  inventario: [
    { ID: 'P001', Producto: 'Laptop Dell XPS', 'Categoría': 'Electrónicos', Cantidad: 5, Unidad: 'unidades', 'Stock Mínimo': 2, Ubicación: 'Almacén A-1', 'Última Actualización': new Date().toISOString() },
    { ID: 'P002', Producto: 'Papel A4 (resma)', 'Categoría': 'Papelería', Cantidad: 40, Unidad: 'resmas', 'Stock Mínimo': 10, Ubicación: 'Almacén B-2', 'Última Actualización': new Date().toISOString() },
    { ID: 'P003', Producto: 'Bolígrafos Azul', 'Categoría': 'Papelería', Cantidad: 120, Unidad: 'piezas', 'Stock Mínimo': 30, Ubicación: 'Almacén B-2', 'Última Actualización': new Date().toISOString() },
    { ID: 'P004', Producto: 'Monitor 27"', 'Categoría': 'Electrónicos', Cantidad: 8, Unidad: 'unidades', 'Stock Mínimo': 2, Ubicación: 'Almacén A-2', 'Última Actualización': new Date().toISOString() },
    { ID: 'P005', Producto: 'Silla Ergonómica', 'Categoría': 'Mobiliario', Cantidad: 3, Unidad: 'unidades', 'Stock Mínimo': 3, Ubicación: 'Almacén C-1', 'Última Actualización': new Date().toISOString() },
    { ID: 'P006', Producto: 'Café molido 500g', 'Categoría': 'Consumibles', Cantidad: 2, Unidad: 'bolsas', 'Stock Mínimo': 4, Ubicación: 'Cocina', 'Última Actualización': new Date().toISOString() },
    { ID: 'P007', Producto: 'Tóner HP LaserJet', 'Categoría': 'Impresión', Cantidad: 6, Unidad: 'cartuchos', 'Stock Mínimo': 2, Ubicación: 'Almacén B-1', 'Última Actualización': new Date().toISOString() },
    { ID: 'P008', Producto: 'Audífonos USB', 'Categoría': 'Electrónicos', Cantidad: 10, Unidad: 'unidades', 'Stock Mínimo': 3, Ubicación: 'Almacén A-1', 'Última Actualización': new Date().toISOString() },
  ],
  movimientos: [
    { ID: 'M001', Fecha: new Date(Date.now() - 86400000).toISOString(), Tipo: 'ALTA', 'Producto ID': 'P002', Producto: 'Papel A4 (resma)', Cantidad: 20, Solicitante: 'Ana García', Motivo: 'Reposición mensual', Estado: 'Completado' },
    { ID: 'M002', Fecha: new Date(Date.now() - 43200000).toISOString(), Tipo: 'BAJA', 'Producto ID': 'P001', Producto: 'Laptop Dell XPS', Cantidad: 1, Solicitante: 'Carlos López', Motivo: 'Equipo para nuevo empleado', Estado: 'Completado' },
    { ID: 'M003', Fecha: new Date(Date.now() - 3600000).toISOString(), Tipo: 'BAJA', 'Producto ID': 'P003', Producto: 'Bolígrafos Azul', Cantidad: 10, Solicitante: 'María Rodríguez', Motivo: 'Material de oficina mensual', Estado: 'Completado' },
  ],
  equipo: [
    { ID: 'U001', Nombre: 'Ana García', Área: 'Diseño', Email: 'ana@empresa.com' },
    { ID: 'U002', Nombre: 'Carlos López', Área: 'Desarrollo', Email: 'carlos@empresa.com' },
    { ID: 'U003', Nombre: 'María Rodríguez', Área: 'Marketing', Email: 'maria@empresa.com' },
    { ID: 'U004', Nombre: 'Juan Martínez', Área: 'Ventas', Email: 'juan@empresa.com' },
    { ID: 'U005', Nombre: 'Laura Sánchez', Área: 'RRHH', Email: 'laura@empresa.com' },
  ]
};

// Estado local para modo demo
let localData = JSON.parse(JSON.stringify(DEMO_DATA));

class API {
  constructor() {
    this.baseUrl = window.CONFIG?.SHEETS_API_URL || '';
    this.demoMode = window.CONFIG?.DEMO_MODE ?? true;
  }

  async get(action, params = {}) {
    if (this.demoMode) return this._demoGet(action);
    
    const url = new URL(this.baseUrl);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    
    const res = await fetch(url.toString(), { method: 'GET' });
    return res.json();
  }

  async post(action, data) {
    if (this.demoMode) return this._demoPost(action, data);
    
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify({ action, data })
    });
    return res.json();
  }

  _demoGet(action) {
    switch (action) {
      case 'getInventario':  return [...localData.inventario];
      case 'getMovimientos': return [...localData.movimientos].reverse();
      case 'getEquipo':      return [...localData.equipo];
      case 'getStats': {
        const inv = localData.inventario;
        return {
          totalProductos: inv.length,
          stockBajo: inv.filter(p => Number(p.Cantidad) <= Number(p['Stock Mínimo'])).length,
          totalUnidades: inv.reduce((s, p) => s + Number(p.Cantidad), 0),
          movHoy: localData.movimientos.filter(m => {
            const d = new Date(m.Fecha);
            return d.toDateString() === new Date().toDateString();
          }).length
        };
      }
      default: return { error: 'Acción no reconocida' };
    }
  }

  _demoPost(action, data) {
    switch (action) {
      case 'addProducto': {
        const id = 'P' + String(localData.inventario.length + 1).padStart(3, '0');
        localData.inventario.push({
          ID: id,
          Producto: data.producto,
          'Categoría': data.categoria,
          Cantidad: Number(data.cantidad),
          Unidad: data.unidad,
          'Stock Mínimo': Number(data.stockMinimo),
          Ubicación: data.ubicacion,
          'Última Actualización': new Date().toISOString()
        });
        return { success: true, id };
      }
      case 'registrarAlta': {
        const prod = localData.inventario.find(p => p.ID === data.productoId);
        if (!prod) return { success: false, error: 'Producto no encontrado' };
        prod.Cantidad = Number(prod.Cantidad) + Number(data.cantidad);
        prod['Última Actualización'] = new Date().toISOString();
        const movId = 'M' + Date.now();
        localData.movimientos.unshift({
          ID: movId, Fecha: new Date().toISOString(), Tipo: 'ALTA',
          'Producto ID': data.productoId, Producto: prod.Producto,
          Cantidad: Number(data.cantidad), Solicitante: data.responsable,
          Motivo: data.motivo || 'Reposición', Estado: 'Completado'
        });
        return { success: true, movId };
      }
      case 'registrarBaja': {
        const prod = localData.inventario.find(p => p.ID === data.productoId);
        if (!prod) return { success: false, error: 'Producto no encontrado' };
        if (Number(prod.Cantidad) < Number(data.cantidad)) {
          return { success: false, error: `Stock insuficiente. Disponible: ${prod.Cantidad}` };
        }
        prod.Cantidad = Number(prod.Cantidad) - Number(data.cantidad);
        prod['Última Actualización'] = new Date().toISOString();
        const movId = 'M' + Date.now();
        localData.movimientos.unshift({
          ID: movId, Fecha: new Date().toISOString(), Tipo: 'BAJA',
          'Producto ID': data.productoId, Producto: prod.Producto,
          Cantidad: Number(data.cantidad), Solicitante: data.solicitante,
          Motivo: data.motivo, Estado: 'Completado'
        });
        return { success: true, movId };
      }
      case 'addMiembro': {
        const id = 'U' + String(localData.equipo.length + 1).padStart(3, '0');
        localData.equipo.push({ ID: id, Nombre: data.nombre, Área: data.area, Email: data.email });
        return { success: true, id };
      }
      default: return { error: 'Acción no reconocida' };
    }
  }
}

window.api = new API();
