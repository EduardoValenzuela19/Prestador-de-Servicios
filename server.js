const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const mongoURI = 'mongodb://127.0.0.1:27017/amenites';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Base de Datos LOCAL Conectada');
        crearAdminLocal();
    })
    .catch(err => console.log('Error de conexión:', err));

const eventSchema = new mongoose.Schema({
    title: String,
    start: Date,
    end: Date,
    type: String,
    color: String,
    cliente: String,
    descripcion: String
});
const Event = mongoose.model('Event', eventSchema);

// 2. Cuentas
const accountsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    telephone: Number,
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const Account = mongoose.model('Account', accountsSchema);

// Inventario
const servicioMenuSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.ObjectId, select: false },
    titulo: { type: String, required: true },
    descripcion: { type: String, default: "Servicio profesional" },
    precio: { type: String, default: "$$" },
    categoria: { type: String, required: true },
    horarios: { type: [String], default: [] }
});
const ServicioMenu = mongoose.model('ServicioMenu', servicioMenuSchema);

// Cupones
const cuponSchema = new mongoose.Schema({
    codigo: String,
    descuento: String,
    fechaAplicacion: Date
});
const Coupon = mongoose.model('Coupon', cuponSchema);

// Locaciones / Perfil del Prestador 
const locationsSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.ObjectId, select: false },
    locationName: { type: String, required: true },
    address: { type: String, trim: true },
    city: { type: String },
    createdAt: { type: Date, default: Date.now(), select: false }
});
const Location = mongoose.model('Location', locationsSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findOne({ email }).select('+password');
        if (!user) return res.send(`<script>alert('Usuario no encontrado.'); window.location.href = '/index.html';</script>`);
        if (user.password === password) {
            res.redirect('/dashboard.html');
        } else {
            res.send(`<script>alert('Contraseña incorrecta'); window.location.href = '/index.html';</script>`);
        }
    } catch (error) { res.status(500).send("Error interno"); }
});

app.post('/register', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const existe = await Account.findOne({ email });
        if (existe) return res.send(`<script>alert('El correo ya existe.'); window.location.href = '/index.html';</script>`);

        await Account.create({ name, email, password, role: 'user' });
        res.redirect('/dashboard.html');
    } catch (error) { res.send(`<script>alert('Error al registrar'); window.location.href = '/index.html';</script>`); }
});

async function crearAdminLocal() {
    try {
        const emailAdmin = 'admin@aplicacion.com';
        const existe = await Account.findOne({ email: emailAdmin });
        if (!existe) {
            await Account.create({ name: 'Admin Local', email: emailAdmin, password: '123456', role: 'admin', telephone: 6641002020 });
        }
    } catch (error) {}
}

app.post('/api/inventario', async(req, res) => {
    try {
        const { titulo, descripcion, precio, categoria, horarios } = req.body;
        const horariosArray = horarios ? horarios.split(',').map(h => h.trim()) : [];
        await ServicioMenu.create({ titulo, descripcion, precio, categoria, horarios: horariosArray });
        res.redirect('/dashboard.html');
    } catch (error) { res.status(500).send('Error'); }
});

app.get('/api/inventario', async(req, res) => {
    const servicios = await ServicioMenu.find();
    res.json(servicios);
});

app.post('/api/inventario/editar/:id', async(req, res) => {
    try {
        const { titulo, descripcion, precio, categoria, horarios } = req.body;
        const horariosArray = horarios ? horarios.split(',').map(h => h.trim()) : [];
        await ServicioMenu.findByIdAndUpdate(req.params.id, {
            titulo,
            descripcion,
            precio,
            categoria,
            horarios: horariosArray
        });
        res.redirect('/dashboard.html');
    } catch (error) { res.status(500).send('Error al actualizar'); }
});

app.delete('/api/inventario/:id', async(req, res) => {
    try {
        await ServicioMenu.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error al borrar' }); }
});

app.post('/api/reservaciones', async(req, res) => {
    try {
        const { title, start, cliente, descripcion } = req.body;
        await Event.create({ title, start: new Date(start), cliente, descripcion, type: 'Reserva', color: '#da3743' });
        res.redirect('/dashboard.html');
    } catch (error) { res.status(500).send('Error'); }
});

app.get('/api/reservaciones', async(req, res) => {
    const eventos = await Event.find();
    res.json(eventos);
});


app.post('/api/reservaciones/editar/:id', async(req, res) => {
    try {
        const { title, start, cliente, descripcion } = req.body;
        await Event.findByIdAndUpdate(req.params.id, { title, start: new Date(start), cliente, descripcion });
        res.redirect('/dashboard.html');
    } catch (error) { res.status(500).send('Error al actualizar reserva'); }
});


app.delete('/api/reservaciones/:id', async(req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error al borrar reserva' }); }
});


app.post('/api/cupones', async(req, res) => {
    try {
        const { codigo, descuento, fechaAplicacion } = req.body;
        await Coupon.create({ codigo, descuento, fechaAplicacion: new Date(fechaAplicacion) });
        res.redirect('/dashboard.html');
    } catch (error) { res.status(500).send('Error'); }
});


app.post('/api/ubicacion', async(req, res) => {
    try {
        const { locationName, city, address } = req.body;
        const accountIdPrueba = "64b0f0a8e4b0a1a2b3c4d5e6";
        await Location.create({ accountId: accountIdPrueba, locationName, city, address });
        res.redirect('/dashboard.html');
    } catch (error) { res.status(500).send('Error'); }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));