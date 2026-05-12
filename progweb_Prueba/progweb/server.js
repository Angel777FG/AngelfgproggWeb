const express = require('express');
const path = require('path');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const soloAutenticados = require('./middleware/authMiddleware');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'estampart_secreto_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8, httpOnly: true, secure: false }
}));

app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Index.html')));
app.get('/gracias', (req, res) => res.sendFile(path.join(__dirname, 'Gracias.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/registro', (req, res) => res.sendFile(path.join(__dirname, 'registro.html')));
app.get('/contactos.html', soloAutenticados, (req, res) => res.sendFile(path.join(__dirname, 'contactos.html')));

app.use('/auth', authRoutes);
app.use('/api/contactos', soloAutenticados, contactoRoutes);
app.use('/api/catalogo', catalogoRoutes);

app.listen(PORT, () => {
    console.log('======================================');
    console.log('EstampArt - Servidor iniciado');
    console.log(`Abre: http://localhost:${PORT}`);
    console.log(`Login: http://localhost:${PORT}/login`);
    console.log('--- API Catálogo (Cheerio) ---');
    console.log(`POST http://localhost:${PORT}/api/catalogo/importar`);
    console.log(`GET  http://localhost:${PORT}/api/catalogo/estampados`);
    console.log(`GET  http://localhost:${PORT}/api/catalogo/reporte`);
    console.log('======================================');
});
