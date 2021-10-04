/*
    path: api/login
*/

const {Router, response} = require('express');
const { check } = require('express-validator');
const { newUser, login, renewToken } = require('../controllers/auth');
const { valitdateFields } = require('../middleware/validate-fields');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    valitdateFields
], newUser);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
], login);

router.get('/renew', validateJWT, renewToken);

module.exports = router;