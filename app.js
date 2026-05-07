
//now we can access evn in everywhere
if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const promClient = require("prom-client");

const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js")
const { listingSchema } = require("./schema.js");
const Review =require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const userRouter=require("./routes/user.js");
const listingsRouter =require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const metricsRegistry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: metricsRegistry });
const httpRequestsTotal = new promClient.Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "route", "status"],
    registers: [metricsRegistry],
});
app.use((req, res, next) => {
    res.on("finish", () => {
        const route = req.route?.path || req.path;
        httpRequestsTotal.inc({
            method: req.method,
            route,
            status: String(res.statusCode),
        });
    });
    next();
});

app.get("/health", (req, res) => {
    const dbState = mongoose.connection.readyState; // 1 = connected
    res.status(dbState === 1 ? 200 : 503).json({
        status: dbState === 1 ? "ok" : "degraded",
        db: dbState,
        uptime: process.uptime(),
    });
});

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
});

const sessionOptions={
    secret: process.env.SESSION_SECRET || "mysupersecreatecode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

//just practise for authentication
// app.get("/demo",async(req,res)=>{
//     let fakeUser=new User({
//         email:"sahljdf@gamil.com",
//         username:"sagar",
//     });
//     let newUser=  await User.register(fakeUser,"hello");
//     res.send(newUser);

// })

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"goa",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull tesing")
// });





//listings
app.use("/listings",listingsRouter);


//reviews
app.use("/listings/:id/reviews", reviewsRouter);

//user (which is a signup)
app.use("/",userRouter);

// Catch-all 404 handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
//midlelware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);

});

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
})