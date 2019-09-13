import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';



export default class FileSystem {

    constructor() {};


    guardarImagenTemporal( file: FileUpload, userId: string ) {

        // Crear carpetas
        const path = this.crearCarpetaUsuario( userId );

        // Nombre archivo
        // Le paso el nombre original del archivo a mi metodo de conversion de nombre
        const nombreArchivo = this.generarNombreUnico( file.name ); // Cuenado termina, tengo el nuevo nombre como return
        
    }

    private generarNombreUnico( nombreOriginal: string ) { // logo.png

        // Creo un arreglo apartir del nombre original del archivo, separando por .
        const nombreArr = nombreOriginal.split('.');

        // La extension es la ultima posicion del array
        const extension = nombreArr[ nombreArr.length -1 ];

        // Creo un id unico
        const idUnico = uniqid();

        // Devuelvo el nombre del archivo ya modificado
        return `${idUnico}.${extension}`;


    }

    
    
    private crearCarpetaUsuario( userId: string) {

        // Crear el path para la carpeta raiz del usuario
        // __dirname es el direcorio del proyecto , luego subo un nivel y me paro en upload y userId
        const pathUser = path.resolve( __dirname, '../uploads/', userId );
        
        // La carpeta temp, es el mismo path pero /temp
        const pathUserTemp = pathUser + '/temp/';
        console.log(pathUser);


        // Veo si existen los directorios
        const existe = fs.existsSync( pathUser );

        if(!existe) {
            
            // Creo los directorios si no existen
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        // Devuelvo la carpeta temp del usuario
        return pathUserTemp;
    }



}