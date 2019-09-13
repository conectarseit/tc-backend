"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    guardarImagenTemporal(file, userId) {
        // Crear carpetas
        const path = this.crearCarpetaUsuario(userId);
        // Nombre archivo
        // Le paso el nombre original del archivo a mi metodo de conversion de nombre
        const nombreArchivo = this.generarNombreUnico(file.name); // Cuenado termina, tengo el nuevo nombre como return
    }
    generarNombreUnico(nombreOriginal) {
        // Creo un arreglo apartir del nombre original del archivo, separando por .
        const nombreArr = nombreOriginal.split('.');
        // La extension es la ultima posicion del array
        const extension = nombreArr[nombreArr.length - 1];
        // Creo un id unico
        const idUnico = uniqid_1.default();
        // Devuelvo el nombre del archivo ya modificado
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        // Crear el path para la carpeta raiz del usuario
        // __dirname es el direcorio del proyecto , luego subo un nivel y me paro en upload y userId
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        // La carpeta temp, es el mismo path pero /temp
        const pathUserTemp = pathUser + '/temp/';
        console.log(pathUser);
        // Veo si existen los directorios
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            // Creo los directorios si no existen
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        // Devuelvo la carpeta temp del usuario
        return pathUserTemp;
    }
}
exports.default = FileSystem;
