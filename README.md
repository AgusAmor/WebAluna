# 🌙 Aluna - E-commerce de Lámparas 3D

> Single Page Application para venta de lámparas personalizadas con impresión 3D

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-blue?style=for-the-badge)
![Rama](https://img.shields.io/badge/Rama-v2--rewrite-green?style=for-the-badge)
![Última actualización](https://img.shields.io/badge/Última%20actualización-Noviembre%202025-lightgrey?style=for-the-badge)

---

## 📋 Sobre el Proyecto

Plataforma de comercio electrónico que combina tecnología de impresión 3D con creatividad artesanal. Desarrollada como SPA moderna con React 19, ofrece una experiencia de compra fluida y optimizada.

**🎯 Objetivos:**

- Aumentar presencia digital del emprendimiento
- Facilitar el proceso de compra online
- Gestionar productos y usuarios eficientemente

## ✨ Características Actuales

### Sistema de Carrito

- Botón flotante con contador dinámico e icono
- Modal interactivo con backdrop blur semi-transparente
- CRUD completo (agregar, actualizar, eliminar productos)
- Persistencia en localStorage
- Cálculo de totales en tiempo real

### Navegación y UX

- Header responsivo con animaciones de scroll
- Indicadores visuales de ruta activa
- Menú hamburguesa animado para móviles
- Lazy loading de páginas con React.lazy() y Suspense
- Footer con información de contacto

### Diseño

- **Paleta personalizada**: azul-1/2/3, gris-1/2/3, negro, blanco, dorado
- **Tipografías**: Comfortaa (títulos) y Sora (cuerpo)
- **Tailwind CSS 4** con @theme inline
- **Estilos modulares por componente**

### Arquitectura

- Context API para gestión de estado del carrito
- Hooks personalizados (useCart)
- PropTypes para validación de componentes
- SEO optimizado
- Mejores prácticas de React 19 aplicadas

## 🔮 Próximas Funcionalidades

- Sistema de autenticación completo
- Catálogo dinámico con filtros y búsqueda
- Pasarela de pago integrada
- Panel administrativo para gestión de productos
- Sistema de seguimiento de pedidos

## 🛠️ Stack Tecnológico

**Frontend:**

- React 19.1.1 + Vite 7.1.7
- Tailwind CSS 4.1.16 (con @theme inline)
- React Router Dom 7.9.4 (con lazy loading)
- React Icons 4.10.1
- PropTypes 15.8.1

**Desarrollo:**

- ESLint 9.36.0
- PNPM 10.19.0
- gh-pages 6.3.0 (deployment)

**Arquitectura:**

- SPA con Context API
- Code splitting (React.lazy + Suspense)
- CSS Modules y responsive design
- SEO optimizado

## Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PNPM

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/AgusAmor/WebAluna.git
cd WebAluna

# Instalar dependencias
pnpm install

# Iniciar desarrollo
pnpm dev
# Abrir http://localhost:5173
```

### Comandos Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build
pnpm deploy       # Desplegar a GitHub Pages
pnpm lint         # Linter ESLint
```

## 📁 Estructura del Proyecto

```
WebAluna/
├── src/
│   ├── assets/              # Fuentes (Comfortaa, Sora) y logos
│   ├── components/          # Componentes React
│   │   ├── common/         # FloatingCartButton
│   │   ├── ecommerce/      # CartModal
│   │   └── layout/         # Header, Footer
│   ├── context/            # CartContext (Context API)
│   ├── pages/              # Home, Products, Auth, Admin, Profile
│   ├── router/             # AppRouter con lazy loading
│   ├── services/           # API calls
│   ├── utils/              # Helpers y formatters
│   ├── constants/          # CART_ACTIONS, STORAGE_KEYS
│   └── index.css           # Estilos globales + @theme inline
├── public/                 # Archivos estáticos
└── index.html              # HTML con meta tags SEO
```

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
azul-1: #264e60  azul-2: #427385  azul-3: #81a5ae
gris-1: #a9b2b9  gris-2: #c3c9ce  gris-3: #d9dce0
negro:  #2b2b2b  blanco: #f4f4f4  dorado: #b6a269
```

### Tipografía

- **Comfortaa** (300-700): Títulos y navegación
- **Sora** (100-800): Cuerpo de texto y UI

## 📊 Estado del Proyecto

**✅ Fase 1 - MVP (Completado)**

- Sistema de carrito funcional
- Navegación responsiva
- Diseño de marca implementado
- Lazy loading y optimizaciones
- SEO y PropTypes

**🔄 Fase 2 - E-commerce (En desarrollo)**

- Autenticación de usuarios
- Catálogo dinámico
- Panel administrativo
- Pasarela de pago

**📋 Fase 3 - Optimizaciones (Planificado)**

- PWA
- Testing automatizado
- Analytics

## � Enlaces

- **Demo**: [https://agusamor.github.io/WebAluna/](https://agusamor.github.io/WebAluna/)
- **Repositorio**: [GitHub - WebAluna](https://github.com/AgusAmor/WebAluna)

## 📄 Licencia

**Licencia Propietaria** - Todos los derechos reservados © 2025

Este proyecto es privado. No está permitido el uso, copia, modificación o distribución sin autorización expresa del propietario.

---

**📧 Contacto**: Crear issue en GitHub para consultas
