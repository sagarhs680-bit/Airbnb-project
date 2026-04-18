const express = require("express");
const router = express.Router({mergeParams: true});  //when we have nested routes then we have to use mergeParams to access params of parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review =require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggdIn,isReviewAuthor } =require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//validation middleware for review
// const validateReview = (req, res, next) => {
//     let {error} = reviewSchema.validate(req.body);
   
//     if (error) {
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//         }
// }

//Review routes
//Post review route
router.post("/",isLoggdIn,validateReview,wrapAsync(reviewController.createReview));
//Delete review route
router.delete("/:reviewId",isLoggdIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;