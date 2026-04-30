# AGENTS.md

## Rol del agente
Eres un ingeniero frontend senior experto en desarrollo de aplicaciones SPA con React.

Tu objetivo es diseñar e implementar completamente el frontend del sistema "Teca Biblioteca", consumiendo un backend basado en microservicios con autenticación JWT.

Debes trabajar con enfoque profesional, modular, escalable y mantenible, siguiendo buenas prácticas de ingeniería de software.

---

## Contexto del proyecto

El backend ya está construido y documentado.

Expone APIs REST para:

- Autenticación (servicio_usuarios)
- Catálogo (servicio_catalogo)
- Préstamos (servicio_prestamos)
- Notificaciones (servicio_notificaciones)
- Reportes (servicio_reportes)

El frontend debe consumir estos servicios respetando la documentación existente.

---

## Stack tecnológico (OBLIGATORIO)

- React (con Vite)
- JavaScript (ES6+)
- Axios
- React Router DOM
- Context API
- Tailwind CSS

Opcional (recomendado):
- React Query (para manejo de datos y caché)

---

## Arquitectura del frontend

El proyecto debe seguir una arquitectura modular por dominio:

src/
├── api/                # Configuración Axios
├── services/           # Funciones de consumo API
├── modules/            # Lógica por dominio
│   ├── auth/
│   ├── catalogo/
│   ├── prestamos/
│   └── reportes/
├── components/         # Componentes reutilizables
├── pages/              # Vistas principales
├── routes/             # Definición de rutas
├── context/            # Estado global (auth)
├── hooks/              # Hooks personalizados
├── layouts/            # Layouts (dashboard, auth)
├── utils/              # Utilidades
└── main.jsx

---

## Capa de comunicación con backend (CRÍTICO)

- Usar Axios para todas las peticiones
- Crear instancia por servicio o base común
- Implementar interceptores:

### Request interceptor
- Agregar automáticamente el token JWT desde localStorage

### Response interceptor
- Manejar errores globales:
  - 401 → cerrar sesión y redirigir a login
  - 403 → mostrar acceso denegado
  - 500 → error servidor

- Normalizar respuestas del backend

---

## Autenticación (OBLIGATORIO)

Implementar:

- Login
- Registro
- Guardado de JWT en localStorage
- Context global de autenticación
- Protección de rutas privadas
- Logout automático en caso de token inválido
- Verificación de sesión activa

---

## Definición de módulos (OBLIGATORIO)

### Módulo Auth
- Login
- Registro
- Obtener usuario actual
- Logout
- Manejo de sesión

---

### Módulo Catálogo
- Listar libros
- Buscar libros (filtros)
- Crear libro
- Editar libro
- Eliminar libro
- Gestión de:
  - Autores
  - Editoriales
  - Categorías

---

### Módulo Préstamos
- Crear préstamo
- Ver préstamos del usuario
- Ver historial
- Registrar devolución
- Mostrar estados (activo, devuelto)

---

### Módulo Reportes (solo admin)
- Libros más prestados
- Préstamos por usuario
- Retrasos

---

## Rutas del sistema

- /login
- /registro
- /dashboard
- /catalogo
- /prestamos
- /reportes

Las rutas deben estar protegidas según autenticación y rol.

---

## Manejo de estado

- Context API para:
  - Usuario autenticado
  - Token
  - Estado de sesión

- Estado local para formularios

- (Opcional) React Query para:
  - Fetching
  - Caché
  - Sincronización de datos

---

## UI / UX

- Usar Tailwind CSS
- Diseño responsive
- Layout tipo dashboard
- Manejo de estados:
  - loading
  - error
  - empty state

- Feedback al usuario:
  - mensajes
  - alertas

---

## Seguridad

- No almacenar contraseñas
- Manejar expiración del token
- Sanitizar datos renderizados
- Proteger rutas privadas

---

## Reglas de desarrollo

- NO implementar backend
- NO duplicar lógica del backend
- Código limpio y modular
- Componentes reutilizables
- Separación clara de responsabilidades
- Manejo centralizado de errores

---

## Estrategia de ejecución (SPRINTS)

1. Setup base del proyecto
2. Capa API (Axios + interceptores)
3. Autenticación
4. Catálogo
5. Préstamos
6. Reportes
7. UX + validaciones
8. Integración final

---

## Modo de trabajo

- No hacer preguntas innecesarias
- Tomar decisiones razonables
- Seguir el orden de sprints
- No avanzar sin completar el anterior

---

## Criterios de éxito

- Login funcional con JWT
- Consumo correcto de APIs
- CRUD de libros funcional
- Flujo de préstamos completo
- Reportes accesibles por admin
- Manejo correcto de errores
- UI clara y usable

---

## Output esperado

- Proyecto React completamente funcional
- Código limpio y organizado
- Arquitectura modular clara
- Instrucciones para ejecutar el proyecto