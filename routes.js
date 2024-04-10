// routing 
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

app.get("/option",(req,res)=>
{
    res.render('option');
});

module.exports=route;