# EstampArt — Tienda de Estampados

Tienda online de poleras con estampados. Incluye autenticación por sesión, formulario de contacto y catálogo importado con **Cheerio**.

---

## Instalación

```bash
npm install
node server.js
```

Servidor en `http://localhost:3000`

**Usuario:** `admin` — **Contraseña:** `1234`

---

## Estructura (Arquitectura por capas)

```
progweb/
├── server.js
├── Index.html / login.html / registro.html / Gracias.html / contactos.html
├── style.css
├── catalogos/
│   └── catalogo_estampados.html    ← HTML que parsea Cheerio
├── controllers/
│   ├── authController.js
│   ├── contactoController.js
│   └── catalogoController.js       ← Lógica Cheerio
├── models/
│   ├── contactoModel.js
│   └── estampadoModel.js
├── routes/
│   ├── authRoutes.js
│   ├── contactoRoutes.js
│   └── catalogoRoutes.js
├── middleware/
│   └── authMiddleware.js
└── data/
    ├── contactos.json
    └── estampados.json
```

---

## Endpoints API Catálogo (Cheerio)

### POST `/api/catalogo/importar`
Parsea `catalogo_estampados.html` con Cheerio y guarda los productos.

**Datos extraídos (6 campos):**
| Campo | Selector CSS | Tipo |
|-------|-------------|------|
| nombre | `.nombre` | string |
| precio | `.precio` | número |
| categoria | `.categoria` | string |
| talla | `.talla` | string |
| stock | `.stock` | número |
| descripcion | `.descripcion` | string |

**Respuesta 200:**
```json
{
  "ok": true,
  "mensaje": "Catálogo importado correctamente",
  "importados": 6,
  "actualizados": 0,
  "total_procesados": 6
}
```
**Errores:** `400` HTML vacío · `404` archivo no encontrado · `500` error interno

---

### GET `/api/catalogo/estampados`
Lista todos los estampados importados.

**Respuesta 200:**
```json
{
  "ok": true,
  "total": 6,
  "estampados": [
    {
      "id": "1",
      "nombre": "Polera Gamer Pro",
      "precio": 9990,
      "categoria": "Gaming",
      "talla": "M",
      "stock": 20,
      "descripcion": "Diseño exclusivo para gamers."
    }
  ]
}
```

---

### GET `/api/catalogo/reporte`
Reporte agrupado por categoría con precios.

**Respuesta 200:**
```json
{
  "ok": true,
  "total_estampados": 6,
  "categorias": 4,
  "reporte": [
    { "categoria": "Gaming", "total_productos": 1, "precio_min": 9990, "precio_max": 9990, "precio_promedio": 9990 },
    { "categoria": "Musica", "total_productos": 2, "precio_min": 8990, "precio_max": 9490, "precio_promedio": 9240 }
  ]
}
```
**Error 404** si no hay estampados importados.

---

## Flujo de prueba con Postman

```
1. node server.js
2. GET  http://localhost:3000/api/catalogo/estampados   → { total: 0 }
3. POST http://localhost:3000/api/catalogo/importar     → { importados: 6 }
4. GET  http://localhost:3000/api/catalogo/estampados   → lista los 6 estampados
5. GET  http://localhost:3000/api/catalogo/reporte      → estadísticas por categoría
```

---

## Todos los endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Página principal | No |
| GET | `/login` | Formulario login | No |
| GET | `/registro` | Formulario registro | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| GET | `/contactos.html` | Ver contactos | Sí |
| POST | `/api/contactos` | Enviar contacto | Sí |
| GET | `/api/contactos` | Listar contactos | Sí |
| POST | `/api/catalogo/importar` | Importar HTML con Cheerio | No |
| GET | `/api/catalogo/estampados` | Listar estampados | No |
| GET | `/api/catalogo/reporte` | Reporte por categoría | No |

---

## Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | Éxito |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 401 | Sin sesión activa |
| 404 | No encontrado |
| 500 | Error del servidor |
