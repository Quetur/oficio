//const conexion = require("../database/db");
//const bcryptjs = require("bcryptjs");
import bcryptjs from "bcryptjs";
//const pool = require("../database/database.js");
import { pool } from '../database/db.js';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




export const getdata = async (request, response, next) => {
  var type = request.query.type;
  console.log("tipo", type);
  var linea = "";
  var search_query = request.query.parent_value;
  console.log("data2", search_query);

  if (type == "load_provincia") {
    console.log("load_provincia");
    linea = `SELECT descripcion AS Data, id_provincia as Cod from provincia WHERE pais = '${search_query}' order by orden`;
  }

  if (type == "load_localidad") {
    console.log("load_localidad", search_query);
    linea = `SELECT descripcion AS Data, id_localidad as Cod, lati, longi  FROM localidad WHERE provincia = '${search_query}' order by descripcion`;
  }

  if (type == "load_oficio") {
    console.log("load_oficio", search_query);
    linea = `SELECT descripcion AS Data, id_oficio as Cod  FROM oficio WHERE id_categoria = '${search_query}' order by descripcion`;
  }

  console.log("linea2", linea);
  //const data = await pool.query(linea);
  try {
    const [result] = await pool.query(linea)
    console.log("lista " , result[0])
    const rows = result[0]
    console.log(" rows", rows)
    var data_arr = [];

    result.forEach(function (row) {
      //console.log("row.Data",row.Data, row.Cod)
      //data_arr.push('descripcion:' row.Data );
      //cod_arr.push(row.Cod)
      //console.log("data_arr",row.Data, row.Cod)
      // ant  let lin = `{"cod": "` + row.Cod + `", "descripcion": "` + row.Data + `"}`; 
      let lin = `{"cod": "` + row.Cod + `", "descripcion": "` + row.Data + `", "lati": "` + row.lati +`", "longi": "` + row.longi + `"}`;
      //console.log("lin ",lin)
      let obj = JSON.parse(lin);
      //console.log("obj", obj)
      data_arr.push(obj);
    });
    response.json(data_arr);
  } catch (error) {
    {console.log(error)} 
  }
  
  //, function (error, data) {
    


}  

export const chequeo_dni = async (request, response, next) => {
  var dni = request.query.dni;
  console.log("controler chequeo dni ", dni);
  try {
    const [results]  = await pool.query(`SELECT * FROM usuario WHERE dni = ?`, dni);
    console.log ("cantidad de resultados", results.length)
    console.log("encontro", results[0].dni)
    let registro = results[0]
    if (results.length=0) {
       console.log("no hay dni");
       return next();
    } 
    else {
      console.log("registro", registro)
      console.log("duplicado", registro.dni, registro.nombre);
      let lin =`{"dni": "` +
            registro.dni +
            `", "nombre": "` +
            registro.nombre +
            `"}`;
          let obj = JSON.parse(lin);
          console.log(obj);
          response.json(obj);
    }
  }
  catch (error) {
    console.log(error);
  }
}


//procedimiento para  usuarios nuevo
export const  usuario_nuevo = async (req, tienearchivo, filename) => {

  console.log("usuario_nuevo dentro de regControler");
  console.log("tienearchivo",tienearchivo)
  const user = req.body.user;
  console.log("upresentacion", req.body.presentacion)
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const calle = req.body.calle;
  const numero = req.body.numero;
  const localidad = req.body.cod_localidad;
  const provincia = req.body.cod_provincia;
  const pais = req.body.cod_pais;
  const codigopostal = req.body.codigopostal;
  const lati = req.body.lati;
  const longi = req.body.longi;
  const dni = req.body.dni;
  const celular = req.body.celular;
  const email = req.body.email;
  const categoria = req.body.categoria;
  const oficio = req.body.oficio;
  const presentacion = req.body.presentacion;
  const pass = req.body.password;
  let img = "user.png";
  if (tienearchivo){img = filename;}
  const califi = '1';
  var date;
  console.log("img", img )
  date = new Date();
  date =
    date.getUTCFullYear() +
    "-" +
    ("00" + (date.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getUTCDate()).slice(-2) +
    " " +
    ("00" + date.getUTCHours()).slice(-2) +
    ":" +
    ("00" + date.getUTCMinutes()).slice(-2) +
    ":" +
    ("00" + date.getUTCSeconds()).slice(-2);
  const fecha_creacion = date
  console.log("Fecha de creacion", fecha_creacion);
  console.log("name: ", nombre);
  console.log("oficios", oficio);
  //console.log(eeee);

  let passHash = await bcryptjs.hash(pass, 8);
  //console.log(passHash);
  //console.log(celular);
  let registro = await pool.query("INSERT INTO usuario SET ?", {
    nombre: nombre,
    apellido: apellido,
    calle: calle,
    numero: numero,
    id_localidad: localidad,
    id_provincia: provincia,
    id_pais: pais,
    codigopostal: codigopostal,
    latitud: lati,
    longitud: longi,
    dni: dni,
    celular: celular,
    email: email,
    id_categoria: categoria,
    calificacion: califi,
    fecha_creacion: fecha_creacion,
    presentacion: presentacion,
    pass: passHash,
    imagen: img,
  });

  console.log("carga ok", dni, registro);
  console.log("total de oficios", oficio.length);
  for (let i = 0; i < oficio.length; i++) {
    let usuario_oficio = dni + oficio[i];
    console.log("usuariooficio ->", usuario_oficio);
    console.log("grabando, ", usuario_oficio);
    let registro = await pool.query("INSERT INTO usuario_oficio SET ?", {
      dni: dni,
      id_oficio: oficio[i],
    });
  }
  console.log("termin ok");
 return {nombre,dni, pass }
  //res.redirect("/registro_ok");
/*
  let alertmesagge = "Felicidades "+nombre
  res.render("login",{   alert: true,
    alertTitle: "¡Ya Tenes usario !",
    alertMessage: alertmesagge ,
    alertIcon: "success",
    showConfirmButton: false,
    timer: 2000,
    ruta: "home", user: nombre, dni: dni})
    */
};

// procedimiento para regrabar usuario existente
export const  usuario_modi = async (req, res) => {
  console.log("paso a modificar");
  const user = req.body.user;
  const nombre = req.body.mnombre; // le tuve que cambian nombre a mnombre porque se confundian las variable de nombre en el menu
  const apellido = req.body.apellido;
  const calle = req.body.calle;
  const numero = req.body.numero;
  const localidad = req.body.localidad;
  const provincia = req.body.provincia;
  const pais = req.body.pais;
  const codigopostal = req.body.codigopostal;
  const dni = req.body.dni;
  const celular = req.body.celular;
  const email = req.body.email;
  const categoria = req.body.categoria;
  const oficio = req.body.oficio;
  const presentacion = req.body.presentacion;
  const pass = req.body.password;
  const img = "logo3.png";
  const califi = '';

  console.log("cambia name: ", nombre);
  console.log("cambia oficios", oficio);
  console.log("cambia dni", dni);

  let passHash = await bcryptjs.hash(pass, 8);
  //console.log(passHash);
  //console.log(celular);
   let registro = await pool.query("UPDATE usuario SET ? WHERE dni = ? ",[{
    nombre: nombre,
    apellido: apellido,
    calle: calle,
    numero: numero,
    id_localidad: localidad,
    id_provincia: provincia,
    id_pais: pais,
    codigopostal: codigopostal,
    celular: celular,
    email: email,
    id_categoria: categoria,
    calificacion: califi,
    presentacion: presentacion,
    pass: passHash,
},dni]);

  console.log("carga ok", dni, registro);
  console.log("total de oficios", oficio.length);
  //DELETE FROM `usuario_oficio` WHERE `dni` = ?;
  let borro = await pool.query("DELETE FROM `usuario_oficio` WHERE `dni` = ?", [dni])
  console.log("borro ", borro)
  for (let i = 0; i < oficio.length; i++) {
    let usuario_oficio = dni + oficio[i];
    console.log("usuario oficio ->", usuario_oficio);
    console.log("grabando, ", usuario_oficio);
    let registro = await pool.query("INSERT INTO usuario_oficio SET ?", {
      dni: dni,
      id_oficio: oficio[i],
    });
  }
  console.log("termin ok");
  //res.redirect("/");
  //res.redirect("/registro_ok");
  let alertmesagge = "Gracias "+nombre
 res.render("login",{   alert: true,
    alertTitle: "¡Se grabo Correco!",
    alertMessage: alertmesagge ,
    alertIcon: "success",
    showConfirmButton: false,
    timer: 2000,
    ruta: "home", user: nombre, dni: dni})
  // res.render('registro_ok');*/
};

export const  sendmail = async (req, res) => {
  console.log("sendmail")
  let dni = req.body.dni;
  const nombre = req.body.mnombre;
  const correo = req.body.email;
  console.log(" dni : ", dni,"nombre",nombre, " email : ", correo)
  //let dniencrypt = await bcryptjs.hash(dni, 8)
  //console.log("antes dniencript : ", dniencrypt)
  let dniencrypt =  toHex(dni)
  console.log("hex dniencript : ", dniencrypt)
  const link = "http://localhost:5000/blanqueo/"+dniencrypt 
  console.log("link", link)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user:  process.env.MAIL_USER, //sendgrid
      pass:  process.env.MAIL_PASS // Gmail password
    }
  }); s
  //console.log(transporter);

  var encabezado = ``
  let cuerpo = ``
  let pie = ``
encabezado = `
<ul>
<a>Hola ${nombre}, </a>
<a>hemos recibido un pedido de restauracion de contraseña</a><br>
<a>Si fuiste vos...Pulsa el link a continuacion</a><br>
<a></a><br><br>
<href>${link}</href><br>
<a></a><br><br>
<a> Si no fuiste vos ignora este mensaje</a><br><br>
<a>Muchas Gracias</a><br>
</ul>`

cuerpo =  ``
pie = ``

  let contentHTML = encabezado + cuerpo + pie;

   console.log("contenido del html", contentHTML)
  const mailOptions = {
    from: "tuoficiopersonal@gmail.com",
    cc: "",
    to: correo,
    subject: "Tu Oficio - Blanqueo de contraseña",
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
 }
  

 export const  blanquear = async (req, res) => {
  console.log("regcontroller blanqueo", req.params.id)
 }

 function toHex(str) {
  var result = '';
  for (var i=0; i<str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

// procedimiento para regrabar el password
export const  nuevopassword = async (req, res) => {
  const dni = req.body.mdni;

  console.log("nuevo password dni ->", dni);
  const pass = req.body.password;
  console.log("nuevo password de regcontroler", pass);
  let passHash = await bcryptjs.hash(pass, 8);
console.log("password", passHash)
   let registro = await pool.query("UPDATE usuario SET ? WHERE dni = ? ",[{
    pass: passHash,
},dni]);
  console.log("termin ok");
  res.redirect("/registro_ok");
  // res.render('registro_ok');
};


export const  newcomment = async (req, res) => {
  const dni = req.body.dni;
  console.log("new_coment", dni )
 
  try {
    const [results]  = await pool.query(`SELECT * FROM usuario WHERE dni = ?`, dni);
    console.log ("cantidad de resultados", results.length)
    console.log("encontro", results[0].dni)
    let usuario = results[0]
    if (results.length>0) {
      console.log("registro", usuario.dni, usuario.nombre);
      let lin =`{"dni": "` +
            usuario.dni +
            `", "nombre": "` +
            usuario.nombre +
            `"}`;
          let obj = JSON.parse(lin);
          console.log(obj);
          //response.json(obj);
          res.render("calificar",{ user: false, cierra: false, results});
    }
  }
    catch (error) {
      console.log(error);
    }
  }
 
  export const nuevocomentario = async (req, res) => {
    console.log("regControler nuevocomentario", req.body);
    const mprocesa = req.body.procesa;
    let results = []
    if (mprocesa=="true"){
      const mdnidestino = req.body.dnidestino;
      const muserorigen = req.body.nombre;
      const mdniorigen = req.body.dniorigen
      const mcali = req.body.cali;
      const mcomentario = req.body.presentacion;

      try {
        let registro = await pool.query("INSERT INTO calificacion SET ?", {
          id_usuarioOrigen: muserorigen,
          nombre_origen : muserorigen,
          id_usuarioDestino:mdnidestino,
          calificacion: mcali,
          nota: mcomentario,
          id_usuarioOrigen: mdniorigen
        });

        results [0] = {
          nombre:"",
          dni:""}
          console.log("results", results)
        console.log("registro ->",registro)
        let alertmesagge = "Gracias "
        try {
          console.log("usuario consultado", [req.body.dnidestino])
          const [prom_usr] = await pool.query("SELECT truncate(AVG(calificacion),1) as promedio FROM calificacion where id_usuarioDestino = ?;", [req.body.dnidestino])

          const mprom = prom_usr[0].promedio
          console.log("saque recien el promedio", mprom)
          
          try {
            let linea= "UPDATE `usuario` SET `calificacion` = '"+mprom+"' WHERE `usuario`.`dni` = "+[req.body.dnidestino]
            console.log("linea", linea)
            const prom_usr= await pool.query(linea)
            
            console.log("paso por aca")
            res.render("calificar",{   cierra: true, results , user : false, 
            alertTitle: "Su comentario",
            alertMessage: "¡Se grabo Correcto!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 2000,
            ruta: "", user: false, dni: false, pass: false})
          } catch (error) {
            console.log(error);
          }
  
        } 
        catch (error) {
          console.log(error);
        }
      
      

      }
        catch (error) {
          console.log(error);
        }
      }
      res.render("calificar",{   cierra: true, results , user : false, 
        alertTitle: "Su comentario",
        alertMessage: "Gracias",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 2000,
        ruta: "", user: false, dni: false, pass: false})
  }
  