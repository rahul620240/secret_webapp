//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app=express();

//way to call data from .env files
console.log(process.env.API_KEY);
app.set('view engine','ejs')
app.use(express.static("public"));








//this help us in sending data in body using form_urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());



 mongoose.set('strictQuery', true);

// const { stringify } = require("querystring");
// app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/login_registerDB",
{


useNewUrlParser:true,
useUnifiedTopology:true
// },(err)=>{
// if(!err)
// {
//     console.log("connected to db")
// }

// else
// {
//     console.log(err)
// }
 })

 const userSchema=new mongoose.Schema({
    email:String,
    password:String
 });


 userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password,
  });
  newUser.save(function(err){
    if (err) {
        console.log(err);

    } else {
       res.render("secrets") ;
    }
  });
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;


    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);

        }else{
            if(foundUser.password===password){
               res.render("secrets"); 
            }
        }
    })
})


app.listen(3000,function(){
    console.log("serveris running on port 3000");
    
    });