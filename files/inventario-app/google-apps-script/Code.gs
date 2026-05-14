// =====================================================
// INVENTARIO APP - Google Apps Script Backend
// =====================================================
// Instrucciones de instalación:
// 1. Abre Google Sheets → Extensiones → Apps Script
// 2. Pega este código y guarda
// 3. Ejecuta initSheets() UNA VEZ para crear las hojas
// 4. Despliega como Web App:
//    - Ejecutar como: Yo
//    - Quién puede acceder: Cualquier persona
// 5. Copia la URL del Web App → pégala en src/config.js
// =====================================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// Inicializar hojas de cálculo (ejecutar solo una vez)
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Hoja: Inventario
  let inv = ss.getSheetByName('Inventario');
  if (!inv) inv = ss.insertSheet('Inventario');
  inv.getRange(1, 1, 1, 8).setValues([[
    'ID', 'Producto', 'Categoría', 'Cantidad', 'Unidad', 'Stock Mínimo', 'Ubicación', 'Última Actualización'
  ]]);
  inv.getRange(1, 1, 1, 8).setFontWeight('bold');
  inv.setFrozenRows(1);

  // Hoja: Movimientos
  let mov = ss.getSheetByName('Movimientos');
  if (!mov) mov = ss.insertSheet('Movimientos');
  mov.getRange(1, 1, 1, 9).setValues([[
    'ID', 'Fecha', 'Tipo', 'Producto ID', 'Producto', 'Cantidad', 'Solicitante', 'Motivo', 'Estado'
  ]]);
  mov.getRange(1, 1, 1, 9).setFontWeight('bold');
  mov.setFrozenRows(1);

  // Hoja: Equipo
  let eq = ss.getSheetByName('Equipo');
  if (!eq) eq = ss.insertSheet('Equipo');
  eq.getRange(1, 1, 1, 4).setValues([['ID', 'Nombre', 'Área', 'Email']]);
  eq.getRange(1, 1, 1, 4).setFontWeight('bold');
  eq.setFrozenRows(1);
  
  // Datos de ejemplo
  const productos = [
    ['P001', 'Laptop Dell XPS', 'Electrónicos', 5, 'unidades', 2, 'Almacén A-1', new Date().toISOString()],
    ['P002', 'Papel A4 (resma)', 'Papelería', 40, 'resmas', 10, 'Almacén B-2', new Date().toISOString()],
    ['P003', 'Bolígrafos Azul', 'Papelería', 120, 'piezas', 30, 'Almacén B-2', new Date().toISOString()],
    ['P004', 'Monitor 27"', 'Electrónicos', 8, 'unidades', 2, 'Almacén A-2', new Date().toISOString()],
    ['P005', 'Silla Ergonómica', 'Mobiliario', 15, 'unidades', 3, 'Almacén C-1', new Date().toISOString()],
    ['P006', 'Café molido 500g', 'Consumibles', 12, 'bolsas', 4, 'Cocina', new Date().toISOString()],
    ['P007', 'Tóner HP LaserJet', 'Impresión', 6, 'cartuchos', 2, 'Almacén B-1', new Date().toISOString()],
    ['P008', 'Audífonos USB', 'Electrónicos', 10, 'unidades', 3, 'Almacén A-1', new Date().toISOString()],
  ];
  inv.getRange(2, 1, productos.length, 8).setValues(productos);

  const miembros = [
    ['U001', 'Ana García', 'Diseño', 'ana@empresa.com'],
    ['U002', 'Carlos López', 'Desarrollo', 'carlos@empresa.com'],
    ['U003', 'María Rodríguez', 'Marketing', 'maria@empresa.com'],
    ['U004', 'Juan Martínez', 'Ventas', 'juan@empresa.com'],
    ['U005', 'Laura Sánchez', 'RRHH', 'laura@empresa.com'],
  ];
  eq.getRange(2, 1, miembros.length, 4).setValues(miembros);
  
  Logger.log('✅ Hojas inicializadas correctamente');
}

// =====================================================
// Router principal
// =====================================================
function doGet(e) {
  const action = e.parameter.action;
  let result;
  
  try {
    switch(action) {
      case 'getInventario':    result = getInventario(); break;
      case 'getMovimientos':   result = getMovimientos(); break;
      case 'getEquipo':        result = getEquipo(); break;
      case 'getStats':         result = getStats(); break;
      default: result = { error: 'Acción no reconocida' };
    }
  } catch(err) {
    result = { error: err.toString() };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body, action, result;
  
  try {
    body = JSON.parse(e.postData.contents);
    action = body.action;
    
    switch(action) {
      case 'addProducto':      result = addProducto(body.data); break;
      case 'updateProducto':   result = updateProducto(body.data); break;
      case 'registrarAlta':    result = registrarAlta(body.data); break;
      case 'registrarBaja':    result = registrarBaja(body.data); break;
      case 'addMiembro':       result = addMiembro(body.data); break;
      default: result = { error: 'Acción no reconocida' };
    }
  } catch(err) {
    result = { error: err.toString() };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================
// Funciones de lectura
// =====================================================
function getInventario() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Inventario');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).filter(r => r[0]).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getMovimientos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Movimientos');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).filter(r => r[0]).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i] instanceof Date ? row[i].toISOString() : row[i]);
    return obj;
  }).reverse();
}

function getEquipo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Equipo');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).filter(r => r[0]).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getStats() {
  const inv = getInventario();
  const mov = getMovimientos();
  
  const totalProductos = inv.length;
  const stockBajo = inv.filter(p => Number(p['Cantidad']) <= Number(p['Stock Mínimo'])).length;
  const totalUnidades = inv.reduce((s, p) => s + Number(p['Cantidad']), 0);
  const movHoy = mov.filter(m => {
    const d = new Date(m['Fecha']);
    const hoy = new Date();
    return d.toDateString() === hoy.toDateString();
  }).length;
  
  return { totalProductos, stockBajo, totalUnidades, movHoy };
}

// =====================================================
// Funciones de escritura
// =====================================================
function addProducto(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Inventario');
  const id = 'P' + String(sheet.getLastRow()).padStart(3, '0');
  
  sheet.appendRow([
    id,
    data.producto,
    data.categoria,
    Number(data.cantidad),
    data.unidad,
    Number(data.stockMinimo),
    data.ubicacion,
    new Date().toISOString()
  ]);
  
  return { success: true, id };
}

function registrarAlta(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invSheet = ss.getSheetByName('Inventario');
  const movSheet = ss.getSheetByName('Movimientos');
  
  // Actualizar cantidad en inventario
  const invData = invSheet.getDataRange().getValues();
  let productoNombre = '';
  
  for (let i = 1; i < invData.length; i++) {
    if (invData[i][0] === data.productoId) {
      const nuevaCantidad = Number(invData[i][3]) + Number(data.cantidad);
      invSheet.getRange(i + 1, 4).setValue(nuevaCantidad);
      invSheet.getRange(i + 1, 8).setValue(new Date().toISOString());
      productoNombre = invData[i][1];
      break;
    }
  }
  
  // Registrar movimiento
  const movId = 'M' + Date.now();
  movSheet.appendRow([
    movId,
    new Date(),
    'ALTA',
    data.productoId,
    productoNombre,
    Number(data.cantidad),
    data.responsable,
    data.motivo || 'Reposición de stock',
    'Completado'
  ]);
  
  return { success: true, movId };
}

function registrarBaja(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invSheet = ss.getSheetByName('Inventario');
  const movSheet = ss.getSheetByName('Movimientos');
  
  const invData = invSheet.getDataRange().getValues();
  let productoNombre = '';
  let stockActual = 0;
  
  for (let i = 1; i < invData.length; i++) {
    if (invData[i][0] === data.productoId) {
      stockActual = Number(invData[i][3]);
      productoNombre = invData[i][1];
      
      if (stockActual < Number(data.cantidad)) {
        return { success: false, error: `Stock insuficiente. Disponible: ${stockActual}` };
      }
      
      invSheet.getRange(i + 1, 4).setValue(stockActual - Number(data.cantidad));
      invSheet.getRange(i + 1, 8).setValue(new Date().toISOString());
      break;
    }
  }
  
  const movId = 'M' + Date.now();
  movSheet.appendRow([
    movId,
    new Date(),
    'BAJA',
    data.productoId,
    productoNombre,
    Number(data.cantidad),
    data.solicitante,
    data.motivo,
    'Completado'
  ]);
  
  return { success: true, movId };
}

function addMiembro(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Equipo');
  const id = 'U' + String(sheet.getLastRow()).padStart(3, '0');
  
  sheet.appendRow([id, data.nombre, data.area, data.email]);
  return { success: true, id };
}

function updateProducto(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Inventario');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      if (data.producto) sheet.getRange(i + 1, 2).setValue(data.producto);
      if (data.categoria) sheet.getRange(i + 1, 3).setValue(data.categoria);
      if (data.cantidad !== undefined) sheet.getRange(i + 1, 4).setValue(Number(data.cantidad));
      if (data.unidad) sheet.getRange(i + 1, 5).setValue(data.unidad);
      if (data.stockMinimo) sheet.getRange(i + 1, 6).setValue(Number(data.stockMinimo));
      if (data.ubicacion) sheet.getRange(i + 1, 7).setValue(data.ubicacion);
      sheet.getRange(i + 1, 8).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  
  return { success: false, error: 'Producto no encontrado' };
}
