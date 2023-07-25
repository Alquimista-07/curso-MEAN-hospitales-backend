/*
    Rutas Medicos
    ruta: '/api/medicos'
 */

const { Router } = require('express');
// Importamos el validador de express
const { check } = require('express-validator');
// Importamos el middleware personalizado para validar campos
const { validarCampos } = require('../middlewares/validar-campos');

// Importamos las funcionalidades del controlador
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicosById } = require('../controllers/medicos')

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Definimos las rutas pasando como segundo argumento el controlador

// Obtener Medicos
router.get( '/', [validarJWT], getMedicos );

// Crear Medico
// El check puede recibir un string o un arreglo de strings y el mensaje.
// Por lo tanto el primer argumento es el nombre del campo que estoy esperando
// y luego el mensaje de error. 
router.post( '/', 
    [
        validarJWT,
        check('nombre', 'EL nombre del medio es necesario').not().isEmpty(),
        check('hospital', 'EL hospital id debe de ser válido').isMongoId(),
        validarCampos
    ], 
    crearMedico );

// Actualizar el registro Medico
router.put( '/:id', 
[
    validarJWT,
    check('nombre', 'EL nombre del medio es necesario').not().isEmpty(),
    check('hospital', 'EL hospital id debe de ser válido').isMongoId(),
    validarCampos

],
actualizarMedico );

// Borrar Medico
router.delete('/:id', [validarJWT], borrarMedico);

// Obtener información del médico por id
router.get( '/:id', validarJWT, getMedicosById );

// Exportamos el router
module.exports = router;