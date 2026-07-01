const express = require('express');
const router = express.Router();

const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');

//Middleware.js
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

//Controllers
const listingController = require("../controllers/listings.js");

//Multiform data handling
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const uploads = multer({storage});


//Router.route:
// router.post(
//   "/",
//   isLoggedIn,
//   (req, res, next) => {
//     uploads.single("listing[image]")(req, res, function (err) {
//       if (err) {
//         console.log("🔥 MULTER ERROR:", err); // 👈 THIS WILL SHOW REAL PROBLEM
//         return res.status(500).send(err.message);
//       }
//       next();
//     });
//   },
//   wrapAsync(listingController.createListing)
// );

//<i class="fas fa-redo-alt =""></i>

//REAL
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,uploads.single("listing[image]"),
    wrapAsync(listingController.createListing));

  //   router.route("/")
  // .get(wrapAsync(listingController.index))
  // .post(
  //   isLoggedIn,
  //   (req, res, next) => {
  //     console.log("STEP 1: POST /listings reached before Cloudinary upload");

  //     uploads.single("listing[image]")(req, res, function (err) {
  //       if (err) {
  //         console.log("STEP 2: Cloudinary/Multer upload failed");
  //         console.log("FULL ERROR:", err);
  //         console.log("ERROR MESSAGE:", err.message);

  //         req.flash("error", "Image upload failed: " + err.message);
  //         return res.redirect("/listings/new");
  //       }

  //       console.log("STEP 2: Cloudinary upload success");
  //       console.log("Uploaded file:", req.file);

  //       next();
  //     });
  //   },
  //   wrapAsync(listingController.createListing)
  // );
    
    // .post(isLoggedIn,validateListing,uploads.single("listing[image]"),
    // wrapAsync(listingController.createListing));
    // // .post(uploads.single("listing[image][url]"),(req,res)=>{
    // //     console.log(req.file);
    // //     res.send(req.file);
    // // });
    // .post(uploads.single("listing[image]"),(req,res)=>{
    //     res.send(req.file);
    // });


    // /new is here because if written below /:id router.route it takes /new as /:id
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,uploads.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));







// //Validates Listing data using Joi schema
//     const validateListing = (req,res,next) => {
//         let {error} = listingSchema.validate(req.body);
//         // console.log(error);
//         if(error){
//             let errMsg = error.details.map((el) => el.message).join(",");
//             throw new ExpressError(400,errMsg);
//         } else{
//             next();
//         }
//     }



    //INDEX ROUTE ===
    // router.get("/",wrapAsync(async (req,res)=>{
    //     const allListings = await Listing.find({});
    //     res.render("listings/index.ejs",{allListings});
    // }));

    // router.get("/",wrapAsync(listingController.index));

    
    //NEW ROUTE === 
    // router.get("/new",isLoggedIn,(req,res)=>{
    //     // console.log(req.user);
    //     // if(!req.isAuthenticated()){
    //     //     req.flash("error","You must be Logged in to create a new Listing!");
    //     //     return res.redirect("/login");

    //     // }

    //     res.render("listings/new.ejs");
    // })

    // router.get("/new",isLoggedIn,(req,res)=>{
    //     res.render("listings/new.ejs");
    // })

    //  router.get("/new",isLoggedIn,listingController.renderNewForm);


     //SHOW ROUTE ===
    // router.get("/:id",wrapAsync(async (req,res)=>{
    //     let {id} = req.params;

    //     const listing = await Listing.findById(id).
    //     populate({path:"reviews",populate: {path: "author"},})
    //     .populate("owner");

    //     console.log(listing);
    //     if(!listing){
    //         req.flash("error","Listing you requested for does not exist");
    //         return res.redirect("/listings");
    //     }
    //     res.render("listings/show.ejs",{listing});
    // }));

    // router.get("/:id",wrapAsync(listingController.showListing));

    
    //CREATE ROUTE ===
    // router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    
    //     const newListing = new Listing(req.body.listing);
    //     // console.log(req.user);

    //     newListing.owner = req.user._id;
    //     await newListing.save();
    //     req.flash("success","New Listing created successfully");
    //     res.redirect("/listings");
    // }));

    // router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));


    //EDIT ROUTE ===
        // router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
        //     let {id} = req.params;
        //     const listing = await Listing.findById(id);
        //     if(!listing){
        //     req.flash("error","Listing you requested for does not exist");
        //     return res.redirect("/listings");
        // }
        //     res.render("listings/edit.ejs",{listing});
        // }));

        router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


     //UPDATE ROUTE ===
    // router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    //     if(!req.body.listing){
    //         throw new ExpressError(400,"Send Valid data for Listing");
    //     }
    //     let {id} = req.params;
    //     // //Authorisation check
    //     // let listing = await Listing.findById(id);
    //     // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     //     req.flash("error","You don't have permission to edit this listing");
    //     //     return res.redirect(`/listings/${id}`);
    //     // }
    //     //
    //     await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //     req.flash("success","Listing updated successfully");
    //     res.redirect(`/listings/${id}`);

    // }));
    // router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

    //DELETE ROUTE ===
    // router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    //     let {id} = req.params;
    //     let deletedListing =await Listing.findByIdAndDelete(id);
    //     console.log(deletedListing);
    //     req.flash("success","Listing deleted successfully");
    //     res.redirect("/listings")
    // }));
    // router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

    module.exports = router;