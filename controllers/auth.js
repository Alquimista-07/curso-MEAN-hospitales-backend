const { response } = require("express");

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

const { googleVerify } = require("../helpers/google-verify");

// Importamos el menu
const { obtenerMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificamos que sea un email correcto
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email o password incorrectos'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o password incorrectos'
            });
        }

        // Generar el token - JWT
        const token =  await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
            menu: obtenerMenuFrontEnd( usuarioDB.role )
        });

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal contacte al administrador'
        });
    }

}

// Controlador login con Google Sign-in
// Documentación oficial Google Identity
// URL: https://developers.google.com/identity/gsi/web/guides/overview?hl=es-419
const googleSignIn = async (req, res = response) => {

    // Para hacer la validación requermimso de un paquete de node que se instala usando
    // el comando: npm install google-auth-library --save
    try {
        const { email, name, picture } = await googleVerify( req.body.token );

        // Verificamos si el email ya existe
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                // Este password solo lo colocamos para que no choque con la validación de requerido 
                // pero como sabemos esto se hace es con un hash y por lo tanto esto no es usado y no sirve para iniciar sesión
                password: '***', 
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            /*
            // Si quisieramos sobreescribir el password y hacer que siempre se loguee con google podríamos hacer
            // lo siguiente:
            usuario.password = '**'
            */
           // Ahora como no es el caso y queremos permitir que se loguee con el password normalmente hacemos lo siguiente
           usuario.google = true;
        }

        // Grabamos el usuario
        await usuario.save();

        // Generamos el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            email,
            name,
            picture,
            token,
            menu: obtenerMenuFrontEnd( usuario.role )
        });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });

    }

}

// Controlador para renovar y revalidar el token de google
const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por uid
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario,
        menu: obtenerMenuFrontEnd( usuario.role )
    })

} 

// Exportamos
module.exports = {
    login,
    googleSignIn,
    renewToken
}