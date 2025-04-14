const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Pagina inicial');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${port}/`);
});