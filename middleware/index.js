//all the middleware goes here

var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Is logged in?
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first");
	res.redirect("/login");
}


//DOES IT OWNES THE POST?
middlewareObj.certifyUser = function(req, res, next){
		if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found.");
				res.redirect("back")
			}else{
				//IF IT IS, DOES HE OWN THE CAMPGROUND?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permition to do that!");
					res.redirect("back");
				}
				
			}
		});

		}else{
			req.flash("error", "Please login first.");
			res.redirect("back");
		}
	
}


//DOES IT OWNES THE COMMENT?
middlewareObj.certifyComment = function(req, res, next){
		if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			}else{
				//IF IT IS, DOES HE OWN THE CAMPGROUND?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
				
			}
	});
		
	}else{
		req.flash("error", "Please login first");
		res.redirect("back");
	}
	
}


module.exports = middlewareObj