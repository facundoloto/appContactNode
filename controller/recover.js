let querys=require("../database/querys.js")
require('dotenv').config()
const bcrypt=require('bcryptjs')
const path=require('path')
const nodemailer=require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pruebaDesarollo2120@gmail.com',
        pass: 'pruebaDesarollo@_2120'
    }
})

exports.recoverEmail=async(req,res)=>{ //para usar la funcions records de la clase querys hay que declaral como async la funcion donde se va invocar ya que retona una promesa y asinc la resuelve
try {
console.log(req.params.id)
let sql=`select email from usuario where email="${req.params.id}"` //crear funcion para traer imagen y enviarla con un array junto select nombre email contraseña from usuario
let user=await querys.records(sql) //tambien tenemos que poner await
if(user.length<=0){
    res.send({status:203})
}
else{
    
    let mailOptions = {
        from: 'Remitente',
        to:`${req.params.id}`,
        subject: 'Recove Password',
        html : { path: "./email/changePassword.html" }
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
} catch (error) {
console.log(error)
}
}
exports.recovePassword=async(req,res)=>{
    try{
        console.log(req.body)
        let contraseña=req.body.password
        let rounds=10
        const encryptedPassword=await bcrypt.hash(contraseña,rounds)
    const query=await querys.records(`UPDATE usuario SET contraseña="${encryptedPassword}" where email="${req.params.id}"`)
    res.send([{"estado":"200"}])
    }catch(err){console.log(err)}
}