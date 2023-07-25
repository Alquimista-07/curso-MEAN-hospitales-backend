/*
    Rutas de los hospitales
    ruta: '/api/hospitales'
 */

const { Router } = require('express');
// Importamos el validador de express
const { check } = require('express-validator');
// Importamos el middleware personalizado para validar campos
const { validarCampos } = require('../middlewares/validar-campos');

// Importamos las funcionalidades del controlador
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Definimos las rutas pasando como segundo argumento el controlador

// Obtener hospitales
router.get( '/', [], getHospitales );

// Crear hospital
// El check puede recibir un string o un arreglo de strings y el mensaje.
// Por lo tanto el primer argumento es el nombre del campo que estoy esperando
// y luego el mensaje de error. 
router.post( '/', 
    [ 
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearHospital );

// Actualizar el registro hospital
router.put( '/:id', 
[
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
],
actualizarHospital );

// Borrar hospital
router.delete('/:id', [
    validarJWT
], borrarHospital);

// Exportamos el router
module.exports = router;