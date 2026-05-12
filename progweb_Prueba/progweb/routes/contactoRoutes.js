const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

router.get('/', contactoController.listarContactos);
router.post('/', contactoController.crearContacto);

module.exports = router;
