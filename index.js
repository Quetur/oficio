if (process.env.NODE_ENV !== 'production'){
  //console.log("entrono = ", process.env.NODE_ENV)
} 

import dotenv from 'dotenv'
import express  from "express";

import cookieParser from 'cookie-parser'
//const exphbs = require('express-handlebars');
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//seteamos las variables de entorno
// solo para desarrollo muestro el entorno y las variables de entorno
if (process.env.NODE_ENV !== 'production'){
  console.log("entrono = ", process.env.NODE_ENV)
  console.log(dotenv.config({path: './env/.env'}))
} 

console.log("region",  process.env.REGION)

const app = express()

// seteo donde estan los views (jesus)
app.set('views', path.join(__dirname, 'views'));

//seteamos el motor de plantillas
app.set('view engine', 'ejs')

//app.engine('handlebars', exphbs.engine());
/*
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');
*/


//seteamos la carpeta public para archivos estáticos
//app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())



//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
//app.use('/', require('./routes/router'))

import router  from "./routes/router.js";
app.use("/", router);

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


// Leo archivo .env la variable PORT si no existe le pongo 3000
const PORT = process.env.PORT || 3000;

console.log("port", process.env.PORT)

app.listen(PORT, () => {
  console.log(`Server running on port: `, PORT);
});