function login(req, res) {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
        return res.status(400).json({ ok: false, mensaje: 'Usuario y clave son obligatorios' });
    }

    if (usuario === 'admin' && clave === '1234') {
        req.session.usuario = { nombre: 'Administrador', usuario: 'admin', rol: 'admin' };
        return res.status(200).json({ ok: true, mensaje: 'Inicio de sesión correcto', usuario: req.session.usuario });
    }

    return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
}

function logout(req, res) {
    req.session.destroy(function(error) {
        if (error) {
            return res.status(500).json({ ok: false, mensaje: 'Error al cerrar sesión' });
        }
        res.status(200).json({ ok: true, mensaje: 'Sesión cerrada correctamente' });
    });
}

function verificarSesionActiva(req, res) {
    if (req.session && req.session.usuario) {
        return res.status(200).json({ ok: true, autenticado: true, usuario: req.session.usuario });
    }
    res.status(200).json({ ok: true, autenticado: false });
}

module.exports = { login, logout, verificarSesionActiva };
