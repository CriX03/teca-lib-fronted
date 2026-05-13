# Teca Biblioteca Frontend

[![Build (local)](https://img.shields.io/badge/build-local%20passing-brightgreen?style=for-the-badge)](https://github.com/CriX03/teca-lib-fronted)
[![Licencia](https://img.shields.io/badge/licencia-no%20especificada-lightgrey?style=for-the-badge)](https://github.com/CriX03/teca-lib-fronted)
[![Ultimo Commit](https://img.shields.io/github/last-commit/CriX03/teca-lib-fronted?style=for-the-badge)](https://github.com/CriX03/teca-lib-fronted/commits)

Aplicacion frontend SPA para **Teca Biblioteca**, construida con React + Vite y orientada a consumir una arquitectura backend de microservicios (autenticacion, catalogo, prestamos, notificaciones y reportes) con JWT.

> EN (short): Frontend SPA for a library management platform, integrated with JWT-authenticated microservices.

## Tabla de contenidos

- [Descripcion](#descripcion)
- [Stack tecnologico](#stack-tecnologico)
- [Caracteristicas principales](#caracteristicas-principales)
- [Arquitectura del frontend](#arquitectura-del-frontend)
- [Rutas y control de acceso](#rutas-y-control-de-acceso)
- [Requisitos previos](#requisitos-previos)
- [Configuracion de entorno](#configuracion-de-entorno)
- [Instalacion y ejecucion local](#instalacion-y-ejecucion-local)
- [Scripts disponibles](#scripts-disponibles)
- [Flujos funcionales por modulo](#flujos-funcionales-por-modulo)
- [Manejo de errores y seguridad](#manejo-de-errores-y-seguridad)
- [Roadmap sugerido](#roadmap-sugerido)
- [Autor](#autor)

## Descripcion

Este proyecto implementa la interfaz de usuario para gestionar operaciones de biblioteca:

- Registro e inicio de sesion con JWT.
- Gestion de catalogo (libros, autores, editoriales y categorias).
- Prestamos y devoluciones de libros.
- Reportes administrativos.
- Notificaciones de eventos relevantes de prestamos.

La aplicacion esta pensada para ejecutarse junto a servicios backend ya existentes.

## Stack tecnologico

- **React 19**
- **Vite 8**
- **React Router DOM 7**
- **Axios**
- **Tailwind CSS 4**
- **Context API** (auth + tema)
- **react-hot-toast** para feedback visual
- **lucide-react** para iconografia

## Caracteristicas principales

- Autenticacion JWT con persistencia en `localStorage`.
- Interceptores Axios para:
  - inyectar token en cada request,
  - manejar errores globales de autenticacion (`401`).
- Rutas publicas, protegidas y exclusivas para administradores.
- Dashboard con resumen de actividad.
- Catalogo con busqueda, filtros, paginacion, detalle, edicion y eliminacion (segun rol).
- Flujo de prestamos/devoluciones para usuario y panel de gestion para admin.
- Reportes de libros mas prestados, prestamos por usuario y retrasos.
- Sistema de notificaciones (API + historial local en navegador).
- UI responsive con estados de carga, error y vacio.

## Arquitectura del frontend

Estructura principal en `src/`:

```text
src/
|- api/            # Axios e instancias por microservicio
|- services/       # Capa de consumo API por dominio
|- pages/          # Vistas principales
|- components/     # Componentes reutilizables y UI
|- layouts/        # Layout de auth y dashboard
|- routes/         # Definicion de rutas
|- context/        # AuthContext y ThemeContext
|- hooks/          # Hooks personalizados
|- utils/          # Utilidades (toasts, helpers)
`- main.jsx        # Punto de entrada
```

## Rutas y control de acceso

Rutas publicas:

- `/login`
- `/registro`

Rutas protegidas (usuario autenticado):

- `/dashboard`
- `/catalogo`
- `/catalogo/nuevo`
- `/catalogo/editar/:id`
- `/catalogo/autores`
- `/catalogo/editoriales`
- `/catalogo/categorias`
- `/prestamos`

Rutas solo administrador:

- `/prestamos/admin`
- `/reportes`

## Requisitos previos

- Node.js 18+
- npm 9+
- Backend de microservicios disponible

## Configuracion de entorno

Crea un archivo `.env` en la raiz del proyecto con las URLs de los microservicios:

```env
VITE_API_USERS_URL=http://localhost:8001
VITE_API_CATALOG_URL=http://localhost:8002
VITE_API_LOANS_URL=http://localhost:8003
VITE_API_NOTIFICATIONS_URL=http://localhost:8004
VITE_API_REPORTS_URL=http://localhost:8005
```

> Ajusta puertos/hosts segun tu entorno real de backend.

## Instalacion y ejecucion local

```bash
npm install
npm run dev
```

Abrir en navegador:

- `http://localhost:5173`

Build de produccion:

```bash
npm run build
npm run preview
```

## Scripts disponibles

- `npm run dev`: inicia servidor de desarrollo con HMR.
- `npm run build`: genera build optimizado para produccion.
- `npm run preview`: sirve el build localmente.
- `npm run lint`: ejecuta reglas de ESLint.

## Flujos funcionales por modulo

### Auth

- Login (`/auth/login`)
- Registro (`/auth/registro`)
- Usuario actual (`/auth/me`)
- Verificacion de permisos admin (`/auth/admin/check`)

### Catalogo

- CRUD de libros
- Gestion de autores
- Gestion de editoriales
- Gestion de categorias

### Prestamos

- Crear prestamo
- Consultar prestamos del usuario
- Registrar devolucion de usuario
- Gestion de prestamos global para admin

### Reportes (admin)

- Libros mas prestados
- Prestamos por usuario
- Retrasos

### Notificaciones

- Confirmacion de prestamo
- Confirmacion de devolucion
- Recordatorios
- Historial local de notificaciones

## Manejo de errores y seguridad

- Token JWT agregado automaticamente desde `localStorage`.
- Ante error `401`, se limpia sesion y se dispara cierre de sesion global.
- Manejo de errores de red con mensajes normalizados.
- Rutas privadas protegidas en cliente.
- Vistas y acciones condicionadas por rol (`admin` / usuario).

## Roadmap sugerido

- Integrar React Query para cache y sincronizacion de datos.
- Incorporar pruebas unitarias e integracion (Vitest + Testing Library).
- Agregar CI para lint/build/test en pull requests.
- Mejorar observabilidad de errores y telemetria frontend.

## Autor

Proyecto desarrollado para **Teca Biblioteca**.
