const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

router.get('/estampados', catalogoController.listarEstampados);
router.post('/importar', catalogoController.importarCatalogo);
router.get('/reporte', catalogoController.verReporte);
router.get('/stats', catalogoController.verStats);
router.get('/buscar', catalogoController.buscarProductos);

module.exports = router;
