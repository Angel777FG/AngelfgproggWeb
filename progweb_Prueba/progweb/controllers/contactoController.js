const contactoModel = require('../models/contactoModel');

function listarContactos(req, res) {
    const contactos = contactoModel.obtenerTodos();
    res.json({ ok: true, total: contactos.length, datos: contactos });
}

function crearContacto(req, res) {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !asunto || !mensaje) {
        return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }
    if (nombre.length < 3) {
        return res.status(400).json({ ok: false, mensaje: 'El nombre debe tener al menos 3 caracteres' });
    }
    if (asunto.length < 3) {
        return res.status(400).json({ ok: false, mensaje: 'El asunto debe tener al menos 3 caracteres' });
    }
    if (mensaje.length < 10) {
        return res.status(400).json({ ok: false, mensaje: 'El mensaje debe tener al menos 10 caracteres' });
    }

    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronCorreo.test(correo)) {
        return res.status(400).json({ ok: false, mensaje: 'El correo no tiene un formato válido' });
    }

    const contactoNuevo = {
        id: Date.now(),
        nombre, correo, asunto, mensaje,
        fecha: new Date().toLocaleString('es-CL')
    };

    contactoModel.guardarContacto(contactoNuevo);

    res.status(201).json({ ok: true, mensaje: 'Contacto guardado correctamente', datos: contactoNuevo });
}

module.exports = { listarContactos, crearContacto };
