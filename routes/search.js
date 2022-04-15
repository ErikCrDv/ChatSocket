const { Router } = require('express');
const { search } = require('../controllers/search');

const router = Router();

router.get('/:colection/:keywords', search)

module.exports = router;