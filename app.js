const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('Usuario/index');
});

app.get('/historia', (req, res) => {
    res.render('Usuario/historia');
});

app.get('/ubicacion', (req, res) => {
    res.render('Usuario/ubicacion');
});

app.get('/menu', (req, res) => {
    res.render('Usuario/menu');
});



app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${port}/`);
});