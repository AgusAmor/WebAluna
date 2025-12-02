# 🌙 WebAluna - E-commerce de Lámparas 3D

> Single Page Application para venta de lámparas personalizadas con impresión 3D

![Estado](https://img.shields.io/badge/Estado-Producción-brightgreen?style=for-the-badge) ![Rama](https://img.shields.io/badge/Rama-v2--rewrite-green?style=for-the-badge) ![Última actualización](https://img.shields.io/badge/Última%20actualización-Diciembre%202025-blue?style=for-the-badge)

---

## 📋 Sobre el Proyecto

Plataforma de comercio electrónico que combina tecnología de impresión 3D con creatividad artesanal. Desarrollada como SPA moderna con React 19, ofrece una experiencia de compra fluida y optimizada.

**🎯 Objetivos:**

- Aumentar presencia digital del negocio
- Facilitar proceso de compra online
- Gestionar productos y usuarios eficientemente
- Arquitectura escalable y mantenible
- Seguridad de datos con Firebase Admin SDK

## ✨ Características Actuales

### 🔐 Autenticación y Autorización Avanzada

- **Firebase Authentication**: Email/Password y Google OAuth
- **Custom Claims**: Sistema de roles
- **Modal de Login/Registro**: UI con validación
- **Rutas Protegidas**: Componentes con redirección automática
- **Verificación de Tokens**: Backend con validación JWT segura
- **Persistencia de Sesión**: Auto-restauración de estado

### 👨‍💼 Panel de Administración

- Acceso restringido con verificación de roles
- Gestión de productos (CRUD)
- Gestión de usuarios (CRUD)
- Dashboard personalizado

### 🛒 Sistema de Carrito

- Botón flotante con contador dinámico en tiempo real
- Modal interactivo
- CRUD completo (agregar, eliminar, actualizar cantidad)
- Persistencia en localStorage
- Cálculo automático de totales y subtotales

### 📱 Navegación y UX Optimizada

- Header responsivo con animaciones de scroll
- Menú de usuario con dropdown
- Indicadores visuales de página activa
- Logo footer con scroll to top
- Lazy loading con React.lazy() y Suspense
- Transiciones CSS suaves

### 🎨 Diseño Moderno

- Paleta de colores personalizada (blue/gray/gold)
- Tipografía personalizada (Comfortaa + Sora)
- Tailwind CSS 4 con @theme inline
- Componentes reutilizables
- Responsive design
- Accesibilidad WCAG mejorada

### 🔧 Arquitectura Backend Escalable

- **Cloud Functions**: Firebase Functions con región optimizada (south-america-east1)
- **Utilidades Reutilizables**: Módulos de auth, validation y response handling
- **Manejo de Errores**: Error handling consistente en toda la API
- **CORS Configurado**: Middleware para seguridad cross-origin
- **Validación de Datos**: Validación centralizada en cada endpoint

## 🔮 Próximas Funcionalidades

- [x] Catálogo dinámico con filtros avanzados
- [x] Búsqueda de productos
- [ ] Pasarela de pago (Mercado Pago)
- [ ] Perfil de usuario con historial de compras
- [ ] Seguimiento de pedidos en tiempo real
- [ ] Notificaciones por email
- [ ] Analytics e informes de ventas
- [ ] Reviews y calificaciones de productos

## 🛠️ Stack Tecnológico

### Frontend

<table>

<tr>

<th>Tecnología</th>

<th>Versión</th>

<th>Propósito</th>

</tr>

<tr>

<td>React</td>

<td>19.1.1</td>

<td>Biblioteca UI</td>

</tr>

<tr>

<td>Vite</td>

<td>7.1.7</td>

<td>Build tool y dev server</td>

</tr>

<tr>

<td>Tailwind CSS</td>

<td>4.1.16</td>

<td>Styling utilities</td>

</tr>

<tr>

<td>React Router DOM</td>

<td>7.9.4</td>

<td>Routing y navegación</td>

</tr>

<tr>

<td>React Icons</td>

<td>4.10.1</td>

<td>Librería de iconos</td>

</tr>

<tr>

<td>PropTypes</td>

<td>15.8.1</td>

<td>Validación de props</td>

</tr>

<tr>

<td>Firebase</td>

<td>12.5.0</td>

<td>Authentication, Firestore, Storage</td>

</tr>

</table>

### Backend

<table>

<tr>

<th>Tecnología</th>

<th>Versión</th>

<th>Propósito</th>

</tr>

<tr>

<td>Firebase Functions</td>

<td>v2 HTTPS</td>

<td>Serverless compute</td>

</tr>

<tr>

<td>Firebase Admin SDK</td>

<td>13.5.0</td>

<td>Acceso privilegiado a servicios</td>

</tr>

<tr>

<td>Firestore</td>

<td>Latest</td>

<td>Base de datos NoSQL</td>

</tr>

<tr>

<td>Firebase Storage</td>

<td>Latest</td>

<td>Almacenamiento de archivos</td>

</tr>

</table>
### Herramientas de Desarrollo

<table>

<tr>

<th>Herramienta</th>

<th>Versión</th>

<th>Propósito</th>

</tr>

<tr>

<td>ESLint</td>

<td>9.36.0</td>

<td>Linting y code quality</td>

</tr>

<tr>

<td>PNPM</td>

<td>10.19.0</td>

<td>Package manager eficiente</td>

</tr>

<tr>

<td>gh-pages</td>

<td>6.3.0</td>

<td>Deployment a GitHub Pages</td>

</tr>

<tr>

<td>Node.js</td>

<td>18+</td>

<td>Runtime JavaScript</td>

</tr>

</table>

## 🔒 Seguridad

- **Firebase Security Rules**: Protección de datos en Firestore
- **JWT Tokens**: Validación de autenticación en backend
- **Admin SDK**: Acceso seguro a datos privilegiados
- **CORS Middleware**: Control de origen de solicitudes
- **Environment Variables**: Credenciales en archivos .env
- **Validación de Entrada**: Sanitización en cada endpoint

## 🏗️ Arquitectura

### Backend - Cloud Functions (Node.js)

```
backend/functions/
├── index.js              # Exporta todas las Cloud Functions
├── users.js              # Lógica CRUD de usuarios
├-─ products.js           # Lógica CRUD de productos
├── config/
│   ├── firebaseAdmin.js  # Inicialización Firebase Admin SDK
│   └── serviceAccountKey.json
├── middlewares/
│   └── corsMiddleware.js # Manejo CORS
└── utils/
    ├── authUtils.js      # Verificación de tokens y roles
    ├── validation.js     # Validación de datos
    └── responseHandler.js # Manejo consistente de respuestas
```

**Flujo de Datos:**

```
Cliente (React)
    ↓ HTTP Request
API Client (Centralizado)
    ↓ apiClient.js
Cloud Function (index.js)
    ↓ Routing
Controlador (users.js / products.js)
    ↓ Utilidades
authUtils.js → Valida JWT
validation.js → Valida datos
responseHandler.js → Formatea respuesta
    ↓
Firestore / Storage
    ↓
Response Handler
    ↓
Cliente recibe JSON
```

### Frontend - React + Vite

```
src/
├── components/
│   ├── common/                       # Componentes reutilizables
│   │   ├── FloatingCartButton.jsx
│   │   ├── Hero.jsx
│   │   ├── LoginModal.jsx
│   │   └── ProtectedRoute.jsx
│   ├── ecommerce/                    # Componentes de e-commerce
│   │   └── CartModal.jsx
│   ├── ui/                           # Componentes de UI
│   │   ├── ProductCard.jsx
│   │   ├── GoogleLoginButton.jsx
│   │   └── ProductDetailModal.jsx
│   └── layout/                       # Layout del sitio
│       ├── Header.jsx
│       └── Footer.jsx
├── context/                          # Context API
│   ├── AuthContext.jsx               # Estado de autenticación global
│   └── CartContext.jsx               # Estado del carrito global
├── hooks/                            # Custom Hooks
│   ├── useAutoLogout.js              # Auto-logout por inactividad
│   ├── useAdmin.js                   # Verificación de permisos admin
│   └── useFormValidation.js          # Validación de formularios
├── services/                         # Servicios API
│   ├── apiClient.js                  # Cliente API centralizado
│   ├── firebase.js                   # Configuración Firebase
│   ├── firebaseAuthService.js
│   ├── firebaseProductService.js
│   ├── firebaseUserService.js
│   └── cartStorageService.js
├── pages/                            # Páginas/Vistas
│   ├── Home/
│   ├── Products/
│   ├── Admin/
│   ├── Profile/
│   └── etc.
├── router/
│   └── AppRouter.jsx                 # Rutas con lazy loading
├── constants/
│   └── config.js                     # Constantes globales
└── index.css                         # Estilos globales
```

**State Management:**

- **AuthContext**: Usuario autenticado, token, custom claims
- **CartContext**: Items del carrito, totales
- **Props**: Paso de datos en componentes
- **localStorage**: Persistencia del carrito

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js**: 18+ (recomendado 20+)
- **PNPM**: 10.19.0+
- **Cuenta Firebase**: Con proyecto configurado
- **Git**: Para clonar el repositorio

### Pasos de Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/AgusAmor/WebAluna.git
cd WebAluna


# 2. Instalar dependencias (frontend + backend)
pnpm install


# 3. Configurar variables de entorno
cp .env.example .env


# 4. Editar .env con tus credenciales de Firebase
nano .env

# Reemplazar:
# VITE_FIREBASE_API_KEY=xxx
# VITE_FIREBASE_AUTH_DOMAIN=xxx
# VITE_FIREBASE_PROJECT_ID=xxx
# etc.


# 5. Iniciar servidor de desarrollo
pnpm dev
```

### Configuración de Firebase

#### En Firebase Console:

1. **Crear Proyecto**
      - Ve a [Firebase Console](https://console.firebase.google.com)
      - Click en "Nuevo Proyecto"
      - Nombre: WebAluna
      - Región: Sudamérica

2. **Habilitar Authentication**
      - Ir a Authentication → Métodos de inicio de sesión
      - Habilitar Email/Password
      - Habilitar Google OAuth

3. **Crear Firestore**
      - Ir a Firestore Database
      - Crear base de datos en modo "Producción"
      - Región: southamerica-east1
      - Configurar Security Rules:

`
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth.uid == userId || isAdmin();
         allow write: if request.auth.uid == userId || isAdmin();
       }
       match /products/{document=**} {
         allow read: if true;
         allow write: if isAdmin();
       }
     }
   }
   function isAdmin() {
     return request.auth.token.admin == true;
   }
   `

4. **Configurar Storage**
      - Ir a Storage
      - Crear bucket
      - Configurar rules de acceso

5. **Descargar Credenciales**
      - Project Settings → Service Accounts
      - Click "Generate new private key"
      - Guardar en `backend/functions/config/serviceAccountKey.json`

#### Configurar Admin CLI:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inicializar proyecto
firebase init functions

# Seleccionar tu proyecto
# Elegir JavaScript
```

### Deploy de Cloud Functions

```bash
# Desde la raíz del proyecto
firebase deploy --only functions

# O solo la región específica
cd backend/functions
firebase deploy
```

## 📋 Comandos Disponibles

### Frontend

```bash
# Desarrollo con hot reload
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview

# Linting del código
pnpm lint

# Deploy a GitHub Pages
pnpm deploy
```

### Backend (Cloud Functions)

```bash
# Deploy a Firebase
firebase deploy --only functions

# Deploy específico
firebase deploy --only functions:createUserDoc

# Ver logs en tiempo real
firebase functions:log

# Emular localmente
firebase emulators:start --only functions
```

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Azules */
--blue-1: #264e60  /* Oscuro */
--blue-2: #427385  /* Principal */
--blue-3: #81a5ae  /* Claro */

/* Grises */
--gray-1: #a9b2b9  /* Oscuro */
--gray-2: #c3c9ce  /* Medio */
--gray-3: #d9dce0  /* Secundario */

/* Otros */
--black: #2b2b2b
--white: #f4f4f4
--gold:  #b6a269 /* Acentuaciones */
```

### Tipografía

<table>

<tr>

<th>Fuente</th>

<th>Pesos</th>

<th>Uso</th>

</tr>

<tr>

<td><strong>Comfortaa</strong></td>

<td>300, 400, 700</td>

<td>Títulos, navegación, headings</td>

</tr>

<tr>

<td><strong>Sora</strong></td>

<td>100-800</td>

<td>Cuerpo de texto, párrafos</td>

</tr>

</table>

### Componentes

Todos los componentes usan:

- **Tailwind CSS 4**: Utility-first CSS
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Soporta preferencias del sistema
- **Accesible**: Cumple WCAG 2.1 Level AA

## 📊 Estado del Proyecto

### ✅ Completado (Producción)

<table>

<tr>

<th>Fase</th>

<th>Descripción</th>

<th>Estado</th>

</tr>

<tr>

<td><strong>Fase 1</strong></td>

<td>MVP: UI, routing, SEO</td>

<td>✅ Completado</td>

</tr>

<tr>

<td><strong>Fase 2</strong></td>

<td>Autenticación Firebase</td>

<td>✅ Completado</td>

</tr>

<tr>

<td><strong>Fase 3</strong></td>

<td>Panel Admin, CRUD</td>

<td>✅ Completado</td>

</tr>

<tr>

<td><strong>Refactoring v2</strong></td>

<td>Optimización código</td>

<td>✅ Completado</td>

</tr>

</table>

### 🔄 En Desarrollo

<table>

<tr>

<th>Feature</th>

<th>Prioridad</th>

<th>ETA</th>

</tr>

<tr>

<td>Pasarela de pago</td>

<td>Alta</td>

<td>Q2 2026</td>

</tr>

<tr>

<td>Notificaciones</td>

<td>Media</td>

<td>Q2 2026</td>

</tr>

<tr>

<td>Analytics</td>

<td>Media</td>

<td>Q2 2026</td>

</tr>

</table>

## 🔗 Enlaces Útiles

<table>

<tr>

<th>Recurso</th>

<th>URL</th>

</tr>

<tr>

<td><strong>Demo</strong></td>

<td><a href="https://agusamor.github.io/WebAluna/">https://agusamor.github.io/WebAluna/</a></td>

</tr>

<tr>

<td><strong>Repositorio</strong></td>

<td><a href="https://github.com/AgusAmor/WebAluna">GitHub - WebAluna</a></td>

</tr>

<tr>

<td><strong>Firebase Docs</strong></td>

<td><a href="https://firebase.google.com/docs">https://firebase.google.com/docs</a></td>

</tr>

<tr>

<td><strong>React Docs</strong></td>

<td><a href="https://react.dev">https://react.dev</a></td>

</tr>

<tr>

<td><strong>Tailwind CSS</strong></td>

<td><a href="https://tailwindcss.com">https://tailwindcss.com</a></td>

</tr>

</table>

## 📄 Licencia

**Licencia Propietaria** © 2025 - Todos los derechos reservados

Este proyecto es privado y protegido. No está permitido:

- ❌ Copiar o clonar sin autorización
- ❌ Usar código en otros proyectos
- ❌ Modificar y redistribuir
- ❌ Uso comercial sin consentimiento

**Contacto para autorizaciones**: Crear issue en GitHub

---

**💡 Última actualización**: Diciembre 2025  
**👤 Propietario**: [AgusAmor](https://github.com/AgusAmor)  
**📧 Soporte**: Issues en GitHub
