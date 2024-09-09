const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.userSignup = async (req,res,next)=>{
    try{
    let{username, email, password} = req.body;
    const newUser = new User({username , email})
    let registerdUser = await User.register(newUser,password)
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.userLogin =  async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!.");
        res.redirect("/listings");
    })
};