let Querys=require("../database/querys.js")
require('dotenv').config()
const bcrypt=require('bcryptjs')
require('../controller/upload')
const path=require('path')
let nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
user: 'pruebaDesarollo2120@gmail.com',
pass: 'pruebaDesarollo@_2120'
}
})

exports.usuario=async(err,req)=>{ 
try {
let sql='select*from usuario' 
req.send(await Querys.records(sql))
} catch (error) {
console.log(error)
}
}



exports.createUsuario=async(req,res)=>{
try {
const user=await Querys.records(`select*from usuario where email='${req.body.email}'`)
if(user.length<=0){
let nombre=req.body.user
let url=""
//este if evalua si hay un imagen que viene del cliente si no hay ninguna en la cosnulta se envia una url vacia
if(req.file==null){url=""}else{url=`/img/${req.file.filename}`} //url de la carpeta donde esta alojada las imagenes y req.filename obtiene el nombre del archivos que se sube
let email=req.body.email
let contraseña=req.body.password
let rounds=10
const encryptedPassword=await bcrypt.hash(contraseña,rounds)
let sql=`INSERT INTO usuario (nombre,img_profile,email,contraseña) VALUES ("${nombre}","${url}","${email}","${encryptedPassword}")` //importante declarar las consultas sin olvidar comillas no parentisis
await Querys.records(sql) 

let mailOptions = {
from: 'Remitente',
to:`${req.body.email}`,
subject: 'Login',
html : { path: "./email/index.html" }
};
transporter.sendMail(mailOptions, function(error, info){
if (error){
console.log(error);

} else {
console.log("Email sent");

}
});

res.send({status:200})


}
else{

res.send( {"status":"203"}) //este estado siginifica que se recibio los datos pero no se van a ejecutar,estos por que el email ya esta ocupado
}

} catch (error) {
console.log(error)
}
}

exports.searchUsuario=async(req,res)=>{ //para usar la funcions records de la clase querys hay que declaral como async la funcion donde se va invocar ya que retona una promesa y asinc la resuelve
try {
let email=req.body.email
let contraseña=req.body.contraseña
let errPass=false
let errEmail=false
console.log(email)

const user=await Querys.records(`select*from usuario where email='${email}'`) 
if(user.length == 0){
user.push({"errEmail":"false"})
res.send(user)
}

else{
const comparison=await bcrypt.compare(contraseña,user[0].contraseña)
if(comparison){
user.push({"errPass":"true"})//enviamos al array user este obj,va servir para validar contraseña si es correcta enviamos true
console.log(user[0].nombre)
res.send(user)
}

else{
user.push({"errPass":"false"})
res.send(user)
}

}
} catch (error) {
console.log(error)
}
}

exports.Usuario=async(req,res)=>{ //esta funcion se carga una vez que el usuario se logeo asi obtiene todos sus datos mediante el email que se guarda en el local storage
try {
let email=req.body.email
let contraseña=req.body.contraseña
console.log(email)
const user=await Querys.records(`select*from usuario where email='${email}'`) 
res.send(user)
}catch(err){console.log(err)}
}