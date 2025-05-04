const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('users/index');
});

router.get('/historia', (req, res) => {
    res.render('users/historia');
});

router.get('/login', (req, res) => {
    res.render('users/login');
});



module.exports = router;