//crear esto en otro archivo
const multer = require('multer');//instalamos multer
const path=require('path')
const storage = multer.diskStorage({ //esta es un objeto con dos propiedades ambas tiene dos funciones
    destination: function(req, file, cb) {
        cb(null,'./img'); //cb es una funcion donde en destination ponemos la ruta donde se guardaran las imagenes
    },
    filename: function(req, file, cb) { 
        let ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + Date.now() + '.' +'jpg');
    }
  })
  const upload = multer({ storage: storage , limits: { fieldSize: 10 * 1024 * 1024}}).single('profile') 
  
  exports.upload=upload