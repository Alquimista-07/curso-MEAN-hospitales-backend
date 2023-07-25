// Rutas de los usuarios
/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
// Importamos el validador de express
const { check } = require('express-validator');
// Importamos el middleware personalizado para validar campos
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos controladores de usuarios
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

// Definimos las rutas pasando como segundo argumento el controlador

// Obtener usuarios
router.get( '/', [ validarJWT ], getUsuarios );

// Crear usuario
// Acá adentro definimos todos los middlewares que necesito que esta ruta pase, o evalue o ejecute antes
// de llegar al controlador. Aunque hay que tener en cuenta que también podemos cancelar 
// en algún middleware para no ejecute el controlador

// El check puede recibir un string o un arreglo de strings y el mensaje.
// Por lo tanto el primer argumento es el nombre del campo que estoy esperando
// y luego el mensaje de error. 
router.post( '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        // Agragamos el middleware personalizado para otimizar el código de errors que tenemos en los controladores
        validarCampos
    ], 
    crearUsuario );

// Actualizar el registro de un usuario
router.put( '/:id', 
[
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    // Agragamos el middleware personalizado para otimizar el código de errors que tenemos en los controladores
    validarCampos
],
actualizarUsuario );

// Borrar un usuario
router.delete('/:id', [ validarJWT, validarADMIN_ROLE ], borrarUsuario);

// Exortamos el router
module.exports = router;