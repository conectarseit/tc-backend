import { Router, Response, Request } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';


const postRoutes = Router();
const fileSystem = new FileSystem();

// Obtener Post paginados
postRoutes.get('/', async (req:any , res: Response) =>{

    
    // Metodo para paginar, recibiendo la pagina por la url
    let pagina = Number(req.query.pagina) || 1 ;
    let skip = pagina -1;
    skip = skip * 10;
    
    const posts = await Post.find() // Busca todos los posts en la base de datos
                            .sort({_id: -1}) // Ordena de mayor a menor los posteos por su id
                            .skip( skip ) // Metodo para evitar la cantidad deseada de registros
                            .limit(10) // Limita la consulta a solo traer 10 registros
                            .populate('usuario', '-password') // Le suma a la respuesta la info del usuario, pero no la passowrd
                            .exec()
                            
    
    
   
    
    res.json({
        ok: true,
        pagina,
        posts
    })




});


// Crear Post
postRoutes.post('/', [verificaToken], (req:any , res: Response) =>{

    // Extraigo el body
    const body = req.body;

    // tomo el id del usuario
    body.usuario = req.usuario._id;


    // Creo el post del usuario
    Post.create( body ).then( async postDB => {

        // De esta manera se mantiene la relacion entre el _id del usuario y los datos del mismo.
        // Lo que hace es traer todos los datos del modelo en lugar de solo el id
        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        });

    }).catch( err => {
        res.json(err);
    })




    

} )



// Servicio para subir archivos
postRoutes.post('/upload', [verificaToken], (req: any, res:Response) => {

    // Verifico si se selecciono una imagen
    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    // tomo esa imagen y la asigno a la const file
    const file: FileUpload = req.files.image;
    

    if(!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
    }

    // Verifico si es una imagen o no
    if(!file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - No es imagen'
        });
    }

    // Si todo esta bien la guardo en la carpeta temporal
    fileSystem.guardarImagenTemporal( file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype
        
    });



})






export default postRoutes;