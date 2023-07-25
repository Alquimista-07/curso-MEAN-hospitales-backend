// Helper para actualizar imágenes

// Con esto puedo leer el filesystem, es decir los directorios y archivos para trabajar con ellos
const fs = require('fs');

// Importamos los modelos
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {

    if( fs.existsSync( path ) ){
        // Si existe borramos la imágen anterior
        fs.unlinkSync( path );
    }

}

const actualizarImagen = async( tipo, id, nombreArchivo ) => {
    
    let pathViejo = '';

    switch ( tipo ) {
        case 'medicos':
            // Verificar que exista el medico por id
            const medico = await Medico.findById( id );
            if( !medico ) {
                console.log('No se encontro medico por id');
                return false;
            }

            // Evaluamos si el medico ya tiene una imágen la cual si ya existe la tenemos que borrar
            pathViejo = `./uploads/medicos/${ medico.img }`;

            borrarImagen( pathViejo );

            medico.img = nombreArchivo;
            await medico.save();
            return true;

            break;

        case 'hospitales':
            // Verificar que exista el hospital por id
            const hospital = await Hospital.findById( id );
            if( !hospital ) {
                console.log('No se encontro hospital por id');
                return false;
            }

            // Evaluamos si el hospital ya tiene una imágen la cual si ya existe la tenemos que borrar
            pathViejo = `./uploads/hospitales/${ hospital.img }`;

            borrarImagen( pathViejo );

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

            break;

        case 'usuarios':
            // Verificar que exista el hospital por id
            const usuario = await Usuario.findById( id );
            if( !usuario ) {
                console.log('No se encontro usuario por id');
                return false;
            }

            // Evaluamos si el hospital ya tiene una imágen la cual si ya existe la tenemos que borrar
            pathViejo = `./uploads/usuarios/${ usuario.img }`;

            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

            break;
    
        default:
            break;
    }

}

module.exports = {
    actualizarImagen
}