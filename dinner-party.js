
var dinnerParty = {};

dinnerParty.appId = 'fec46765';
dinnerParty.appKey = 'e0af6f1300b348c2a9d2c3df08f3e1a6';
dinnerParty.maincourses = "course^course-Main%20Dishes";
dinnerParty.apps = "course^course-Appetizers";
dinnerParty.desserts = "course^course-Desserts";


 

 dinnerParty.getMains = function() {
 	var allergy = $('#DietaryRestrictions').val();
	var holiday = $('input[name=holiday]:checked').val();
 	$.ajax({
	 	url: "http://api.yummly.com/v1/api/recipes",
	 	method: 'GET',
	 	dataType: 'jsonp',
	 	data: {
	 		allowedCourse: dinnerParty.maincourses,
	 		_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId,
	 		allowedAllergy: allergy,
	 		allowedHoliday: holiday
	 	}
	}).then(function(res){
		var recipeId = res.matches[0].id;

		dinnerParty.getInfoMains(recipeId);


		});
}

dinnerParty.getInfoMains = function(idSent){
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipe/'+ idSent,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId
		}
	}).then(function(res) {
		dinnerParty.displayRecipes(res);
	});
}



dinnerParty.getDesserts = function() {
	var allergy = $('#DietaryRestrictions').val();
	var holiday = $('input[name=holiday]:checked').val();
	$.ajax({
		url: "http://api.yummly.com/v1/api/recipes?",
		method: 'GET',
		dataType: 'jsonp',
		data: {
			allowedCourse: dinnerParty.desserts,
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId,
	 		allowedAllergy: allergy,
	 		allowedHoliday: holiday,
	 		maxResult: "1"
		}
	}).then(function(res){

		$.each(res.matches, function(index, value) {

			var recipeId = value.id;

			dinnerParty.getInfoDesserts(recipeId);
	});
});

}

dinnerParty.getInfoDesserts = function(idSent){
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipe/'+ idSent,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId
		}
	}).then(function(res) {
		dinnerParty.displayRecipes(res);
	});
}



dinnerParty.getApps = function() {
	var allergy = $('#DietaryRestrictions').val();
	var holiday = $('input[name=holiday]:checked').val();
	$.ajax({
		url: "http://api.yummly.com/v1/api/recipes?",
		method: 'GET',
		dataType: 'jsonp',
		data: {
			allowedCourse: dinnerParty.apps,
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId,
	 		allowedAllergy: allergy,
	 		allowedHoliday: holiday,
	 		maxResult: "1"
		}
	}).then(function(res){

		$.each(res.matches, function(index, value) {

			var recipeId = value.id;

			dinnerParty.getInfoApps(recipeId);
	});
});

}

dinnerParty.getInfoApps = function(idSent){
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipe/'+ idSent,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId
		}
	}).then(function(res) {
		dinnerParty.displayRecipes(res);
	});
}

dinnerParty.getArtists = function(res) {
	var userGenre = $('#item').val();
	$.ajax({
		url: "http://developer.echonest.com/api/v4/genre/artists?api_key=NGHRLRLHEFDPL3VY8&format=json&results=5&bucket=hotttnesss&bucket=images&bucket=urls&name=" + userGenre, 
		method: 'GET',
		dataType: 'json'
	}).then(function(res){
		dinnerParty.displayArtists(res);
	});
}


dinnerParty.formSubmit = function() {
	$('form').on('submit', function(e){
		e.preventDefault();

		$('.suggestionWrapper').show();

		var numberOfPeople = $('#people').val();
		
		$('section.recipes').empty();
		if (numberOfPeople < 3) {
		 	dinnerParty.getMains();
		 }
		 if (numberOfPeople == 3 || numberOfPeople == 4){
		 		dinnerParty.getMains();
		 		dinnerParty.getDesserts();
		 }

	 	if (numberOfPeople > 4) {
	 		dinnerParty.getApps();
	 		dinnerParty.getMains();
	 		dinnerParty.getDesserts();
	 	}

	 	dinnerParty.getArtists();

	 	$('html,body').animate({scrollTop:$("#answer").offset().top}, 'slow');
	});
}


dinnerParty.displayRecipes = function(res){
		var recipeName = $('<h2>').text(res.name);
		var recipeImage = $('<img>').attr('src', res.images[0].imageUrlsBySize["360"]);
		var ingredients = $('<ul>');
		for (var i = 0; i < res.ingredientLines.length; i++) {
			var ingredient = $('<li>').text(res.ingredientLines[i]);
			ingredients.append(ingredient);
		}
		var attribution = $('<p>').append(res.attribution.html);
		var container = $('<div>').append(recipeName, recipeImage, ingredients, attribution);
		var recipesSection = $('section.recipes').append(container);

}

dinnerParty.displayArtists = function(artwork){
	$('section.artists').empty();
	$.each(artwork.response.artists, function(i, item) {
		if (item.urls != undefined ) {
			var artistTitle = $('<h2>').text(item.name);
			// var artistImage = $('<img>').attr('src', item.images[0].url);
			var artistUrl = $('<a>').attr('href', item.urls.lastfm_url).text("Play Artist").attr('target', "_blank");
			var container2 = $('<div>').append(artistTitle, artistUrl);
			var artistSection = $('section.artists').append(container2);
		}

		
	});

}


dinnerParty.formRefresh = function() {
	$('.refresh').on('click', function(){
		location.reload();
	});
};


dinnerParty.init = function() {
	dinnerParty.formSubmit();
	dinnerParty.formRefresh();
	
};


$(function() {
	dinnerParty.init();
});




	
