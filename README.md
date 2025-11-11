# 🌙 Aluna - E-commerce de Lámparas 3D

> Single Page Application para venta de lámparas personalizadas con impresión 3D

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-blue?style=for-the-badge) ![Rama](https://img.shields.io/badge/Rama-v2--rewrite-green?style=for-the-badge) ![Última actualización](https://img.shields.io/badge/Última%20actualización-Noviembre%202025-lightgrey?style=for-the-badge)

---

## 📋 Sobre el Proyecto

Plataforma de comercio electrónico que combina tecnología de impresión 3D con creatividad artesanal. Desarrollada como SPA moderna con React 19, ofrece una experiencia de compra fluida y optimizada.

**🎯 Objetivos:**

- Aumentar presencia digital del emprendimiento
- Facilitar el proceso de compra online
- Gestionar productos y usuarios eficientemente

## ✨ Características Actuales

### Sistema de Autenticación

- Firebase Authentication con email/password y Google OAuth
- Modal de Login/Registro
- Custom Claims para roles (admin/user)
- Rutas protegidas con redirección automática
- Persistencia de sesión

### Panel de Administración

- Acceso restringido con verificación de roles
- Sistema de permisos escalable
- Hero personalizado

### Sistema de Carrito

- Botón flotante con contador dinámico
- Modal interactivo con backdrop blur
- CRUD completo con persistencia en localStorage
- Cálculo de totales en tiempo real

### Navegación y UX

- Header responsivo con animaciones de scroll
- Menú de usuario con dropdown
- Indicadores visuales de página activa
- Logo footer con scroll to top
- Lazy loading con React.lazy() y Suspense

### Diseño y Arquitectura

- **Paleta**: blue-1/2/3, gray-1/2/3, black, white, gold
- **Tipografías**: Comfortaa (títulos) y Sora (cuerpo)
- **Tailwind CSS 4** con @theme inline
- Context API para estado global (carrito y autenticación)
- PropTypes para validación
- SEO optimizado

## 🔮 Próximas Funcionalidades

- Catálogo dinámico con filtros
- Gestión de productos desde admin
- Pasarela de pago
- Seguimiento de pedidos
- Perfil de usuario

## 🛠️ Stack Tecnológico

**Frontend:**

- React 19.1.1 + Vite 7.1.7
- Tailwind CSS 4.1.16
- React Router Dom 7.9.4
- React Icons 4.10.1
- PropTypes 15.8.1

**Backend:**

- Firebase 12.5.0 (Authentication, Firestore, Storage, Custom Claims)
- Firebase Admin SDK 13.5.0

**Desarrollo:**

- ESLint 9.36.0
- PNPM 10.19.0
- gh-pages 6.3.0

## Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PNPM
- Cuenta de Firebase

### Instalación

```bash
# Clonar e instalar
git clone https://github.com/AgusAmor/WebAluna.git
cd WebAluna
pnpm install

# Configurar Firebase
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar desarrollo
pnpm dev
```

### Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Authentication (Email/Password y Google)
3. Crea una base de datos Firestore
4. Copia las credenciales al archivo `.env`

### Comandos

```bash
pnpm dev          # Desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build
pnpm deploy       # Deploy a GitHub Pages
pnpm lint         # Linter
```

## 📁 Estructura del Proyecto

```
WebAluna/
├── src/
│   ├── assets/              # Fuentes (Comfortaa, Sora) y logos
│   ├── components/          # Componentes React
│   │   ├── common/         # FloatingCartButton, Hero, LoginModal, ProtectedRoute
│   │   ├── ecommerce/      # CartModal
│   │   ├── ui/             # ProductCard, GoogleLoginButton
│   │   └── layout/         # Header, Footer
│   ├── context/            # CartContext, AuthContext (Context API)
│   ├── pages/              # Home, Products, Admin, Profile
│   ├── router/             # AppRouter con lazy loading
│   ├── services/           # firebaseAuthService, firebaseProductsService, cartStorageService
│   ├── constants/          # config.js
│   └── index.css           # Estilos globales + @theme inline
├── public/                 # Archivos estáticos (robots.txt, sitemap.xml)
├── set-admin.cjs           # Script para configurar administradores
└── index.html              # HTML con meta tags SEO
```

## 🎨 Sistema de Diseño

**Paleta de Colores:**

```css
blue-1: #264e60  blue-2: #427385  blue-3: #81a5ae
gray-1: #a9b2b9  gray-2: #c3c9ce  gray-3: #d9dce0
black:  #2b2b2b  white:  #f4f4f4  gold:   #b6a269
```

**Tipografía:**

- Comfortaa (300-700): Títulos y navegación
- Sora (100-800): Cuerpo de texto

## 📊 Estado del Proyecto

**✅ Fase 1 - MVP (Completado)**

- Sistema de carrito, navegación responsiva, diseño de marca, lazy loading, SEO

**✅ Fase 2 - Autenticación (Completado)**

- Firebase Auth, login modal, Google OAuth, roles con Custom Claims, panel admin

**🔄 Fase 3 - E-commerce (En desarrollo)**

- Catálogo dinámico, gestión de productos, pasarela de pago

**📋 Fase 4 - Optimizaciones (Planificado)**

- PWA, testing automatizado, analytics

## 🔗 Enlaces

- **Demo**: [https://agusamor.github.io/WebAluna/](https://agusamor.github.io/WebAluna/)
- **Repositorio**: [GitHub - WebAluna](https://github.com/AgusAmor/WebAluna)

## 📄 Licencia

**Licencia Propietaria** - Todos los derechos reservados © 2025

Este proyecto es privado. No está permitido el uso, copia, modificación o distribución sin autorización expresa del propietario.

---

**📧 Contacto**: Crear issue en GitHub para consultas
