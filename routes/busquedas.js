/*
    ruta: api/todo:busqueda
*/

const { Router } = require('express');
const router = Router();

// Importamos las funcionalidades del controlador
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

// Validador JWT
const { validarJWT } = require('../middlewares/validar-jwt');

// Busqueda
router.get( '/:busqueda', [
    validarJWT
], 
getTodo );

// Busqueda
router.get( '/coleccion/:tabla/:busqueda', [
    validarJWT
], 
getDocumentosColeccion );

// Exportamos el router
module.exports = router;