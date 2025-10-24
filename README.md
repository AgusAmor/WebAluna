# 🌙 Aluna - Ecosistema Digital

> Plataforma de comercio electrónico para lámparas de impresión 3D

## 📋 Descripción

Aluna es una empresa emergente dedicada al diseño, manufactura y distribución de lámparas con impresión 3D, donde se combina la tecnología con la creatividad artesanal. Este proyecto representa el ecosistema digital de la marca, implementando una plataforma de comercio electrónico moderna y eficiente.

---

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo%20activo-blue?style=for-the-badge&logo=github)
![Rama](https://img.shields.io/badge/Rama-v2--rewrite-green?style=for-the-badge&logo=git)
![Cart System](https://img.shields.io/badge/Cart%20System-Completamente%20funcional-success?style=for-the-badge&logo=shopping-cart)

![Licencia](https://img.shields.io/badge/Licencia-Propietaria-red?style=for-the-badge&logo=lock)
![Última actualización](https://img.shields.io/badge/Última%20actualización-Octubre%202025-lightgrey?style=for-the-badge&logo=calendar)

---

## 🎯 Objetivo del Proyecto

Desarrollar una **Single Page Application (SPA)** que permita:

- ✨ Aumentar la presencia digital del emprendimiento
- 🛒 Facilitar el proceso de compra a los clientes
- 📊 Mejorar la gestión interna de productos y usuarios
- 🚀 Optimizar los procesos de ventas online

## 🔧 Características Principales Implementadas

### 🌐 Sistema de Carrito de Compras

- **Carrito flotante** con botón posicionado en la esquina inferior izquierda
- **Contador de items** dinámico en tiempo real
- **Modal interactivo** para gestión completa del carrito
- **Operaciones CRUD** completas (agregar, ver, actualizar, eliminar)
- **Persistencia** automática en localStorage
- **Cálculo automático** de totales y subtotales
- **Diseño responsivo** adaptado a todos los dispositivos

### 🧭 Navegación y Layout

- **Header responsivo** con menú hamburguesa para móviles
- **Navegación fluida** entre secciones usando React Router
- **Footer informativo** con enlaces y datos de contacto
- **Diseño mobile-first** optimizado para experiencia móvil

### 🎨 Componentes UI

- **Flowbite React** integrado para componentes base
- **Tailwind CSS 4** para estilos personalizados modernos
- **Iconografía SVG** optimizada para performance
- **Animaciones suaves** y transiciones CSS

### ⚙️ Arquitectura Técnica

- **Context API** para gestión de estado global del carrito
- **Hooks personalizados** para lógica reutilizable
- **Componentes modulares** organizados por funcionalidad
- **Estructura escalable** preparada para crecimiento futuro

## 🔮 Características Planificadas

### 🌐 Plataforma E-commerce Completa

- **Catálogo de productos** dinámico con filtros y búsqueda
- **Pasarela de pago** integrada y segura
- **Sistema de registro y login** para usuarios
- **Seguimiento de pedidos** en tiempo real
- **Notificaciones** automáticas de estado

### 👥 Panel de Administración

- **Dashboard centralizado** para gestión completa
- **CRUD de productos** (crear, leer, actualizar, eliminar)
- **Gestión de usuarios** clientes y administradores
- **Reportes de ventas** y estadísticas

## 🛠️ Stack Tecnológico

### Frontend

- **React 19.1.1** - Biblioteca de JavaScript para interfaces de usuario
- **Vite 7.1.12** - Herramienta de construcción y desarrollo rápido
- **Tailwind CSS 4.1.16** - Framework CSS utility-first
- **Flowbite React 0.12.9** - Componentes UI pre-diseñados
- **React Router Dom 7.9.4** - Enrutamiento de lado cliente

### Herramientas de Desarrollo

- **ESLint 9.36.0** - Linter para código JavaScript/React
- **PNPM 10.19.0** - Gestor de paquetes rápido y eficiente
- **Git** - Control de versiones

### Arquitectura

- **SPA (Single Page Application)** - Aplicación de una sola página
- **Context API** - Gestión de estado global para carrito de compras
- **Responsive Design** - Adaptable a todos los dispositivos
- **Component-Based Architecture** - Arquitectura modular y reutilizable

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- PNPM (gestor de paquetes)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
   git clone https://github.com/AgusAmor/WebAluna.git
   cd WebAluna
```

2. **Instalar dependencias**

```bash
   pnpm install
```

3. **Iniciar servidor de desarrollo**

```bash
   pnpm run dev
```

4. **Acceder a la aplicación**
   - Abrir navegador en: `http://localhost:5173`

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo

# Construcción
pnpm build        # Construye para producción
pnpm preview      # Vista previa de build de producción

# Calidad de código
pnpm lint         # Ejecuta ESLint para verificar código
```

## 📁 Estructura del Proyecto

```
WebAluna/
├── public/                    # Archivos públicos estáticos
├── src/                       # Código fuente
│   ├── assets/               # Recursos (imágenes, iconos, etc.)
│   ├── components/           # Componentes React reutilizables
│   │   ├── common/          # Componentes comunes (FloatingCartButton)
│   │   ├── ecommerce/       # Componentes de e-commerce (CartModal)
│   │   ├── forms/           # Componentes de formularios
│   │   ├── layout/          # Componentes de layout (Header, Footer)
│   │   └── ui/              # Componentes de interfaz de usuario
│   ├── context/             # Contextos React (CartContext)
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Admin/           # Panel administrativo
│   │   ├── Auth/            # Autenticación (Login, Register)
│   │   ├── Home/            # Página principal
│   │   ├── Products/        # Catálogo de productos
│   │   └── Profile/         # Perfil de usuario
│   ├── services/            # Servicios y API calls
│   ├── constants/           # Constantes de la aplicación
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── eslint.config.js         # Configuración ESLint
├── vite.config.js           # Configuración Vite
├── tailwind.config.js       # Configuración Tailwind CSS
└── package.json             # Dependencias y scripts
```

## 🎨 Diseño y UX

### Paleta de Colores

- Según identidad de marca Aluna
- Implementada con variables CSS personalizadas
- Optimizada para accesibilidad y contraste

### Componentes UI

- **Flowbite React** para componentes base
- **Tailwind CSS** para estilos personalizados
- **Diseño responsivo** mobile-first
- **Interfaz intuitiva** centrada en el usuario

## 🔐 Funcionalidades de Seguridad

- **Autenticación de usuarios** segura
- **Roles y permisos** diferenciados
- **Validación de formularios** del lado cliente
- **Protección de rutas** administrativas
- **Sanitización de datos** de entrada

## 📈 Estado Actual del Desarrollo

### ✅ Funcionalidades Completadas

- **Arquitectura base** del proyecto con Vite + React
- **Sistema de carrito** completamente funcional
- **Navegación responsiva** con header mobile-friendly
- **Gestión de estado** con Context API
- **Persistencia de datos** en localStorage
- **Componentes modulares** organizados y reutilizables
- **Integración** exitosa de Tailwind CSS + Flowbite React

### 🔄 En Desarrollo

- **Páginas adicionales** (Products, Auth, Admin, Profile)
- **Servicios API** para productos y autenticación
- **Formularios** de login y registro
- **Panel administrativo** básico

### 📋 Próximas Implementaciones

- **Backend integration** para datos dinámicos
- **Sistema de autenticación** completo
- **Pasarela de pago** integrada
- **Gestión de productos** desde admin panel

### �️ Información Técnica

- **Servidor de desarrollo**: `http://localhost:5173`
- **Hot Module Replacement**: Habilitado y funcional
- **Build tool**: Vite 7.1.12 con optimizaciones
- **Linting**: ESLint configurado para React
- **Package manager**: PNPM 10.19.0 para gestión eficiente

## 📈 Funcionalidades del E-commerce

### Para Clientes (Implementadas ✅)

- 📱 Navegación intuitiva y responsiva
- 🛒 Carrito de compras con botón flotante
- 💾 Persistencia automática de datos del carrito
- 🔢 Contador dinámico de items en tiempo real
- ➕➖ Gestión de cantidades desde el modal
- 🗑️ Eliminación individual de productos del carrito

### Para Clientes (Planificadas 📋)

- 🔍 Búsqueda y filtrado avanzado de productos
- 💳 Checkout seguro y rápido
- 📧 Confirmaciones por email
- 📋 Historial de pedidos
- 👤 Gestión de perfil de usuario

### Para Administradores (Planificadas 📋)

- 📊 Dashboard con métricas clave
- 📦 Gestión completa de inventario
- 👤 Administración de usuarios
- 📈 Reportes de ventas
- ⚙️ Configuración de sistema
- 🔔 Sistema de notificaciones

## 🚀 Roadmap

### Fase 1: MVP (Actual)

- [x] Configuración base del proyecto
- [x] Implementación de UI components
- [x] Sistema de carrito de compras funcional
- [x] Botón flotante de carrito con contador
- [x] Navegación responsiva con Header
- [x] Context API para gestión de estado
- [x] Persistencia en localStorage
- [ ] Modal de carrito con CRUD completo

### Fase 2: E-commerce Completo (En Desarrollo 🔄)

- [ ] Sistema de autenticación completo
- [ ] Catálogo de productos dinámico
- [ ] Panel administrativo funcional
- [ ] Gestión de pedidos
- [ ] Pasarela de pago integrada
- [ ] Sistema de notificaciones

### Fase 3: Optimizaciones (Planificado 📋)

- [ ] PWA implementation
- [ ] Optimización SEO
- [ ] Analytics e insights
- [ ] Testing automatizado
- [ ] Mejoras de performance

## 🔒 Licencia y Contribución

**⚠️ PROYECTO PRIVADO - LICENCIA PROPIETARIA**

Este proyecto tiene **todos los derechos reservados**. El código fuente es propiedad exclusiva del desarrollador y está protegido por leyes de derechos de autor.

### 🚫 Restricciones de Uso:

- ❌ **Prohibido** el uso, copia, modificación o distribución no autorizada
- ❌ **Prohibido** el fork o clonación para otros proyectos
- ❌ **Prohibido** el uso comercial sin autorización expresa
- ❌ **Prohibido** crear trabajos derivados

### 👥 Colaboración Autorizada:

Para colaborar en este proyecto:

1. **Solicitar autorización** previa por escrito al propietario
2. **Firmar acuerdo de confidencialidad** si es requerido
3. **Trabajar solo en ramas autorizadas** del repositorio oficial
4. **Respetar términos** de la licencia propietaria en todo momento

### 📧 Solicitudes de Licenciamiento:

Para permisos especiales, uso comercial o colaboración:

- Crear un issue en GitHub con la solicitud detallada
- Contactar directamente al propietario del código
- Todas las solicitudes serán evaluadas caso por caso

## 📄 Criterios de Aceptación

- ✅ La página web permite navegación fluida entre secciones
- ✅ Sistema de carrito de compras completamente funcional
- ✅ Botón flotante de carrito con contador de items
- ✅ Modal de carrito con operaciones CRUD (agregar, ver, actualizar, eliminar)
- ✅ Persistencia de datos del carrito en localStorage
- ✅ Header responsivo con navegación móvil
- ✅ Integración exitosa de componentes Flowbite React
- ✅ Arquitectura modular y escalable implementada
- [ ] Sistema de registro y autenticación de usuarios
- [ ] Integración de pasarela de pago
- [ ] Panel administrativo operativo para gestión de productos

## 🔗 Enlaces

- **Repositorio**: [GitHub - WebAluna](https://github.com/AgusAmor/WebAluna)
- **Demo**: En desarrollo
- **Documentación**: Incluida en este README

## 👥 Equipo de Desarrollo

- **Desarrollo Frontend**: Equipo Aluna
- **Diseño UX/UI**: Cliente/Aluna
- **Gestión de Proyecto**: Metodología Ágil

## 📄 Licencia

Este proyecto está licenciado bajo **Licencia Propietaria** - consulta el archivo [LICENSE](./LICENSE) para más detalles.

**Copyright (c) 2025 - Todos los derechos reservados**

⚖️ Este software está protegido por leyes internacionales de derechos de autor. Cualquier uso no autorizado constituye una violación y será procesado con todo el rigor de la ley.

---

**📧 Contacto**: Para consultas sobre el proyecto, crear un issue en GitHub.
