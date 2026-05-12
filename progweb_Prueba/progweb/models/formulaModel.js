const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '..', 'data', 'formulas.json');

function obtenerTodos() {
    if (!fs.existsSync(rutaArchivo)) {
        return [];
    }
    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
    if (contenido.trim() === '') return [];
    return JSON.parse(contenido);
}

function guardarFormulas(formulas) {
    fs.writeFileSync(rutaArchivo, JSON.stringify(formulas, null, 4));
}

function importarFormulas(nuevas) {
    const existentes = obtenerTodos();
    let importados = 0;
    let actualizados = 0;

    for (const formula of nuevas) {
        const indice = existentes.findIndex(f => f.nombre === formula.nombre);
        if (indice === -1) {
            existentes.push(formula);
            importados++;
        } else {
            existentes[indice] = formula;
            actualizados++;
        }
    }

    guardarFormulas(existentes);
    return { importados, actualizados };
}

function reportePorCategoria() {
    const formulas = obtenerTodos();
    const reporte = {};

    for (const f of formulas) {
        const cat = f.categoria || 'Sin categoría';
        if (!reporte[cat]) {
            reporte[cat] = { categoria: cat, total: 0, dificultades: [] };
        }
        reporte[cat].total++;
        if (!reporte[cat].dificultades.includes(f.dificultad)) {
            reporte[cat].dificultades.push(f.dificultad);
        }
    }

    return Object.values(reporte);
}

module.exports = { obtenerTodos, importarFormulas, reportePorCategoria };
