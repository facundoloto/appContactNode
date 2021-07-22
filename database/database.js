require('dotenv').config()
const mysql=require('mysql')
const util=require('util')//instalamos con npm util
//instanciamos la conexion a mysql
const conexion=mysql.createPool({ //crea un limite de conexion y cuando usamos query cierra automaticamente las conexiones
    connectionLimit : 20,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME 
    })
    conexion.Promise=global.Promise 
 



module.exports=conexion
