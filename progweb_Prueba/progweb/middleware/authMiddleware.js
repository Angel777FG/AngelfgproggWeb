function soloAutenticados(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    }
    return res.status(401).json({
        ok: false,
        mensaje: 'Acceso denegado: debes iniciar sesión'
    });
}

module.exports = soloAutenticados;
