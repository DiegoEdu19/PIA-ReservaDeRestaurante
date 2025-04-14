const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('Usuario/index');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${port}/`);
});