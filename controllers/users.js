const User =require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
   try{
    let {email,username,password}=req.body;
    const newUser=new User({email,username});

  const registeredUser=  await User.register(newUser,password);
 
    //this for login after signup
    req.login(registeredUser,(err)=>{
      if(err){
        next(err);
      }
      req.flash("success","registerd!");
      res.redirect("/listings");

    })
    // console.log(registeredUser);
    
   }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req, res) => {
    // If authentication succeeds, this callback runs
    req.flash("success", "Welcome back!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl); // redirect wherever you want
  };
  
  module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); 
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings"); 
  });
};
