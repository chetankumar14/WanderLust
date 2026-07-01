const express = require('express');
const router = express.Router({mergeParams:true});

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");


//router.route
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:"/login",failureFlash:true}),userController.login);


  

//Render signup form
// router.get("/signup",(req,res)=>{
//     res.render("users/signup.ejs");
// });
// router.get("/signup",userController.renderSignupForm);


//Signup logic
// router.post("/signup",wrapAsync(async(req,res)=>{
//     try{
//     let {username,email,password} = req.body;
//     const newUser = new User({username,email});
//     const registeredUser = await User.register(newUser,password);
//     console.log(registeredUser);
//     req.login(registeredUser,(err)=>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success","Welcome to WanderLust "+registeredUser.username);
//         res.redirect("/listings");
//     })
//     } catch(e){
//         req.flash("error",e.message);
//         res.redirect("/signup");
//     }
// }));
// router.post("/signup",wrapAsync(userController.signup));


// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs");
// })
// router.get("/login",userController.renderLoginForm);



// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
//     async(req,res)=>{

//     req.flash("success","Welcome back to WanderLust,"+req.user.username);
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);

// })
// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",
//         {failureRedirect:"/login",failureFlash:true}),userController.login);



// router.get("/logout",(req,res)=>{
//     req.logout((err)=>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success","You are Logged out!");
//         res.redirect("/listings");
//     })
// })
router.get("/logout",userController.logout);

module.exports = router;