const express=require("express");
const app=express();

const mysql=require("./connection").db;
// const route=require("./routes").route

const path=require("path");
app.set('view engine','ejs');

const publicdir=path.join(__dirname + '/public');
app.use(express.static(publicdir));

// ------------------------------------------------------------------------------------------------------------
// Routes
app.get("/",(req,res)=>
{
    res.render('index');
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
            res.render("index.ejs");
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
            console.log("outside1");
            const username2=req.body.email;
            console.log(username2);
            console.log("outside2");
            console.log("1");
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
                console.log("6");
                const detail=req.body;
                console.log("7");
                res.render("property_details.ejs",{name,description,contact_number,address,key1,key2,key3});
                console.log("8");
                mysql.query("SELECT * FROM property", (err,data) => {
                console.log("CHECKING 1 ");    
                if (err) {
                    console.log("CHECKING 2 ");
                        throw err;
                        console.log("CHECKING 3 ");
                    }
                    console.log("CHECKING 4 ");
                    // Render the webpage with all fetched property details
                    
                    console.log({data});  
                    console.log("checking 5\n\n\n");
                    res.render("property_details.ejs",{title:'Node.js MySQL CRUD Application', action:'list', sampleData:data})     
                    console.log("checking6");
                    });     
            }   
        }                     
        });   
})

app.listen(8070,(req,res)=>{
    console.log(`SERVER RUNNING ON 8070`);
});  


