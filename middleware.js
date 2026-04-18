const Listing=require("./models/listing");
const Review =require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggdIn=(req,res,next)=>{
  
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//which is inbuit has a give a req
        req.flash("error","you must logged in to creat listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","you don't have permission to edite");
       return  res.redirect(`/listings/${id}`);
    }
    
  next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you are not author of review");
       return  res.redirect(`/listings/${id}`);
    }
    
  next();
}


module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
   
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
        }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
   
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
        }
}


