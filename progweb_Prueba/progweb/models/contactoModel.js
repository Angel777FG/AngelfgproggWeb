const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '..', 'data', 'contactos.json');

function obtenerTodos() {
    if (!fs.existsSync(rutaArchivo)) return [];
    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
    if (contenido.trim() === '') return [];
    return JSON.parse(contenido);
}

function guardarContacto(contactoNuevo) {
    const contactos = obtenerTodos();
    contactos.push(contactoNuevo);
    fs.writeFileSync(rutaArchivo, JSON.stringify(contactos, null, 4));
}

module.exports = { obtenerTodos, guardarContacto };
