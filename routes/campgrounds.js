var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//INDEX-Todos os campgrounds
router.get("/campgrounds",function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds: allCampgrounds});
		}
	})
})

//CREATE - Adiciona novo a DB 
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	//receber informação do formulario e adicionar a array dos campgrounds
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	//arrumamos o name e image que vem do form num novo objecto que sera depois copiado para a db
	var newCampground = {name: name, image: image, description: desc, author:author, price: price}
	
	//Criar novo campground e guardar na DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect por defeito faz get request
			res.redirect("/campgrounds");
		}
	})
})	

//Route para a pagina com um formulario para criar novo campground

//NEW - Inicia o formulario
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
		res.render("campgrounds/new");
})

//SHOW - Mostra mais informação individual fazendo call do template show para aquele id
router.get("/campgrounds/:id", function(req, res){
	//find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	//render template with that campground
	
})

//EDIT CAMPGROUND
router.get("/campgrounds/:id/edit", middleware.certifyUser, function (req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
	

});

//UPDATE
router.put("/campgrounds/:id", middleware.certifyUser, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.certifyUser, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;