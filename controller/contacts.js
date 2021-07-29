let Querys=require("../database/querys.js")
require('dotenv').config()
require('../controller/upload')
const path=require('path')
const fs = require('fs')
const { body } = require("express-validator")


exports.createContact=async(req,res)=>{ //para usar la funcions records de la clase querys hay que declaral como async la funcion donde se va invocar ya que retona una promesa y asinc la resuelve
try {
let nombre=req.body.user
let url_profile
if(req.file==null){ //si el usuario no sube imagen seteamos la url como vacia
url_profile=""    
}
else{
url_profile=`/img/${req.file.filename}` //url de la carpeta donde esta alojada las imagenes y req.filename obtiene el nombre del archivos que se sube
}

let email=req.body.email
let numero=req.body.number
let idUser=req.body.id
let sql=`insert into contactos (usuario,nombre,img_profile,email,numero) values("${idUser}","${nombre}","${url_profile}","${email}","${numero}")` //importante declarar las consultas sin olvidar comillas no parentisis
await Querys.records(sql) 
console.log(req.body)
let arr=[{"estado":"200"}]
res.send(arr)
} catch (error) {
console.log(error)
}
}


exports.contact=async(req,res)=>{ //esta funcion se carga una vez que el usuario se logeo asi obtiene todos sus datos mediante el email que se guarda en el local storage
try {
let id=req.params.id
const user=await Querys.records(`select contactos.id,contactos.nombre,contactos.img_profile,contactos.email,contactos.numero from contactos inner join usuario on usuario.id=contactos.usuario where contactos.usuario="${id}"`) 
res.send(user)
}catch(err){console.log(err)}
}

exports.idContact=async(req,res)=>{ //esta funcion se carga una vez que el usuario se logeo asi obtiene todos sus datos mediante el email que se guarda en el local storage
try {
let id=req.params.id
const user=await Querys.records(`select contactos.id,contactos.nombre,contactos.img_profile,contactos.email,contactos.numero from contactos inner join usuario on usuario.id=contactos.usuario where contactos.id="${id}"`) 
res.send(user)
}catch(err){console.log(err)}
}

exports.putContact=async(req,res)=>{
try{
if(req.file===undefined){ //si no hay imagen que actualizar 
console.log("file")
await Querys.records(`UPDATE contactos SET nombre='${req.body.user}',email='${req.body.email}',numero='${req.body.number}' where id='${req.params.id}'`)
res.send([{"estado":"200"}])
}
else 
{
if(req.body.url===undefined || req.body.url===""){ //si en la url de la imagen no hay nadie siginifica que el usuario no tiene foto de perfil por ende no hay nada que borrar en el servidor
let url=`/img/${req.file.filename}`
console.log(url)
await Querys.records(`UPDATE contactos SET nombre='${req.body.user}',email='${req.body.email}',numero='${req.body.number}',img_profile='${url}' where id='${req.params.id}'`)
res.send([{"estado":"200"}])
}
else{
//esto se ejecuta si ya hay una imagen en el contacto y quiere actualizar por otro,primero borramos la anterior del servidor y despues cargamos la ruta de la nueva imagen en la base de datos
let url_img="./public"+req.body.url
fs.unlinkSync(url_img)//url solo contiene la ruta antigua de la imagen para eliminarla
console.log('File removed')
/*let url=`localhost:8080/files/${req.file.filename}`//url de la imagen 
var URLdomain = window.location.host;*/
let url=`/img/${req.file.filename}` //esto sirve para la ruta de la carpeta donde estan las img
console.log(url)
await Querys.records(`UPDATE contactos SET nombre='${req.body.user}',email='${req.body.email}',numero='${req.body.number}',img_profile='${url}' where id='${req.params.id}'`)
res.send([{"estado":"200"}])
}

}

}
catch(err){console.log(err)}
}

exports.deleteContact=async(req,res)=>{
try{
await Querys.records(`DELETE FROM contactos WHERE id='${req.params.id}'`)
   
if(req.body.url==="" || req.body.url===undefined){
}
else{
let url_img="./public"+req.body.url
fs.unlinkSync(url_img)//url solo contiene la ruta antigua de la imagen para eliminarla
console.log('File removed')
}

res.send([{"estado":"200"}])
}
catch(err){console.log(err)}
}

exports.deleteImg=async(req,res)=>{
console.log(req.params.id)
console.log(req.body.url)
try{

let url_img="./public"+req.body.url
fs.unlinkSync(url_img)//url solo contiene la ruta antigua de la imagen para eliminarla
console.log('File removed')
let url=""//guardamos la url en la base de datos para que este vacia y en el cliente verifique si hay una url si esta vacia como este caso que eliminamos la foto por defecto se agrega una imagen de perfil
let user=await Querys.records(`UPDATE contactos SET img_profile='${url}' where id='${req.params.id}'`)
console.log(user)
res.send([{"estado":"200"}])
}
catch(err){console.log(err)}
}




