const express=require("express");
const app=express();

const mysql=require("./connection").db;
// const route=require("./routes").route

const path=require("path");
const { start } = require("repl");
app.set('view engine','ejs');

const publicdir=path.join(__dirname + '/public');
app.use(express.static(publicdir));

// ------------------------------------------------------------------------------------------------------------
// Routes

app.get("/",(req,res)=>
{
    // res.render('index');
    console.log("start 1");
    mysql.query("SELECT * FROM room", (err,data) => {    
        console.log("strat2");
        if (err) {
                throw err;
                console.log("CHECKING 3 ");
            }
            console.log("start 3");
            res.render("index",{prop: data}) 
            });
            console.log("strat 4");
});
app.get("/room",(req,res)=>
{
    mysql.query("SELECT * FROM room", (err,data) => {    
        if (err) {
                throw err;
                console.log("CHECKING 3 ");
            }
            res.render("room",{prop: data}) 
            });
});
app.get("/add_room",(req,res)=>
{
    res.render('add_room.ejs');
});
app.get("/login",(req,res)=>
{
    res.render('login');
});
app.get("/regs",(req,res)=>
{
    res.render('regs');
});

app.get("/add_property",(req,res)=>
{
    res.render('add_property');
});
app.get("/search",(req,res)=>
{
    res.render('search');
});
app.get("/report",(req,res)=>
{
    console.log("a1");
    mysql.query("SELECT * FROM property", (err,data) => {    
        if (err) {

                throw err;
                console.log("CHECKING 3 ");
            }
            console.log("a2");
            res.render("report",{prop:data}) 
            });
});


app.get("/property_details",(req,res)=>
{
    mysql.query("SELECT * FROM property", (err,data) => {    
        if (err) {
                throw err;
                console.log("CHECKING 3 ");
            }
            res.render("property_details",{prop: data}) 
            });
});
app.get("/booking",(req,res)=>
{
    res.render('booking');
});
app.get("/cancel_booking",(req,res)=>
{     
    
res.render("cancel_booking")
});
app.get("/bill",(req,res)=>
{     
    
res.render("bill")
});


// ----------------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/add_data",(req, res) => {
    const{username,aadhar,email,password,age,contact,role}=req.body;
    console.log(req.body);
    if(role==="staff"){
    mysql.query("INSERT INTO staff (NAME,ADHAR,EMAIL,PASSWORD,AGE,CONTACT_NUMBER) VALUES (?,?,?,?,?,?)",[username,aadhar,email,password,age,contact], (err, results) => 
    {
        if (err)
        {
            console.log("if wale mai error");
            throw err;
        }
        else 
        {
            let customerId = results.affectedRows; 
            if(customerId>0)
            {
                res.render("index.ejs");
            }   
        }                     
    });
    }
    else   if(role==="manager")
    {
        mysql.query("INSERT INTO manager (NAME,ADHAR,EMAIL,PASSWORD,AGE,CONTACT_NUMBER) VALUES (?,?,?,?,?,?)",[username,aadhar,email,password,age,contact], (err, results) => 
        {
        if (err)
        {
            throw err;
        }
        else 
        {  
            let customerId = results.affectedRows; 
            if(customerId>0)
            {
                res.render("index.ejs");
            }   
        }                     
        });
    }
})

// ---------------------------------login---------------------------------------------------------------
app.post('/add_data1', (req, res) => {
    const {email,password} = req.body;
    console.log(req.body);
    let sql = 'SELECT * FROM staff WHERE EMAIL = ? AND PASSWORD = ?';
    mysql.query(sql, [email,password], (err,userResults) => {
        if (err) {
            
            console.error('Error querying user table: ');
            res.send('Internal Server Error');
            return;
        }
        if (userResults.length > 0) {
            res.render("staff");
            return;
        }  
        console.log("before");
        sql = 'SELECT * FROM manager WHERE EMAIL = ? AND PASSWORD = ?';
        mysql.query(sql, [email,password], (err, kitchenResults) => {
            if (err) {

                console.error('Error querying manager table: ');
                res.send('Internal Server Error');  
                throw err;
                
            }
            const username2=req.body.email;
            if (kitchenResults.length > 0) {
                console.log("2");
                const username1=req.body.email;
                // console.log(req.body);
                console.log("3");
                console.log(username1);
                res.render("manager.ejs",{username1});
                return;
            }
            res.status(401).send('Invalid email or password');
        });
       
    });
});


// ---------------------------------------------------------------------------------------------------------------------------------

app.post("/add_p",(req, res) => {
    const{name,description,contact_number,address,key1,key2,key3}=req.body;
    console.log(req.body);
    mysql.query("INSERT INTO property (NAME,DESCRIPTION,CONTACT_NUMBER,ADDRESS,FEATURE1,FEATURE2,FEATURE3) VALUES (?,?,?,?,?,?,?)",[name,description,contact_number,address,key1,key2,key3], (err, results) => 
        {
            console.log("1");
        if (err)
        {
            console.log("2");
            throw err;
            console.log("3");
        }
        else 
        {
            console.log("4");
            let customerId = results.affectedRows; 
            console.log("5");
            if(customerId>0)
            {
                console.log("before 1");
                res.render("manager.ejs")
            }       
           
 
        }                       
        });            
})
app.post("/add_r",(req,res)=>{
    const {name,description,price}=req.body;
    mysql.query("INSERT INTO room (name,description,price) VALUES (?,?,?)",[name,description,price], (err, results) => 
        {
            console.log("1");
        if (err)
        {
            console.log("2");
            throw err;
            console.log("3");
        }
        else 
        {
            console.log("4");
            let customerId = results.affectedRows; 
            console.log("5"); 
            if(customerId>0)
            {
                console.log("before 1");
                res.render("manager.ejs")
            }       
           
 
        }                       
        });
});

app.post("/submit_booking",(req,res)=>{
    const {name,email,aadhar,phone,checkin,checkout,staff,location,room_no,room_type,floor,day,price}=req.body;
   
    mysql.query("INSERT INTO booking (name,email,aadhar,phone,checkin,checkout,staff,location,room_no,room_type,floor,day,price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",[name,email,aadhar,phone,checkin,checkout,staff,location,room_no,room_type,floor,day,price], (err, results) => 
        {
            
            if (floor < 1 || floor > 4) {
                res.send("INVALID floor")
                
                return;
              }  
            console.log("1");
        if (err)
        {
            console.log("2");
            throw err;
            console.log("3");     
        }   
        // else 
        // {
            mysql.query("INSERT INTO customers (name,email,aadhar,phone,checkin,checkout,location,day,price) VALUES (?,?,?,?,?,?,?,?,?)",[name,email,aadhar,phone,checkin,checkout,location,day,price], (err, results) => 
            {
                console.log("c1");
            if (err)
            {
                console.log("c2");
                throw err;
                console.log("3");
            }
            })
                console.log("4");
                let customerId = results.affectedRows; 
                console.log("5"); 
                if(customerId>0)
                {
                    console.log("before 1");
                    res.render("staff")
                }       
          
        // }                       
        });
});

app.post("/cancel_booking",(req,res)=>{
    console.log("cancel1");
    // res.render("cancel_booking");
    const {email}=req.query;
    console.log(req.body);
    console.log(req.body.email);
    let qry22="delete FROM booking where email=?" 
    mysql.query(qry22,req.body.email, (err,results) => {    
        console.log("cancel1");

        if (err) {
                throw err;
                console.log("CHECKING 3 ");  
            }
        else{
            if(results.affectedRows>0){
                console.log("good");
            }
            res.render("staff")    
        }
    });
});

app.post("/search",(req,res)=>{
    console.log("SEARCH1");
    // res.render("cancel_booking");
    const {email}=req.query;
    console.log(req.body);
    console.log(req.body.email);
    let qry22="SELECT * FROM booking where email=?"
    mysql.query(qry22,req.body.email, (err,results) => {    
        console.log("SEARCH2");
  
        if (err) {
                throw err;
                console.log("CHECKING 3 ");  
            }
        else{
            console.log(results);
            if(results.affectedRows>0){
                console.log("abc1");
                  
            }
            console.log("abc2");
            res.render("bill",{customerss:results[0]})    
        }
       
    });
});

// app.post("/report",(req,res)=>{
//     mysql.query("SELECT * FROM property", (err,data) => {    
//         if (err) {
//                 throw err;
//                 console.log("CHECKING 3 ");
//             }
//             res.render("report",{prop:data}) 
//             });
// });


app.listen(8070,(req,res)=>{
    console.log(`SERVER RUNNING ON 8070`);
});  

  
 