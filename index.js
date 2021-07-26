//instanciamos los objetos con require
require('dotenv').config()
const express=require('express')
const multer=require('multer')
const fs=require('fs')
const https = require('https');

const descargar=require('./controller/upload')
const path=require('path')
const app=express()

const cookieParser = require('cookie-parser');
const login=require('./controller/login');
const contacts=require('./controller/contacts');
const user=require('./controller/user');
const recover=require('./controller/recover');
const cors=require('cors')
const port=process.env.HOST

app.use('/files', express.static(path.join(__dirname, 'files')))
app.use(cookieParser());
app.use(express.json())
app.use(cors())
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.post("/login/signup",descargar.upload,login.createUsuario)
app.post("/login/search",login.searchUsuario)
app.post("/login/user",login.Usuario)
app.post("/home/contacts",descargar.upload,contacts.createContact) //es importante colocar el modulo donde esta multer para guardar archivos como segundo paramentro y el 3 parametro colocamos el modulo donde guardamos lo que viene de post
app.get("/home/getContacts/:id",contacts.contact)
app.put('/home/deleteImg/:id',contacts.deleteImg)
app.get("/home/idContacts/:id",contacts.idContact)//busca conacto por id
app.put('/home/editContacts/:id',descargar.upload,contacts.putContact);
app.delete('/home/deleteContacts/:id',contacts.deleteContact)//busca conacto por id
app.get('/recover/recoveEmail/:id',recover.recoverEmail)//busca conacto por id
app.put('/recover/recovePassword/:id',recover.recovePassword)
app.get('/home/user/:id',user.user)
app.put('/home/edituser/:id',descargar.upload,user.editUser)
app.delete('/home/deleteProfile/:id',user.deleteProfile)
app.put('/home/changePassword/:id',user.changePassword)
app.get("/home/email/:id",user.email)//busca conacto por id
app.delete('/home/deleteUser/:id',user.deleteUser)
app.listen(port,()=>{console.log(`server init in port:${port}`)})

