const express = require('express');

const router = express.Router();

router.get('/ubicacion', (req, res) => {
    res.render('users/ubicacion');
});

router.patch('/ubicacion/', (req, res) => {
    console.log("Ubicación editada");
})

module.exports = router;