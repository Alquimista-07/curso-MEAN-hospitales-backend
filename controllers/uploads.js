// Controlador uploads

const path = require('path');

const fs = require('fs');

const { response } = require("express");

// Importamos el uuid
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    // Validar tipo
    // Creamos una constante que nos va a servir para validar los tipos ya que vamos a mover
    // el archivo a una carpeta para la cual la ruta debe ser valida
    const tiposValidos = [ 'hospitales', 'medicos', 'usuarios' ];

    if( !tiposValidos.includes( tipo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)'
        });
    }

    // Validar que exista un archivo
    if( !req.files || Object.keys(req.files).length === 0 ){
        return res.status(400).json({
            ok: false,
            msg: 'No se cargo ningún archivo'
        });
    }

    // Procesar la imágen...
    // Primero extraemos el archivo
    const file = req.files.imagen;

    // Extraemos la extensión del archivo
    const nombreCortado = file.name.split('.'); // por ejemplo imagen1.2.3.jpg
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // Validar extensión
    // Entonces en este caso como vamos a subir solo imagenes tenemos que dejar subir archivos validos
    // ya que en este codigo nos permite subir cualquier tipo de archivo
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ];
    if( !extensionesValidas.includes( extensionArchivo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'Este tipo de archivo no es permitido'
        });
    }

    // Generamos el nombre del archivo
    // Para ello vamos a usar un id unico para asignar como nombre de la imágen,
    // entonces para esto vamos a usar la librería uuid, y la cual la instalamos
    // usando el comando npm install uuid
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Creamos el Path donde se guarda la imágen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Movemos el archivo al path
    // Use the mv() method to place the file somehere on your server
    file.mv( path, function(err) {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imágen'
            });
        } 

        // Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo );
        
        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

}

// Creamos el controlador para obtener la imágen
const retornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    // Apuntamos al path completo para ello lo construimos
    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    // Imagen por defecto para manejar la excepción en caso de que no exista
    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-imagen.jpg` );
        res.sendFile( pathImg );
    }


}

module.exports = {
    fileUpload,
    retornaImagen
}