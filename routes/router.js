import express from "express";
const router = express.Router();
import { pool } from "../database/db.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import multer from 'multer';
//import jimp from "jimp";
import path from "path" // lo pide sharp-multer
import { fileURLToPath } from 'url';
import s3Storage from 'multer-sharp-s3';

import dotenv from 'dotenv'
dotenv.config({path: './env/.env'})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname", __dirname)
console.log("region",  process.env.REGION)
import fs  from 'fs';

import {
  login,
  salir,
  recuperoUSR,
  listado,
  listado2,
  listado3, 
  listado4,
  listado5,
  listado6,
  listado7,
  listado8,
  listado9,
  listado10,
  listado11,
  listado12,
  archivo,
  home,
} from "../controllers/authController.js";

import {
  getdata,
  chequeo_dni,
  usuario_nuevo,
  usuario_modi,
  sendmail,
  blanquear,
  nuevopassword,
  newcomment,
  nuevocomentario,
} from "../controllers/regController.js";

 
// configuro s3
import aws from 'aws-sdk';
aws.config.update({
  secretAccessKey: process.env.SECRETACCESSKEY,
  accessKeyId: process.env.ACCESSKEYID,
  region: process.env.REGION
});

const s3 = new aws.S3();
// termino de configurar s3




// en home no me interesa si esta autenticado isAuthenticated
router.get("/home", async (req, res) => {
  console.log("router /home");
 // res.render("lista10",{ user: null}); // este anda
  
  try {
    /*const [results] = await pool.query(
      "SELECT u.dni as dni, x.nombre, x.apellido, x.calificacion, x.celular, l.descripcion as localidad, GROUP_CONCAT(DISTINCT o.descripcion SEPARATOR ' - ') as oficio from usuario_oficio u INNER JOIN oficio o on u.id_oficio = o.id_oficio INNER JOIN usuario x on x.dni = u.dni INNER JOIN localidad l on l.id_localidad = x.id_localidad GROUP by u.dni;"
    );
    console.log("usuarios ", results.length);
      */
    console.log("resultados de req.cookies.jwt", req.cookies.jwt);

    if (req.cookies.jwt!=undefined) {
      console.log("tiene cookies")
      try {
        req.user = await estalogueado(req.cookies.jwt);
        console.log("req.usr ", req.user);
        if (req.user) {
          console.log("existe user router/home");
          res.render("lista13",{ user: req.user});
          //res.render("lista10",{ user: req.user});
          //res.render("home", { registro: results, user: req.user });
        } else {
          console.log("NO esta adentro router/home");
          //res.render("home", { registro: results, user: false });
          res.render("lista13",{ user: false});
        }
      } catch (error) {
        console.log(error);
      }
    }
    else {
      console.log("no tiene cookies") 
      //res.render("lista10",{ user: false});
      res.render("lista14",{ user: false});
      //res.render("home", { registro: results, user: false });
    }

    //console.log("usuario registrado", req.user.nombre )
  } catch (error) {
    {
      console.log(error);
    }
  } 
  
});

function validateToken(req, res, next) {
  console.log("validate token");
  const { user } = req.body;
  /*
  const accessToken = req.headers['autorization']
  if(!accessToken) {
    res.send('acceso denegado')
  }

*/
}

router.get("/listado12", (req, res) => {
  res.render("lista12",{});
})

router.get("/listado10", (req, res) => {
  res.render("lista10",{});
})


router.get("/archivo", (req, res) => {
  res.render("formarchivo",{});
})

// mostrar todos los usuarios
router.get('/api/usuarios/:id',async (req,res)=>{
  console.log("entro en api/usuarios",  [req.params.id] )
  try {
    const [filas] = await pool.query("SELECT u.dni as dni, x.nombre,  x.apellido, x.calificacion, x.celular, x.codigopostal, x.imagen, l.descripcion as localidad, p.descripcion as provincia, GROUP_CONCAT(DISTINCT o.descripcion SEPARATOR ' - ') as oficio,  x.presentacion from usuario_oficio u INNER JOIN oficio o on u.id_oficio = o.id_oficio INNER JOIN usuario x on x.dni = u.dni INNER JOIN localidad l on l.id_localidad = x.id_localidad INNER JOIN provincia p on p.id_provincia = x.id_provincia where ? GROUP by u.dni order by x.nombre, x.apellido ;", [req.params.id]);
    console.log("usuarios", filas.length);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})

router.get('/vercard/:id',async (req,res)=>{
  console.log("entro en vercard",  [req.params.id] )
  try {
    const [usuario] = await pool.query("SELECT u.dni as dni, x.nombre,  x.calle, x.numero, x.apellido, x.calificacion, x.celular, x.codigopostal, x.imagen, l.descripcion as localidad, p.descripcion as provincia, GROUP_CONCAT(DISTINCT o.descripcion SEPARATOR ' - ') as oficio,  x.presentacion from usuario_oficio u INNER JOIN oficio o on u.id_oficio = o.id_oficio INNER JOIN usuario x on x.dni = u.dni INNER JOIN localidad l on l.id_localidad = x.id_localidad INNER JOIN provincia p on p.id_provincia = x.id_provincia where u.dni = ? GROUP by u.dni order by x.nombre, x.apellido ;", [req.params.id])
    //SELECT x.dni, x.nombre, x.apellido, x.calle, x.numero, l.descripcion as loc, l.id_localidad as id_localidad, p.descripcion as provincia, l.id_localidad as id_provincia, x.imagen, x.celular, x.presentacion FROM usuario x INNER JOIN localidad l on x.id_localidad = l.id_localidad INNER JOIN provincia p on x.id_provincia = p.id_provincia where x.dni= ? ;",[req.params.id]);
    console.log("usuarios", usuario.length);
    console.log("usuario", usuario)
    
    // res.render('vercard', {  usuario});

    try {
      const [califica] = await pool.query("SELECT * FROM calificacion where id_usuarioDestino = ?  ORDER BY fecha_creacion DESC ;", [req.params.id])
      //SELECT x.dni, x.nombre, x.apellido, x.calle, x.numero, l.descripcion as loc, l.id_localidad as id_localidad, p.descripcion as provincia, l.id_localidad as id_provincia, x.imagen, x.celular, x.presentacion FROM usuario x INNER JOIN localidad l on x.id_localidad = l.id_localidad INNER JOIN provincia p on x.id_provincia = p.id_provincia where x.dni= ? ;",[req.params.id]);
      console.log("calificaciones", califica.length);
      console.log("calificacion", califica)
     // res.send(califica, usuario);
     try {
      const [resultado_promedio] = await pool.query("SELECT truncate(AVG(calificacion),2) as promedio FROM calificacion where id_usuarioDestino = ?;", [req.params.id])
      console.log("promedio", resultado_promedio[0].promedio)
      res.render('vercard', { usuario, califica, largo_cali: califica.length, promedio: resultado_promedio[0].promedio });
     } catch (error) {
      {
        console.log(error);
      }
     }

    } catch (error) {
      {
        console.log(error);
      }
    }

  } catch (error) {
    {
      console.log(error);
    }
  }
})

router.get('/api/calificacion/:id',async (req,res)=>{
  console.log("entro en vercard calificacion",  [req.params.id] )
  try {
    const [califica] = await pool.query("SELECT * FROM `calificacion` where id_usuarioDestino = ?;", [req.params.id])
    //SELECT x.dni, x.nombre, x.apellido, x.calle, x.numero, l.descripcion as loc, l.id_localidad as id_localidad, p.descripcion as provincia, l.id_localidad as id_provincia, x.imagen, x.celular, x.presentacion FROM usuario x INNER JOIN localidad l on x.id_localidad = l.id_localidad INNER JOIN provincia p on x.id_provincia = p.id_provincia where x.dni= ? ;",[req.params.id]);
    console.log("calificaciones", califica.length);
    console.log("calificacion", califica)
    res.send(califica);
  } catch (error) {
    {
      console.log(error);
    }
  }
})

// mostrar solo las provincias ue tienen usuario
router.get('/api/provincias',async (req,res)=>{
  console.log("entro en api/provincia")
  try {
    const [filas] = await pool.query("SELECT DISTINCT p.descripcion as prov, p.id_provincia as id_provincia, p.descripcion as descripcion, p.id_provincia as cod FROM usuario x INNER JOIN provincia p on x.id_provincia = p.id_provincia;");
    console.log("provincias", filas.length);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})


// mostrar solo las localidades ue tienen usuario
router.get('/api/localidades',async (req,res)=>{
  console.log("entro en api/localidades")
  try {
    const [filas] = await pool.query("SELECT DISTINCT p.descripcion as loc, p.id_localidad as id_localidad, p.descripcion as descripcion, p.id_localidad as cod FROM usuario x INNER JOIN localidad p on x.id_localidad = p.id_localidad;");
    console.log("localidad", filas.length);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})

// mostrar solo las localidades ue tienen usuario
router.get('/api/oficios',async (req,res)=>{
  console.log("entro en api/oficios")
  try {
    const [filas] = await pool.query("SELECT DISTINCT  p.id_oficio as cod, o.descripcion as descripcion FROM usuario_oficio p INNER JOIN usuario u on u.dni = p.dni INNER JOIN oficio o on o.id_oficio = p.id_oficio order by o.descripcion;");
    console.log("oficios ->", filas.length);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})

router.get('/api/localidades/:id',async (req,res)=>{
  console.log("entro en api/localidades/id", [req.params.id])
  try {
    const [filas] = await pool.query("SELECT DISTINCT p.descripcion as loc, p.id_localidad as id_localidad, p.descripcion as descripcion, p.id_localidad as cod FROM usuario x INNER JOIN localidad p on x.id_localidad = p.id_localidad where id_provincia = ?;",[req.params.id]);
    console.log("localidad", filas.length);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})

router.get('/api/usuario/:id' , async (req,res) => {
  console.log("entro en api/usuario/", [req.params.id])
  try {
    const [filas] = await pool.query("SELECT * from usuario where dni=?",[req.params.id] );
    console.log("usuarios", filas[0]);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})


//mostrar todos los paises
router.get('/api/paises',async (req,res)=>{
  console.log("entro en api/paises")
  try {
    const [filas] = await pool.query("SELECT * FROM pais");
    console.log("paises ", filas[0]);
    res.send(filas);
  } catch (error) {
    {
      console.log(error);
    }
  }
})


router.get("/login", (req, res) => {
  console.log("ejecuto login router");
  console.log("req.user", req.user);
  if (req.user) {
    res.render("login", { alert: false, user: req.user[0] });
  } else {
    res.render("login", { alert: false, user: false });
  }
});

router.get("/contacto", (req, res) => {
  console.log("ejecuto contacto router");
  console.log("req.user", req.user);
  if (req.user) {
    res.render("contacto", { alert: false, user: req.user[0] });
  } else {
    res.render("contacto", { alert: false, user: false });
  }
});

router.get("/acercade", (req, res) => {
  console.log("ejecuto acercade router");
  console.log("req.user", req.user);
  if (req.user) {
    res.render("acercade", { alert: false, user: req.user[0] });
  } else {
    res.render("acercade", { alert: false, user: false });
  }
});



router.get("/registro_ok", async (req, res) => {
  console.log("paso por router");
  res.render("registro_ok"); // anda bien

  console.log("pasa nuevamente");
  // window.location = "registro_ok";// no anda
  if (req.user) {
    console.log("esta adentro");
    res.render("/home", { user: req.user });
  } else {
    console.log("NO esta adentro /registro_ok");
    res.render("/home", { user: null });
  }
});



router.get("/editar/:id", async (req, res) => {
  const dniUSR = req.params.id
  console.log("editar : ", dniUSR);
  try {
    const paises = await pool.query("SELECT * FROM pais");
    console.log("paises", paises[0]);
    console.log("modifica 1 usuario ->", dniUSR)
    try {
      const cat = await pool.query("SELECT * FROM categoria");
      console.log("caterias ", cat[0]);
      console.log("modifica 2 usuario ->", dniUSR)
      let user = {dni: dniUSR }
      res.render("user_modi", { title: "Express", pais_data: paises[0], categoria_data: cat[0], alert: false, user});
      }
     catch (error) {
      {
        console.log(error);
      }
    }
  } catch (error) {
    {
      console.log(error);
    }
  }
});


async function paises(){
try {
  const results = await pool.query("SELECT * FROM pais");
  console.log("funcion paises ", results[0]);
  return results[0]
}     catch (error) {  console.log(error)}
}


router.get("/register", async (req, res) => {
  console.log("register");
  try {
    const paises = await pool.query("SELECT * FROM pais order by descripcion");
    console.log("paises", paises[0]);
    try {
      const cat = await pool.query("SELECT * FROM categoria");
      console.log("caterias ", cat[0]);
      if (req.user) {
        res.render("user_nuevo", {
          title: "Express",
          pais_data: paises[0],
          categoria_data: cat[0],
          alert: false,
          user: req.user[0],
        });
      } else {
        res.render("user_nuevo", {
          title: "Express",
          pais_data: paises[0],
          categoria_data: cat[0],
          alert: false,
          user: null,
        });
      }
    } catch (error) { { console.log(error) } }
  } catch (error) { { console.log(error) } }
});

router.get("/terminos", async (req, res) => {
  console.log("terminos y condiciones");
  res.render("terminos");
});


router.get("/olvidoPass", async (req, res) => {
  console.log("olvido password");
  res.render("olvidoPass",{ alert: false, user: false });
  //res.render("login", { alert: false, user: false });
});


//formulario de blanqueo se ejecuta desde el mail
router.get('/blanqueo/:id' , async (req,res) => {
 let dniencrypt = req.params.id
  console.log("blanqueo",  dniencrypt)
  res.render("blanquear",{ alert: false, user: dniencrypt });
})

/*
router.post('/nuevopassword' , async (req,res) => {
  let dni = req.params.id
   console.log("blanqueo",  dni)
  
 })
*/


//router para los métodos del controller
router.post("/login", login);
router.get("/salir", salir);
router.get("/", home);
router.get("/home", home);
//router.get("/register", regController.resgister);

//router.post("/usuario_nuevo",  usuario_nuevo); // lo traigo desde regController 
router.post("/usuario_modi", usuario_modi);
router.post("/archivo", archivo);
router.get("/get_data", getdata); // trae datos de provincia,localidad,oficio
router.get("/chequeo_dni", chequeo_dni);
router.get("/listado", listado);
router.get("/listado3", listado3);
router.get("/listado4", listado4);
router.get("/listado5", listado5);
router.post("/sendmail", sendmail);
router.post("/nuevopassword", nuevopassword); 
router.post("/new_comment", newcomment); 
router.post("/grabarcalificacion", nuevocomentario); 


//  router.get("/api/usuarios", api_usuarios); // lista los usuarios



async function estalogueado(caracteres) {
  console.log("router estalogueado()",process.env.JWT_SECRETO)
  console.log("caraceres a decodificar ", caracteres);
  try {
    const decodificada = await promisify(jwt.verify)(
      caracteres,
      process.env.JWT_SECRETO
    );
    console.log("decodificada para usuario: ", decodificada.id);
    //console.log("req", req)

    try {
      const [pp] = await pool.query("SELECT * FROM usuario WHERE dni = ?", [
        decodificada.id,
      ]);
     

      return pp[0];
    } catch (error) {
      console.log("el error es", error);
    }

    return;
  } catch (error) {
    console.log("el error es 2",error);

    return ;
  }
}
//module.exports = router;

function grabarlocalstorage(dni, nombre) {
  console.log("entro en grabarlocalstorage", dni, " ", nombre)
  localStorage.clear();
  let usr =''
  let lin =`{"dni": "` + dni +`", "nombre": "` + nombre + `"}`;
  localStorage.setItem('usr', JSON.stringify(lin));
    //document.getElementById('items').value = productos.length;
}





//initializing multer
// antes
/*
//Setting storage engine
const storageEngine = multer.diskStorage({

  destination: "./public/file_user",
  filename: (req, file, cb) => {
    console.log("archivo", file)
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  
});
*/

// multer con sharpMulter
// this create a path like './uploads/'
const uploadsDir = path.resolve(__dirname, "./public/file_user");
console.log("uploadsDir : ", uploadsDir)
// sharpmulter
/*
const storage =  
 sharpMulter ({
              destination: uploadsDir,
              imageOptions:{
              fileFormat: "jpg",
              quality: 80,
              resize: { width: 500, height: 500 },

                 }
           });

const upload  =  multer({ storage });
*/


// *****

/* pora ahora saco el filtro
fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
*/



/* creo que esto no se usa 12/06/24 9:23
router.post("/graba_archivo_ok", upload.single("image"), (req, res) => {
  console.log("/graba_archivo_ok", req.file)
  console.log("/graba_archivo_ok", req.file.filename)

  if (req.file) {
    res.send("Single file uploaded successfully");
  } else {
    res.status(400).send("Please upload a valid image");
  }
});

router.post("/graba_archivo", upload.single("image"), (req, res) => {
  console.log("graba_archivo 0",req.body)
  console.log("graba_archivo 1", req.file)
  console.log("graba_archivo 2", req.file.filename)
  console.log("presntacion", req.body.presentacion)
  
  if (req.file) {
    res.send("Single file uploaded successfully");
  } else {
    res.status(400).send("Please upload a valid image");
  }
});





// reglas de filtrado de archivos
const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

router.post("/single", upload.single("image"), (req, res) => {
  if (req.file) {
    res.send("Single file uploaded successfully");
  } else {
    res.status(400).send("Please upload a valid image");
  }
});

*/



const storageStrategy = multer.memoryStorage()
// ahora ya tenemos el contenido del archivo en memoria
const upload = multer({storage: storageStrategy })

const storage2 = s3Storage({
  s3,
  Bucket: 'oficio',
  Key: function (req, file, cb) {
      console.log(file);
      cb(null, `${Date.now().toString()}_${file.originalname}`)},

  acl: 'public-read',
  // resize or any sharp options will ignore when uploading non image file type
  resize: {
    width: 300,
    height: 300,
  },
})


const upload2 = multer({ storage: storage2 });


router.post("/new_user", upload2.single("image"), async (req, res) => {
  console.log("/new_user",req.body)
  const imagen = req.file

  console.log("imagen 1:", imagen)

  // const destination = "./public/file_user/"
  //const filename = `${Date.now()}_${imagen.originalname}`


// le paso el buffer de la imagen
    // una vez que le pasamos el bufer ejecutamos un metodo de sharp resize
    /*
    const processimagen =  sharp(imagen.buffer)
    console.log(processimagen)
    const resizeprocessimagen = processimagen.resize(250,250, {
        fit:'contain',
        background:"#FFF"
    })
    console.log(resizeprocessimagen)
    const resizeprocessimagenBuffer = await resizeprocessimagen.toBuffer()
    console.log("buffer", resizeprocessimagenBuffer)
    //res.send({ resizeimage: resizeprocessimagenBuffer })
    fs.writeFileSync(destination+filename, resizeprocessimagenBuffer )
    */
      // le paso el buffer de la imagen
    // una vez que le pasamos el bufer ejecutamos un metodo de jimp resize

/* esto se usa con jimp
    const processimagen = await jimp.read(imagen.buffer)
    console.log("processimagen :", processimagen)
    const resizeprocessimagen = processimagen.resize(250,250)
    console.log("resizeprocessimagen :", resizeprocessimagen)
    // resizeprocessimagen.quality(24)
    resizeprocessimagen.getBuffer(jimp.MIME_PNG, (err, buffer) => {
        console.log("buffer",buffer);
        fs.writeFileSync(destination+filename, buffer )
      });
*/
  //console.log(eeeee)
  let tienearchivo = false;
  console.log("tiene archivo ?", req.file)
  const filename = req.file.Key
  if (req.file){
    tienearchivo = true
    console.log("graba_archivo 1", req.file)
     console.log("graba_archivo 2", filename)
  
  }

  const pp = await usuario_nuevo(req, tienearchivo, filename)
  console.log("pp", pp.nombre, pp.dni, pp.pass, pp.apellido)

let alertmesagge = "Felicidades " + pp.nombre
  res.render("login",{   alert: true,
    alertTitle: "¡Ya Tenes usario !",
    alertMessage: alertmesagge ,
    alertIcon: "success",
    showConfirmButton: false,
    timer: 2000,
    ruta: "home",
    user: pp.nombre, dni: pp.dni, pass: pp.pass, apellido: pp.apellido})

});


router.post("/enviosugerencia", (req, res) => {
 // console.log("users", process.env.MAIL_USER)
 // console.log("pass", process.env.MAIL_PASS)
  console.log("envio sugerencia")
  
  const celular = req.body.celular;
  const nombre = req.body.nombre;
  const correo = req.body.email;
  const mensaje = req.body.mensaje;
  console.log(" Nombre : ", nombre,"celular : ",celular, " email : ", correo , " mensaje :", mensaje)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user:  process.env.MAIL_USER, //sendgrid
      pass:  process.env.MAIL_PASS // Gmail password
    }
  });
  //console.log(transporter);

  var encabezado = ``
  let cuerpo = ``
  let pie = ``
encabezado = `
<ul>
<a>Hola ${nombre}, </a>
<a>hemos recibido el siguiente pedido de sugerencia</a><br>

<a> ${mensaje}, </a>
<a></a><br><br>
<a> Celular : </a><br>${celular}<br>

<a></a><br><br>
<a> Si no fuiste vos ignora este mensaje</a><br><br>
<a>Muchas Gracias</a><br>
<a>No Respondas este mensaje</a><br>
</ul>`

cuerpo =  ``
pie = ``

  let contentHTML = encabezado + cuerpo + pie;

   console.log("contenido del html", contentHTML)
  const mailOptions = {
    from: "administracion@mercadooficio.com.ar",
    bcc: "jrosavila@gmail.com",
    to: correo,
    cc:"mercadooficio@gmail.com",
    subject: "Solicitud de sugerencia - Mercado Oficio",
    text: "",
    html: contentHTML,
  };

    transporter.sendMail(mailOptions,(err, info) => {
    if(err){
       console.log(err.message)
       res.status(500)
       res.send(err.message)
    }else{
       res.status(200)
       console.log('Email sent')
       //res.send(`Email sent`)
       

       res.render("olvidoPass",{   alert: true,
        alertTitle: "Email correcto",
        alertMessage: "¡se envio Correo!",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 2000,
        ruta: "home", user: false, dni: false, pass: false})

      // res.redirect("/");
    }
    })
 })
  

export default router;
