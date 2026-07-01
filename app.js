   //.env file configuration
   if(process.env.NODE_ENV !== "production"){
        require("dotenv").config();
    }   

    const express = require('express');
    const app = express();
    const mongoose = require('mongoose');
    const path = require('path');
    const methodOverride = require('method-override');
    const ejsMate = require('ejs-mate');
    const ExpressError = require('./utils/ExpressError.js');


    const listingRouter = require('./routes/listings.js');
    const reviewRouter = require('./routes/reviews.js');
    const userRouter = require('./routes/user.js');



    //session
    const session = require("express-session");
    //for deployment below one
    // const MongoStore = require('connect-mongo');
    const { MongoStore } = require('connect-mongo');
    //flash middleware
    const flash = require("connect-flash");

    //Passport for user authentication
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const User = require("./models/user.js");



    const port = 8080;

    // const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";
    const dbUrl = process.env.ATLASDB_URL;

    main().then(()=>{
        console.log("Connected to wanderlustDB");
    }).catch((err)=>{
        console.log(err);
    })

    async function main(){
        await mongoose.connect(dbUrl);
    }

    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.engine("ejs",ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));


    //Deployment session
      //for deployment
    const store = MongoStore.create({
        mongoUrl : dbUrl,
        crypto : {
            secret:process.env.SECRET,
        },
        touchAfter: 24*3600,
    });


    store.on("error",(err) => {
        console.log("Error in Mongo Session Store",err);
    })

    //Session Options
    const sessionOptions = {
        // store:store,
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now() + 7*24*60*60*1000, //1 week
            maxAge:1000*60*60*24*7,
            httpOnly:true
        }
    };


    // app.get("/",(req,res)=>{
    //     res.send("Hi,I am root")
    // });


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


    app.use("/listings",listingRouter); //Access all routes related to listings in this file
    app.use("/listings/:id/reviews",reviewRouter); //Access all routes related to reviews in this file
    app.use("/",userRouter); //Access all routes related to user in this file   




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

