//YELP

//VARS
var express 	   = require("express"),
	app 		   = express(),
	bodyParser     = require("body-parser"),
	mongoose	   = require("mongoose"),
	flash          = require("connect-flash"),
	passport       = require("passport"),
	LocalStratergy = require("passport-local"),
	methodOverride = require("method-override"),
    Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	User 		   = require("./models/user"),	
	seedDB         = require("./seeds");

//Require routes
var commentRoutes     = require("./routes/comments"),
	campgroundRoutes  = require("./routes/campgrounds"),
	indexRoutes       = require("./routes/index");

//SETUP
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Local
mongoose.connect(process.env.DATABASEURL);
//console.log(process.env.DATABASEURL);

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//DB seed
//seedDB();

//PASSPORT CONGIG
app.use(require("express-session")({
	secret:"blob",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Appends to route
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//HEROKU
app.listen(process.env.PORT || 5000);

//GORMIDE
//app.listen(3000, function(){
//	console.log('Yelp server is listening on port 3000');
//});
