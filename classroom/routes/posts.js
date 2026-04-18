const express = require("express");
const router  = express.Router();


//posts
//index - posts
router.get("/",(req,res)=>{
    res.send("GET for posts");
    }) 

//show - post
router.get("/:id",(req,res)=>{
    res.send("GET for post");
})

//create - post
router.post("/",(req,res)=>{
    res.send("POST for post");
})

//delete - post
router.delete("/:id",(req,res)=>{
    res.send("DELETE post");
})

module.exports = router;