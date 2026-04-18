const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js")
const { isLoggdIn ,isOwner,validateListing}=require("../middleware.js");
const listingController =require("../controllers/listings.js");
const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


//which is implementing of the Router.route() method 
// router
//     .route("/")
//     .get(wrapAsync(listingController.index));


//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new",isLoggdIn,listingController.renderNewForm);



//show route
router.get("/:id", wrapAsync(listingController.showListing));


//creat route
router.post("/creat", upload.single('listing[image]') ,validateListing,wrapAsync(listingController.createListing));

//practice of image with cloudinary
// router.post("/creat",upload.single('listing[image]') ,(req,res)=>{
// res.send(req.file);
// });


//creat edit route
router.get("/:id/edit", isLoggdIn,isOwner,wrapAsync(listingController.renderEditForm));

//updating listings
router.put("/:id",isLoggdIn, isOwner,upload.single('listing[image]') ,validateListing,wrapAsync(listingController.updateListing));

//delete rout
router.delete("/:id",isLoggdIn, isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;