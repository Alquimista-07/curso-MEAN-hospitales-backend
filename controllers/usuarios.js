// Controladores de usuarios

// Importamos para definir el tipo de la response
const { response } = require('express');

// Importamos el bcrypt para el tema de la encripción en una sola vía de la contraseña
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

// NOTA: Basicamente dentro de este archivo tenemos funciones que vamos a exportar
//       y que continen la logica que vamos a necesitar para gestionar los usuarios

// Obtener usuarios
const getUsuarios = async(req, res) => {

    //--------------------
    // Paginación Forma 1
    //--------------------
    // Creamos la constante con al que vamos a obtener el parametro opcional que va a indicar desde
    // donde voy a mostrar la paginación
    const desde = Number(req.query.desde) || 0;

    /*
    // Como parametro del find podemos mandar {} para especificar un filtro y solo mostrar lo que quiero
    const usuarios = await Usuario.find({}, 'nombre email role google')
                                  // Usamos el skip para que se salte todos los registros que están antes del desde
                                  .skip( desde )
                                  // Establecemos el limite que indica cuantos registros voy a mostrar por página
                                  .limit( 5 );

    // Como me gustaría no solo mostrar la cantidad de registros que se muestran sino que también
    // quiero mostrar cuantos registros tengo en la base de datos, para ello hacemos lo siguiente:
    const total = await Usuario.count();

    */

     //--------------------
    // Paginación Forma 2
    //--------------------
    // NOTA: Ahora el anterior código funciona pero el inconveniente es que podemos relentizar el proceso
    //       ya que son tareas asincronas que se están disparando una después de la otra la cual cuando se 
    //       tengan bastantes registros pueden causar problemas, entonces para resolver el problema tenemos
    //       una función propia que viene en Javascript desde el ES6.
    //       Por lo tanto esto si se nos va a ejeceutar de manera simultanea dando mejor performance al proceso.
    //       También adicionalmente prodemos desestructurar para indicar que lo que regrasa la primera promesa
    //       son los usuarios y lo que devuelve la segunda promesa es el total de registros tal cual como teníamos
    //       en el anterior código.
    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            // Usamos el skip para que se salte todos los registros que están antes del desde
            .skip( desde )
            // Establecemos el limite que indica cuantos registros voy a mostrar por página
            .limit( 5 ),

        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    });

}

// Crear usuario
const crearUsuario = async(req, res = response) => {

    // Leemos el body para recibir información a través del body
    const { nombre, password, email } = req.body;

    // Validamos si el usuario existe
    try {

        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            })
        }
        
        // Creamos una instancia del modelo con las propiedades
        const usuario = new Usuario( req.body );

        // Encriptar contraseña usando el bcryptjs
        // Creamos algo que se conoce como un salt que es una forma aleatoria para crear unos números que van a hacer parte
        // de la validación de la contraseña.
        const salt = bcrypt.genSaltSync();
        // NOTA: Ahora procedemos a encriptar la contraseña con nuestro salt cuyo valor por defecto es de 10 vueltas, pero si ocuparamos hacerlo de más vueltas podríamos mandar
        //       el valor como parámetro (por ejemplo genSaltSync(100)) y de esta forma la contraseña sería aún más segura, pero esto va a incrementar considerablemente el tiempo
        //       de respuesta del servicio (en este caso crearUsuario) porque va a consumir más memoria a la hora de crear la contraseña. Adicionalmente podemos ver más información
        //       en la documentación de bcrypt sobre los métodos y funciones que tiene.
        usuario.password = bcrypt.hashSync( password, salt );

        // Generarel token - JWT
        const token = await generarJWT( usuario.id );
        
        // Guardar usuario
        await usuario.save();
    
        res.json({
            ok: true,
            usuario,
            token
        });

    }
    catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

}

const actualizarUsuario = async( req, res = response ) => {

    // TODO: Validar token y comprobar si el usuario es el correcto

    // Obtenemos el uid
    const uid = req.params.id;

    try {

        // Validamos si existe
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Entonces acá paso la validación por lo tanto existe
        // Actualizaciones
        
        const { password, google, email, ...campos } = req.body;

        // Validamos si no se esta actualizando el email para eliminarlo ya que no se esta actualizando
        if( usuarioDB.email !== email ){

            // Verificamos que no exista un usuario con ese correo electronico ya que 
            // no se podría actualizar ya que choca con la validación de campo unico
            // y con esto controlamos esa excepción
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario registrado con ese email'
                });
            }

        }
        
        // Colocamos una condición ya que tiene que funcionar solo si no es un usuario registrado a través de google
        if ( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            })
        }

        //----------------------------------------------------------------------------------------------------
        // NOTA: Esto se comento pero es una forma de borrar campos ya que se reemplazo por la desestructuración
        //       para optimizar el código
        //----------------------------------------------------------------------------------------------------
        // Borramos o quitamos los campos que no quiero actualizar de lo que me envian en el body
        // ya que campos es un objeto.
        // NOTA: Puedo borrar todo lo que yo no quiera grabar en la base de datos siempre y cuando eso que quiero
        //       borrar exista en el modelo de mongoose
        //
        // delete campos.password;
        // delete campos.google;
        //
        //----------------------------------------------------------------------------------------------------

        // Por lo tanto enviamos el id a actualizar, el valor de los campos que estamos actualizando, e indicamos
        // como un tercer parámetro indicando el new en true para que nos muestre la información por la cual se actualizao
        // ya que si no se indica dicho parámetro muestra la anterior información que se tenía a pesar de que si se actualizo
        // la información
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

}

const borrarUsuario = async( req, res = response ) => {

    // Obtenemos el uid
    const uid = req.params.id;

    // Validamos si existe el usuario
    const usuarioDB = await Usuario.findById( uid );

    if( !usuarioDB ) {
        return res.status(404).json({
            ok: false,
            msg: 'No existe un usuario por ese id'
        });
    }

    // Si existe lo borramos
    await Usuario.findByIdAndDelete( uid );

    try {

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal hable con el administrador'
        })
    }

}

// Exportamos
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}