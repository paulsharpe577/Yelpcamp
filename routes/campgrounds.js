var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX- camp grounds
router.get("/", function(req, res){
	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
			   }
	});
	

	                          //Name we want to give it, data we pass in
	//res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE - add new campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author:author}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated);
				res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new camp ground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW - show more info on a camp site
router.get("/:id", function(req, res){
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
			if(err){
				console.log(err);
			} else {
				//console.log(foundCampground);
				res.render("campgrounds/show", {campground: foundCampground});
			}
		});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});	
	});
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
		if (err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});

});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});

});






module.exports = router;