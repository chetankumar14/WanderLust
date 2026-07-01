const express = require('express');
const router = express.Router({mergeParams:true});


const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReview,isLoggedIn,isReviewAuthor } = require('../middleware.js');

//controller
const reviewController = require('../controllers/review.js');



// const validateReview = (req,res,next) => {
//         let {error} = reviewSchema.validate(req.body);
//         // console.log(error);
//         if(error){
//             let errMsg = error.details.map((el) => el.message).join(",");
//             throw new ExpressError(400,errMsg);
//         } else{
//             next();
//         }
//     }


    //REVIEW ROUTES ==========

    //post route
    // router.post("/",isLoggedIn,validateReview, wrapAsync(async (req,res) =>{
    //     let listing = await Listing.findById(req.params.id);
    //     let newReview = new Review(req.body.review);
    //     newReview.author = req.user._id;

    //     listing.reviews.push(newReview);
    //     await newReview.save();
    //     await listing.save();

    //     req.flash("success","New Review created successfully");
    //     res.redirect(`/listings/${listing._id}`)
    // }));

    router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


    //DELETE REVIEW ROUTE ===
    // router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    //     let {id,reviewId} = req.params;
    //     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    //     await Review.findByIdAndDelete(reviewId);
    //     req.flash("success","Review deleted successfully");
    //     res.redirect(`/listings/${id}`);
    // }))

    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


    module.exports = router;