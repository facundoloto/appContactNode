let Querys=require("../database/querys.js")
require('dotenv').config()
require('../controller/upload')
const path=require('path')
const bcrypt=require('bcryptjs')
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
let nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
user: 'pruebaDesarollo2120@gmail.com',
pass: 'pruebaDesarollo@_2120'
}
})
exports.user=async(req,res)=>{
try{
let user=await Querys.records(`SELECT*FROM usuario WHERE id=${req.params.id}`)
res.send(user)
}
catch(err){console.log(err)}
}
exports.email=async(req,res)=>{


    let mailOptions = {
        from: 'Remitente',
        to:`${req.params.id}`,
        subject: 'Login',
        text: 'usted cambio el email de su cuenta en APPCONTACTS',
        html:await readFile('./email/email.html', 'utf8')
        }
        
        //envia email
        transporter.sendMail(mailOptions, function(error, info){if(error){console.log(error)}else{console.log("Email sent")}});  
    }
exports.editUser=async(req,res)=>{
try{
//este if elimina imagen antigua y reemplaze por la nueva
if(req.body.url===""){
    console.log(req.body.url)
}else
{
    let urlRemove="../img/"+req.body.url//estar atento a las rutas de las imagenes cuando se traiga la url de la imagen utilizar .slice(14) por ejemplo asi elimina los caracteres hasta obtener la ruta de la carpeta donde se colocan las imagenes
    console.log(urlRemove)
    fs.unlinkSync(urlRemove)//url solo contiene la ruta antigua de la imagen para eliminarla
    console.log('File removed')
}
const user=await Querys.records(`select*from usuario where email='${req.body.email}'`)
if(user.length<=0){ //Si no hay nada en user siginifica que el email no esta usado y se puede cambiar
let url=`/img/${req.file.filename}`
await Querys.records(`UPDATE usuario SET nombre="${req.body.user}",img_profile="${url}",email="${req.body.email}"  where id=${req.params.id}`)

let mailOptions = {
from: 'Remitente',
to:`${req.body.email}`,
subject: 'Login',
text: 'usted cambio el email de su cuenta en APPCONTACTS'
};

//envia email
transporter.sendMail(mailOptions, function(error, info){if(error){console.log(error)}else{console.log("Email sent")}});
res.send({"status":"200"})
}
else{
console.log(req.file)
if(req.file===undefined){//si file(imagen) es undefined significa no hay foto para actualizar y solo actualizamos el nombre
await Querys.records(`UPDATE usuario SET nombre="${req.body.user}" where id=${req.params.id}`) //si no hay foto para actualizar se actualiza otros datos
res.send( {"status":"203"}) 
}else
{
let url=`/img/${req.file.filename}`
await Querys.records(`UPDATE usuario SET nombre="${req.body.user}",img_profile="${url}" where id=${req.params.id}`)//si el email no se puede usar se actualiza los otros datos}
res.send( {"status":"203"}) 
}
}
}catch(err){console.log(err)}
}

exports.deleteProfile=async(req,res)=>{
try{
let user=await Querys.records(`UPDATE usuario SET img_profile="" where id="${req.params.id}" `)  
console.log(user)
let urlRemove="../img/"+req.body.url//estar atento a las rutas de las imagenes cuando se traiga la url de la imagen utilizar .slice(14) por ejemplo asi elimina los caracteres hasta obtener la ruta de la carpeta donde se colocan las imagenes
console.log(urlRemove)
fs.unlinkSync(urlRemove)//url solo contiene la ruta antigua de la imagen para eliminarla
console.log('File removed')
res.send([{"estado":"200"}])
}
catch(err){console.log(err)}
}

exports.changePassword=async(req,res)=>{ //esto sirve para cambiar contraseña usuario
try {
    let id=req.params.id //id usuario
    let password=req.body.contraseña //contraseña actual
    let newPassword=req.body.contraseñaNueva//contraseña  nueva
    let errPass=false
    let errEmail=false
    const user=await Querys.records(`select*from usuario where id='${id}'`) 
    const comparison=await bcrypt.compare(password,user[0].contraseña)
    if(comparison){ //si la contraseña es la del usuario entonces se cambiara por la nueva
        console.log("password success")
        let rounds=10
        const encryptedPasswordNew=await bcrypt.hash(newPassword,rounds) //hace hash a una contraseña
        await Querys.records(`UPDATE usuario SET contraseña="${encryptedPasswordNew}" where id="${req.params.id}" `)
        res.send([{"estado":"200"}])
    }
    
    else{
        console.log("no found password")
        res.send([{"estado":"203"}])
    }
} catch (error) {
console.log(error)   
}
}


exports.deleteUser=async(req,res)=>{
    try{
        if(req.body.url==="" || req.body.url===undefined){
        }
        else{
        let url_img="../img/"+req.body.url
        fs.unlinkSync(url_img)//url solo contiene la ruta antigua de la imagen para eliminarla
        console.log('File removed')
        }
    let user=await Querys.records(`DELETE FROM usuario WHERE id=${req.params.id}`)
    res.send(user)
    }
    catch(err){console.log(err)}
    }