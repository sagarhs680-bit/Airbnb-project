const express  = require("express");
const router = express.Router();



//user
//index - users
router.get("/",(req,res)=>{
    res.send("GET for users");
    }) 

//show - user
router.get("/:id",(req,res)=>{
    res.send("GET for user");
})

//create - user
router.post("/",(req,res)=>{
    res.send("POST for user");
})

//delete - user
router.delete("/:id",(req,res)=>{
    res.send("DELETE user");
})

module.exports= router;