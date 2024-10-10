//Importacion de librerias 


//Libreria encargada del servidor
const express = require('express');
const app = express();

//Libreria encargada de las cors
const cors = require("cors");

//Puerto en el que se abre la api
const port = 3000;

//Libreria encargada de la base de datos 
const mongoose = require('mongoose');

//Conexión de la base de datos 
mongoose.connect('mongodb://localhost/users')
    .then(() => console.log("Conexión con la base de datos hecha")).catch(err => console.log(err));

//Esquema que van a seguir mis objetos de mongoose
const esquemaUsuario = new mongoose.Schema({
    usuario: { type: String },
    pass: { type: String },
    dinero: { type: Number },
    partidasGanadas: { type: Number },
});

//Creacion del objeto de modelo y relacionado con el documento y base de datos
const Usuario = mongoose.model("Usuario", esquemaUsuario);

//Libreria de cors para que no de el error de cors
app.use(cors());
//Parseo de los elementos a json por seguridad
app.use(express.json());



//ruta que limpia la consola en ejecución
app.get("/clear", (req, res) => {

    console.clear();
});


//ruta encargada de obtener los datos de un jugador 
app.get("/obtieneDatosJugador", async (req, res) => {
    //Desestructuro los datos pasados por la url

    const { usuario, pass } = req.query;

    try{
        //método encarfado de hacer la busqueda de un usuario 
        const user = await Usuario.findOne({ usuario, pass });

        //Devuelve el usuario encontrado
        res.json(user);

    }catch(err){
        console.log(err);
    }
});

//Ruta que se encarga del inicio de sesión
app.post("/enviaDatos", async (req, res) => {
    //En este caso obtenemos los datos del cuerpo del mensaje no de la url de manera desestructurada
    const { usuario, pass } = req.body;

    try {
        //Busqueda de un usuario
        const user = await Usuario.findOne({ usuario });
        //Comprueba que el usuario haya introducido bien la contraseña
        if (user.pass == pass) {
            //Al acertar envía la solicitud con un código de aceptación
            res.status(200).send(user);

        }else{
            //Al fallar el código del estado es negativo
            res.status(401).send();
        }

    } catch (err) {

        console.log(err);
    }
});
//Ruta encargada de actualizar los datos 
app.put("/actualizaDatos", async (req, res) => {
    //Obtenemos los datos del cuerpo del html y los desesstructuramos
    const { usuario,dinero } = req.body;

    try {
        //Petición a la base de datos cual busca un registro modifica el dinero y lo implementa directamente en la base de datos
        const user = await Usuario.findOneAndUpdate({ usuario },{dinero},{new:true});
        
        //Devuelve un status afirmativo
        res.status(200).send(user);
       

    } catch (err) {

        console.log(err);
    }
});
//Ruta encargadad de crear usuarios
app.post("/creaJugador", async (req, res) => {

    //Obtiene del cuerpo de la solicitud una serie de atributos para guardarlos en la base de datos
    const { usuario, dinero, pass, partidasGanadas } = req.body;

    //Método para buscar un usuario
    const datos = await Usuario.findOne({ usuario });

    if (!datos) {
        //Creación de un objeto de usuario
        const guardarUsuario = new Usuario({
            usuario: usuario,
            dinero: dinero,
            pass: pass,
            partidasGanadas: partidasGanadas,

        });
        //Resuelve una promesa cual almacena en una variable y guarda el usuario
        const user = await guardarUsuario.save();
        //Manda una solicitud de aprobacion 
        res.status(200).send();
    }else{
        //Manda un codigo negativo para informar de su existencia
         res.status(409).send("El usuario ya existe");
    }
}

)
//método encargado de express para abrir el puerto e iniciar el servidor 
app.listen(port, () => console.log("Server iniciado"));