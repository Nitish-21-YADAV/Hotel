const mysql=require("mysql");

const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"hotel"

}); 
db.connect((error)=>
{
    if(error)
    {
        console.log(error);
    }
    else
    {
        console.log("CONNECTED SUCESSFULLY");
    }
});

module.exports.db=db;