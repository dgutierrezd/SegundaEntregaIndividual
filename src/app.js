const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
app.set('views', path.join(__dirname, '../template/views'));
const directoriopartials = path.join(__dirname, '../template/partials');
app.use(express.static(directoriopublico));
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/',(req, res) => {

	res.render('index')
})

app.get('/coordinador',(req, res) => {
    res.render('coordinador')
})

app.get('/interesado',(req, res) => {
    res.render('interesado')
})

app.get('/aspirante',(req, res) => {
    res.render('aspirante')
})

app.post('/creacionCurso',(req, res) => {
	
	res.render('creacionCurso', {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor:req.body.valor,
        estado:req.body.estado
	});
})

app.post('/registrarInscripcion', (req, res) => {
    res.render('registrarInscripcion', {
        idCurso: req.body.idCurso,
        documento: req.body.documento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    })
})

app.get('/inscribir', (req,res) => {
    res.render('inscribir', {
        id:req.query.id
    })
})

app.get('/estudiantesInscritos', (req, res) => {
    res.render('estudiantesInscritos', {
        id:req.query.id
    })
})

app.get('/cerrarCurso', (req, res) => {
    res.render('cerrarCurso', {
        id: req.query.id
    })
})

app.get('/estudianteEliminado', (req, res) => {
    res.render('estudianteEliminado', {
        documento: req.query.documento,
        id: req.query.id
    })
})

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})

app.get('*', (req, res) => {
	res.render('error', {
		estudiante: 'error'
	})
})