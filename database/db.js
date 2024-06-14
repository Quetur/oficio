
import {createPool} from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config({path: './env/.env'})
// local
/*
export const pool = createPool({
    host: 'localhost',
    port: 3306,
    user : 'root',
    password: 'root',
    database: 'oficio'
});

*/

//base de datos de clever-cloud connection limit estaba en 2

export const pool = createPool({
    connectionLimit: process.env.DB_CONNECTIONLIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

//const mysql = require('mysql')


/*
const conexion = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    port :  process.env.DB_PORT,
})

conexion.connect( (error)=> {
    if(error){
        console.log('El error de conexión es: '+error)
        return
    }
    console.log('¡Conectado a la base de datos MySQL!')
})


module.exports = conexion


module.exports = {
    database : {
    connectionLimit: 250,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    port :  process.env.DB_PORT,
}
}
*/

// esto es con pool
