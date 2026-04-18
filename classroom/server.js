const express= require("express");
const app= express();
const users= require("./routes/user.js");
const posts = require("./routes/posts.js");
// const cookiesParser = require("cookie-parser");
const session = require("express-session");


//session
const sessionOptions={secret:"mysupersecreatecode",resave:false,saveUninitialized:true}
app.use(session(sessionOptions));


app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    res.send("hello");

})

app.get("/hello",(req,res)=>{
    res.send(`hello ${req.session.name}`);
})
// app.get("/testcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`test succesfull ${req.session.count}`);
// });


// app.use(cookiesParser("secreatcode"));
// //cookies
// app.get("/getCookies",(req,res)=>{
//     res.cookie("good","hello",{signed:true});
//     res.send("cookies set");

// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verifyed");
// })



// //users
// app.use("/users",users);

// //posts
// app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is listing to 3000");
})