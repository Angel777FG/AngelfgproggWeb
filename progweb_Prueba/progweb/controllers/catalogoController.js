const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const estampadoModel = require('../models/estampadoModel');

const RUTA_CATALOGO = path.join(__dirname, '..', 'catalogos', 'catalogo_estampados.html');

// GET /api/catalogo/estampados
async function listarEstampados(req, res) {
    try {
        const estampados = estampadoModel.obtenerTodos();
        res.status(200).json({ ok: true, total: estampados.length, estampados });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error interno al listar estampados', error: error.message });
    }
}

// POST /api/catalogo/importar
async function importarCatalogo(req, res) {
    try {
        try {
            await fs.access(RUTA_CATALOGO);
        } catch {
            return res.status(404).json({ ok: false, mensaje: 'Archivo catalogo_estampados.html no encontrado' });
        }

        const html = await fs.readFile(RUTA_CATALOGO, 'utf-8');

        if (!html || html.trim() === '') {
            return res.status(400).json({ ok: false, mensaje: 'El archivo HTML está vacío' });
        }

        const $ = cheerio.load(html);

        // --- TAREA 2: Validación cuando Cheerio no encuentra elementos ---
        if ($('.estampado').length === 0) {
            return res.status(400).json({
                ok: false,
                error: 'No se encontraron elementos .estampado en el HTML'
            });
        }
        // ----------------------------------------------------------------

        const estampados = [];

        $('.estampado').each(function () {
            const nombre      = $(this).find('.nombre').text().trim();
            const precioTexto = $(this).find('.precio').text().trim();
            const categoria   = $(this).find('.categoria').text().trim();
            const talla       = $(this).find('.talla').text().trim();
            const stockTexto  = $(this).find('.stock').text().trim();
            const descripcion = $(this).find('.descripcion').text().trim();
            const id          = $(this).attr('data-id');

            const precio = parseInt(precioTexto, 10);
            const stock  = parseInt(stockTexto, 10);

            if (!nombre || isNaN(precio) || !categoria) return;

            estampados.push({
                id: id || null,
                nombre,
                precio,
                categoria,
                talla: talla || 'Única',
                stock: isNaN(stock) ? 0 : stock,
                descripcion: descripcion || '',
                importado_en: new Date().toLocaleString('es-CL')
            });
        });

        if (estampados.length === 0) {
            return res.status(400).json({ ok: false, mensaje: 'No se encontraron estampados válidos en el HTML' });
        }

        const resultado = estampadoModel.importarEstampados(estampados);

        res.status(200).json({
            ok: true,
            mensaje: 'Catálogo importado correctamente',
            importados: resultado.importados,
            actualizados: resultado.actualizados,
            total_procesados: estampados.length
        });

    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error interno al importar el catálogo', error: error.message });
    }
}

// GET /api/catalogo/reporte
async function verReporte(req, res) {
    try {
        const estampados = estampadoModel.obtenerTodos();

        if (estampados.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No hay estampados importados. Usa POST /api/catalogo/importar primero' });
        }

        const reporte = estampadoModel.reportePorCategoria();

        res.status(200).json({ ok: true, total_estampados: estampados.length, categorias: reporte.length, reporte });

    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error interno al generar el reporte', error: error.message });
    }
}

// GET /api/catalogo/stats
async function verStats(req, res) {
    try {
        const stats = await estampadoModel.obtenerStats();
        res.status(200).json({ ok: true, stats });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error interno al obtener estadísticas', error: error.message });
    }
}

// GET /api/catalogo/buscar?categoria=...
async function buscarProductos(req, res) {
    try {
        const { categoria } = req.query;

        if (!categoria || categoria.trim() === '') {
            return res.status(400).json({
                ok: false,
                error: 'Debes indicar una categoria. Ejemplo: /buscar?categoria=Lacteos'
            });
        }

        const productos = await estampadoModel.buscarPorCategoria(categoria.trim());
        res.status(200).json({
            ok: true,
            categoria: categoria.trim(),
            total: productos.length,
            productos
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error interno al buscar productos', error: error.message });
    }
}

module.exports = { listarEstampados, importarCatalogo, verReporte, verStats, buscarProductos };
