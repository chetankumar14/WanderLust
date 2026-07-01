   //.env file configuration
   if(process.env.NODE_ENV !== "production"){
        require("dotenv").config();
    }   

    // console.log(process.env);
    // console.log(process.env.SECRET);

    const express = require('express');
    const app = express();
    const mongoose = require('mongoose');
    // const Listing = require('./models/listing.js');
    const path = require('path');
    const methodOverride = require('method-override');
    const ejsMate = require('ejs-mate');
    // const wrapAsync = require('./utils/wrapAsync.js');
    const ExpressError = require('./utils/ExpressError.js');
    // const {listingSchema,reviewSchema} = require('./schema.js');
    // const Review = require('./models/review.js');

    const listingRouter = require('./routes/listings.js');
    const reviewRouter = require('./routes/reviews.js');
    const userRouter = require('./routes/user.js');



    //session
    const session = require("express-session");
    //flash middleware
    const flash = require("connect-flash");

    //Passport for user authentication
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const User = require("./models/user.js");



    const port = 8080;

    MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

    main().then(()=>{
        console.log("Connected to wanderlustDB");
    }).catch((err)=>{
        console.log(err);
    })

    async function main(){
        await mongoose.connect(MONGOURL);
    }

    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.engine("ejs",ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));



    //Session Options
    const sessionOptions = {
        secret:"mysupersecretcode",
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now() + 7*24*60*60*1000, //1 week
            maxAge:1000*60*60*24*7,
            httpOnly:true
        }
    };


    app.get("/",(req,res)=>{
        res.send("Hi,I am root")
    });


    app.use(session(sessionOptions));
    app.use(flash());
    //Passport Configuration
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    

    //Flash Middleware
    app.use((req,res,next)=>{
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    })

    //Routes
    // app.get("/",(req,res)=>{
    //     res.send("Hi,I am root")
    // });

    // const validateListing = (req,res,next) => {
    //     let {error} = listingSchema.validate(req.body);
    //     // console.log(error);
    //     if(error){
    //         let errMsg = error.details.map((el) => el.message).join(",");
    //         throw new ExpressError(400,errMsg);
    //     } else{
    //         next();
    //     }
    // }


    // const validateReview = (req,res,next) => {
    //     let {error} = reviewSchema.validate(req.body);
    //     // console.log(error);
    //     if(error){
    //         let errMsg = error.details.map((el) => el.message).join(",");
    //         throw new ExpressError(400,errMsg);
    //     } else{
    //         next();
    //     }
    // }


    app.use("/listings",listingRouter); //Access all routes related to listings in this file


    // //INDEX ROUTE ===
    // app.get("/listings",wrapAsync(async (req,res)=>{
    //     const allListings = await Listing.find({});
    //     res.render("listings/index.ejs",{allListings});
    // }));


    // //NEW ROUTE === 
    // app.get("/listings/new",(req,res)=>{
    //     res.render("listings/new.ejs");
    // })


    // //SHOW ROUTE ===
    // app.get("/listings/:id",wrapAsync(async (req,res)=>{
    //     let {id} = req.params;
    //     const listing = await Listing.findById(id).populate("reviews");
    //     res.render("listings/show.ejs",{listing});
    // }));


    // //CREATE ROUTE ===
    // app.post("/listings",validateListing,wrapAsync(async (req,res)=>{
    //     // console.log(!req.body.listing);
    //     //  if(!req.body.listing){
    //     //     throw new ExpressError(400,"Send Valid data for Listing");
    //     // }
    //     //let {title,description,price,location,country} = req.body;

    //     //let listing = req.body
    //     //let listing = req.body.listing;
    //     //let Listing(listing);

    //     /////////////////////////////////////
    //     // let result = listingSchema.validate(req.body);
    //     // if(result.error){
    //     //     throw new ExpressError(400,"result.err");
    //     // }
    //     // console.log(result);
    //     ////////////////////////////////////////////

    //     const newListing = new Listing(req.body.listing);

    //     //if a field is missing
    //     // if(!newListing.description){
    //     //     throw new ExpressError(400,"Description is missing");
    //     // }
    //     //   if(!newListing.title){
    //     //     throw new ExpressError(400,"Title is missing");
    //     // }
    //     //   if(!newListing.location){
    //     //     throw new ExpressError(400,"Location is missing");
    //     // }
    //     //   if(!newListing.country){
    //     //     throw new ExpressError(400,"Country is missing");
    //     // }
    //     //   if(!newListing.price){
    //     //     throw new ExpressError(400,"Price is missing");
    //     // }


    //     await newListing.save();
    //     res.redirect("/listings");
    // }));


    // //EDIT ROUTE ===
    // app.get("/listings/:id/edit",validateListing,wrapAsync(async (req,res)=>{
    //     let {id} = req.params;
    //     const listing = await Listing.findById(id);
    //     res.render("listings/edit.ejs",{listing});
    // }));


    // //UPDATE ROUTE ===
    // app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    //      if(!req.body.listing){
    //         throw new ExpressError(400,"Send Valid data for Listing");
    //     }
    //     let {id} = req.params;
    //     await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //     res.redirect(`/listings/${id}`);

    // }));


    // //DELETE ROUTE ===
    // app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    //     let {id} = req.params;
    //     let deletedListing =await Listing.findByIdAndDelete(id);
    //     console.log(deletedListing);
    //     res.redirect("/listings")
    // }));



    //REVIEW ROUTES ==========

    //post route
    // app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req,res) =>{
    //     let listing = await Listing.findById(req.params.id);
    //     let newReview = new Review(req.body.review);

    //     listing.reviews.push(newReview);
    //     await newReview.save();
    //     await listing.save();

    //     res.redirect(`/listings/${listing._id}`)
    // }));


    // //DELETE REVIEW ROUTE ===
    // app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    //     let {id,reviewId} = req.params;
    //     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    //     await Review.findByIdAndDelete(reviewId);
        
    //     res.redirect(`/listings/${id}`);
    // }))


    app.use("/listings/:id/reviews",reviewRouter); //Access all routes related to reviews in this file
    app.use("/",userRouter); //Access all routes related to user in this file   



    // //NEW ROUTE === 
    // app.get("/listings/new",(req,res)=>{  //in here listings/new == listings/id
    //     res.render("listings/new.ejs");  //new == id
    // })


    // app.get("/testlistings",(req,res)=>{
    //     let sampleListing = new listing({
    //         title:"My New Villa",
    //         description:"By the beach",
    //         price:1200,
    //         location:"Calangute,Goa",
    //         country:"India"
    //     });

    //     sampleListing.save();
    //     console.log("Sample was saved");
    //     res.send("Successful testing")
    // });


    //MIDDLEWARE

    // 404 handler (must be AFTER all routes)
    app.use((req,res,next)=>{
        next(new ExpressError(404,"Page Not Found"));
    })

    app.use((err,req,res,next) =>{
        let {statusCode =500,message = "Something Went Wrong"} = err;
        // res.status(statusCode).send(message);
        res.status(statusCode).render("error.ejs",{err});
    });

    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });

