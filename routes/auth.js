// Rutas login
/*
    Ruta: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', 
[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos
],
login );

// Documentación oficial Google Identity
// URL: https://developers.google.com/identity/gsi/web/guides/overview?hl=es-419
router.post('/google', 
[
    check('token', 'El token de Google es obligatoria').not().isEmpty(),
    validarCampos
],
googleSignIn );

// Revalidamos y renovamos el token de google
router.get('/renew', 
[ 
    validarJWT 
],
renewToken );

// Exportamos
module.exports = router;