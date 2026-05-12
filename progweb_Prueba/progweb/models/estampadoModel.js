const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '..', 'data', 'estampados.json');

function obtenerTodos() {
    if (!fs.existsSync(rutaArchivo)) return [];
    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
    if (contenido.trim() === '') return [];
    return JSON.parse(contenido);
}

function guardarEstampados(estampados) {
    fs.writeFileSync(rutaArchivo, JSON.stringify(estampados, null, 4));
}

function importarEstampados(nuevos) {
    const existentes = obtenerTodos();
    let importados = 0;
    let actualizados = 0;

    for (const estampado of nuevos) {
        const indice = existentes.findIndex(e => e.nombre === estampado.nombre);
        if (indice === -1) {
            existentes.push(estampado);
            importados++;
        } else {
            existentes[indice] = estampado;
            actualizados++;
        }
    }

    guardarEstampados(existentes);
    return { importados, actualizados };
}

function reportePorCategoria() {
    const estampados = obtenerTodos();
    const reporte = {};

    for (const e of estampados) {
        const cat = e.categoria || 'Sin categoría';
        if (!reporte[cat]) {
            reporte[cat] = { categoria: cat, total_productos: 0, precio_min: Infinity, precio_max: -Infinity, suma: 0 };
        }
        reporte[cat].total_productos++;
        reporte[cat].suma += e.precio;
        if (e.precio < reporte[cat].precio_min) reporte[cat].precio_min = e.precio;
        if (e.precio > reporte[cat].precio_max) reporte[cat].precio_max = e.precio;
    }

    return Object.values(reporte).map(r => ({
        categoria: r.categoria,
        total_productos: r.total_productos,
        precio_min: r.precio_min,
        precio_max: r.precio_max,
        precio_promedio: Math.round(r.suma / r.total_productos)
    }));
}

async function obtenerStats() {
    const estampados = obtenerTodos();
    const total = estampados.length;
    if (total === 0) {
        return { total_productos: 0, precio_minimo: null, precio_maximo: null, precio_promedio: null };
    }
    const precios = estampados.map(e => e.precio);
    const precio_minimo  = Math.min(...precios);
    const precio_maximo  = Math.max(...precios);
    const suma           = precios.reduce((acc, p) => acc + p, 0);
    const precio_promedio = Math.round((suma / total) * 100) / 100;
    return { total_productos: total, precio_minimo, precio_maximo, precio_promedio };
}

async function buscarPorCategoria(categoria) {
    const estampados = obtenerTodos();
    return estampados
        .filter(e => e.categoria === categoria)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

module.exports = { obtenerTodos, importarEstampados, reportePorCategoria, obtenerStats, buscarPorCategoria };
