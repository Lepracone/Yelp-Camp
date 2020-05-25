var express = require("express");
var app = express();
//body parser tem de ser instalado para converter string em objecto
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");//vai chamar o codigo no ficheiro campgrounds.js que foi criado como model
var Comment = require("./models/comment");//igual mas para campgrounds
//var User = require("./models/user");//igual mas para comments
var seedDB = require("./seeds");
var passport =require("passport");
var LocalStrategy=require("passport-local");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");
var methodOverride = require("method-override");
var flash = require("connect-flash");


//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true});
mongoose.connect(process.env.DATABASEURL) || "mongodb://localhost:27017/yelp_camp"; 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Francisca e linda",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(commentRoutes);
app.use(authRoutes);
app.use(campgroundRoutes);



app.listen(process.env.PORT || 3000, function() {
    console.log("HB has started");
});

//app.listen(3000, function(){ console.log("YelpCamp server has started")});

