---
trigger: always_on
---

# Backend API - Teca Biblioteca (Resumen para Frontend)
##Esta es una guia para el consumo del backend que debe realizar este proyecto fronted

## Base URLs (Microservicios)

Usuarios: http://localhost:5001  
Catalogo: http://localhost:5002  
Prestamos: http://localhost:5003  
Notificaciones: http://localhost:5004  
Reportes: http://localhost:5005  

---

## Autenticación (JWT)

### Login
POST /api/v1/auth/login

Body:
{
  "email": "string",
  "contrasena": "string"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "JWT",
    "expires_in": 3600
  }
}

### Uso del token
Header requerido:
Authorization: Bearer <token>

---

## Formato de respuesta

### Éxito
{
  "success": true,
  "data": {},
  "message": "string"
}

### Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "string"
  }
}

---

## Servicio: Usuarios

### Registro
POST /api/v1/auth/registro

### Usuario actual
GET /api/v1/auth/me

### Verificar admin
GET /api/v1/auth/admin/check

---

## Servicio: Catálogo

### Libros

GET /api/v1/catalogo/libros  
Query:
- titulo
- isbn
- autor_id
- disponible
- page
- per_page

POST /api/v1/catalogo/libros  
PUT /api/v1/catalogo/libros/:id  
DELETE /api/v1/catalogo/libros/:id  

PATCH /api/v1/catalogo/libros/:id/disponibilidad

---

### Autores / Editoriales / Categorías

CRUD estándar:

GET /  
POST /  
PUT /:id  
DELETE /:id  

---

## Servicio: Préstamos

### Crear préstamo
POST /api/v1/prestamos

Body:
{
  "libro_id": number,
  "dias_prestamo": number
}

Errores:
- BOOK_NOT_AVAILABLE
- BOOK_ALREADY_LOANED

---

### Mis préstamos
GET /api/v1/prestamos/mis-prestamos

---

### Devolución
POST /api/v1/prestamos/:id/devolucion

---

## Servicio: Reportes (ADMIN)

GET /api/v1/reportes/libros-mas-prestados  
GET /api/v1/reportes/prestamos-por-usuario  
GET /api/v1/reportes/retrasos  

---

## Códigos de error comunes

401 → No autenticado  
403 → Sin permisos  
404 → No encontrado  
409 → Conflicto (duplicado / lógica)  
422 → Validación  

Errores específicos:
- BOOK_NOT_AVAILABLE
- BOOK_ALREADY_LOANED
- ISBN_ALREADY_EXISTS

---

## Reglas importantes para el frontend

- Siempre enviar JWT en endpoints protegidos
- Manejar 401 → redirigir a login
- Manejar 403 → mostrar acceso denegado
- Usar paginación en listados
- Mostrar mensajes del backend al usuario
- Fechas vienen en formato ISO8601 (UTC)

---

## Flujo principal

1. Login → obtener token  
2. Guardar token  
3. Consumir APIs con Authorization  
4. Crear préstamo → actualiza disponibilidad  
5. Devolver → cambia estado  

---

## Health Check

GET /health en cada servicio