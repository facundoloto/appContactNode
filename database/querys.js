class Query{
constructor() {
const conexion=require('../database/database.js')
const util=require('util')//instalamos con npm util
this.query=util.promisify(conexion.query).bind(conexion)//configuramos utiil para usar en las query 
}
//esta clase sirve para evitar tener que configurar los require en todos los archivos para hacer las consultas
async records(sql) { //no es necesario poner  function
try {

const rows=await this.query(sql)
return rows; 
} catch (error) {
console.log(error)
}
}

}
module.exports=new Query() //hacemos esto por que ya por defecto instanciamos el objeto query






