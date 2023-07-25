/*
    ruta: api/uploads
*/

const { Router } = require('express');
const router = Router();

// Implementamos lo necesario que viene en la librería instalada con el cmando
// npm i express-fileupload y que nos permite cargar archivos
const expressFileUpload = require('express-fileupload');

// Validador JWT
const { validarJWT } = require('../middlewares/validar-jwt');

// Importamos el controlador de carga de archivos
const { fileUpload, retornaImagen } = require('../controllers/uploads');

// Usamos el middleware
router.use( expressFileUpload() );

// Cargar archivo
router.put( '/:tipo/:id', [
    validarJWT
], 
fileUpload );

// Obtener archivo
router.get( '/:tipo/:foto', [], retornaImagen );


// Exportamos el router
module.exports = router;