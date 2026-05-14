// src/config.js
// ⚠️ IMPORTANTE: Reemplaza esta URL con la URL de tu Google Apps Script desplegado
// Instrucciones: ver google-apps-script/Code.gs

const CONFIG = {
  // Pega aquí la URL de tu Web App de Google Apps Script
  // Ejemplo: 'https://script.google.com/macros/s/AKfycb.../exec'
  SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbxo5JlA7IKf5Ea3r5TD1zixAWB76Xmc090zn24AhUOkDdDnzhpmvgWiLbMmb7R9NtGUoQ/exec',

  APP_NAME: 'InventApp',
  VERSION: '1.0.0',

  CATEGORIAS: [
    'Electrónicos',
    'Papelería',
    'Mobiliario',
    'Consumibles',
    'Impresión',
    'Limpieza',
    'Herramientas',
    'Otros'
  ],

  UNIDADES: [
    'unidades',
    'piezas',
    'cajas',
    'resmas',
    'bolsas',
    'cartuchos',
    'litros',
    'kilogramos',
    'metros',
    'pares'
  ]
};

// Modo demo: usa datos locales si no hay URL configurada
CONFIG.DEMO_MODE = CONFIG.SHEETS_API_URL === 'TU_URL_AQUI';
