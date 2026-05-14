# 📦 InventApp — Control de Inventario para Equipos

Sistema de control de inventario PWA con Google Sheets como base de datos. Optimizado para celular.

## 🚀 Demo en vivo

La app incluye un **modo demo** con datos de ejemplo. Para usar tus propios datos, conecta Google Sheets (ver paso 3).

---

## 📱 Características

- **Dashboard** con estadísticas en tiempo real
- **Altas**: registra nuevo stock o reposiciones
- **Bajas**: los miembros del equipo solicitan productos
- **Historial** completo de movimientos con filtros
- **Gestión de equipo**: agrega y administra miembros
- **PWA instalable** en Android e iOS (sin App Store)
- **Alertas de stock bajo** automáticas
- **Google Sheets** como base de datos (gratis)

---

## 🛠️ Instalación

### Paso 1: Clona el repositorio

```bash
git clone https://github.com/TU_USUARIO/inventapp.git
cd inventapp
```

### Paso 2: Configura Google Sheets (opcional pero recomendado)

1. Crea un nuevo **Google Sheets**
2. Ve a **Extensiones → Apps Script**
3. Borra el código existente y pega el contenido de `google-apps-script/Code.gs`
4. Guarda el archivo (Ctrl+S)
5. Ejecuta la función `initSheets()` una vez para crear las hojas con datos de ejemplo
6. Despliega como **Web App**:
   - Clic en **Desplegar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién puede acceder: **Cualquier persona**
   - Clic en **Implementar**
7. Copia la **URL del Web App**

### Paso 3: Conecta la app con tu Sheets

Edita `src/config.js` y reemplaza `'TU_URL_AQUI'` con la URL de tu Web App:

```javascript
SHEETS_API_URL: 'https://script.google.com/macros/s/TU_ID/exec',
```

### Paso 4: Publica en GitHub

```bash
git add .
git commit -m "🚀 Initial commit - InventApp"
git push origin main
```

### Paso 5: Despliega en Vercel

**Opción A — Via Vercel dashboard:**
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Clic en **"Add New Project"**
3. Selecciona tu repositorio `inventapp`
4. Clic en **Deploy** (no necesita configuración adicional)

**Opción B — Via Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```

### Paso 6: Instala la PWA en tu celular

**Android:**
1. Abre la app en Chrome
2. Menú (⋮) → **"Agregar a pantalla de inicio"**

**iOS:**
1. Abre la app en Safari
2. Botón compartir (□↑) → **"Agregar a pantalla de inicio"**

---

## 📂 Estructura del proyecto

```
inventapp/
├── index.html              # Landing page
├── app.html                # App principal (PWA)
├── vercel.json             # Configuración de Vercel
├── public/
│   ├── manifest.json       # Manifest PWA
│   ├── sw.js               # Service Worker
│   └── icons/              # Íconos de la app
├── src/
│   ├── config.js           # Configuración (URL de Sheets)
│   └── api.js              # Servicio de datos
└── google-apps-script/
    └── Code.gs             # Backend de Google Sheets
```

---

## 🔧 Personalización

### Cambiar nombre de la empresa

Edita `src/config.js`:
```javascript
APP_NAME: 'Mi Empresa - Inventario',
```

### Agregar categorías

```javascript
CATEGORIAS: [
  'Electrónicos',
  'Papelería',
  'Tu Nueva Categoría',  // ← agrega aquí
]
```

### Colores y tema

Los colores principales están en las variables CSS de `index.html` y `app.html`:
```css
:root {
  --indigo: #6366f1;   /* color primario */
  --emerald: #10b981;  /* color de éxito */
  --rose: #f43f5e;     /* color de alerta */
}
```

---

## 📊 Estructura de Google Sheets

La función `initSheets()` crea automáticamente tres hojas:

| Hoja | Columnas |
|------|----------|
| **Inventario** | ID, Producto, Categoría, Cantidad, Unidad, Stock Mínimo, Ubicación, Última Actualización |
| **Movimientos** | ID, Fecha, Tipo, Producto ID, Producto, Cantidad, Solicitante, Motivo, Estado |
| **Equipo** | ID, Nombre, Área, Email |

---

## 🔒 Seguridad

- La API de Google Sheets es pública pero de solo lectura excepto para las operaciones definidas
- Para un entorno de producción, considera agregar autenticación con Google Sign-In
- No se almacenan contraseñas ni datos sensibles

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

MIT — úsalo libremente en tus proyectos.

---

Hecho con ❤️ para equipos que se mueven rápido.
