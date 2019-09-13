"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Obtener Post paginados
postRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Metodo para paginar, recibiendo la pagina por la url
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find() // Busca todos los posts en la base de datos
        .sort({ _id: -1 }) // Ordena de mayor a menor los posteos por su id
        .skip(skip) // Metodo para evitar la cantidad deseada de registros
        .limit(10) // Limita la consulta a solo traer 10 registros
        .populate('usuario', '-password') // Le suma a la respuesta la info del usuario, pero no la passowrd
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
// Crear Post
postRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    // Extraigo el body
    const body = req.body;
    // tomo el id del usuario
    body.usuario = req.usuario._id;
    // Creo el post del usuario
    post_model_1.Post.create(body).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        // De esta manera se mantiene la relacion entre el _id del usuario y los datos del mismo.
        // Lo que hace es traer todos los datos del modelo en lugar de solo el id
        yield postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Servicio para subir archivos
postRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => {
    // Verifico si se selecciono una imagen
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    // tomo esa imagen y la asigno a la const file
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
    }
    // Verifico si es una imagen o no
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - No es imagen'
        });
    }
    // Si todo esta bien la guardo en la carpeta temporal
    fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
});
exports.default = postRoutes;
