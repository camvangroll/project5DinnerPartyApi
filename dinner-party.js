
var dinnerParty = {};

dinnerParty.appId = '4180c144';
dinnerParty.appKey = '58c4ec16abb8bc536b83d95dbb8c80b2';
dinnerParty.maincourses = "course^course-Main%20Dishes";
dinnerParty.apps = "course^course-Appetizers";
dinnerParty.desserts = "course^course-Desserts";

 

 dinnerParty.getMains = function(allergy,holiday) {
 	$.ajax({
	 	url: "http://api.yummly.com/v1/api/recipes",
	 	method: 'GET',
	 	dataType: 'jsonp',
	 	data: {
	 		allowedCourse: dinnerParty.maincourses,
	 		_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId,
	 		q: allergy,
	 		q: holiday,
	 		maxResult: "1"
	 	}
	}).then(function(res){
		dinnerParty.displayRecipes(res);

	});
}

dinnerParty.getDesserts = function(allergy,holiday) {
	$.ajax({
		url: "http://api.yummly.com/v1/api/recipes?",
		method: 'GET',
		dataType: 'jsonp',
		data: {
			allowedCourse: dinnerParty.desserts,
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId,
	 		q: allergy,
	 		q: holiday,
	 		maxResult: "1"
		}
	}).then(function(res){
		dinnerParty.displayRecipes(res);
	});
}

dinnerParty.getApps = function(allergy,holiday) {
	$.ajax({
		url: "http://api.yummly.com/v1/api/recipes?",
		method: 'GET',
		dataType: 'jsonp',
		data: {
			allowedCourse: dinnerParty.apps,
			_app_key: dinnerParty.appKey,
	 		_app_id: dinnerParty.appId,
	 		q: allergy,
	 		q: holiday,
	 		maxResult: "1"
		}
	}).then(function(res){
		dinnerParty.displayRecipes(res);
	});
}

dinnerParty.populateGenres = function() {
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/genre/list?api_key=NGHRLRLHEFDPL3VY8&format=json',
		method: 'GET',
		dataType: 'json'
	}).then(function(res) {
		for(var i = 0; i < res.response.genres.length; i++) {
			$('select#item').append('<option value="' + res.response.genres[i].name + '">' + res.response.genres[i].name + '</option>');
		}
	});
};

dinnerParty.getArtists = function(res) {
	console.log("call and get artists");
	var userGenre = $('#item').val();
	$.ajax({
		url: "http://developer.echonest.com/api/v4/genre/artists?api_key=NGHRLRLHEFDPL3VY8&format=json&results=5&bucket=hotttnesss&bucket=images&bucket=urls&name=" + userGenre, 
		method: 'GET',
		dataType: 'json'
	}).then(function(res){
		console.log(res);
		dinnerParty.displayArtists(res);
	});
}


dinnerParty.formSubmit = function() {
	$('form').on('submit', function(e){
		e.preventDefault();
		$('.suggestionWrapper').show();
		var numberOfPeople = $('#people').val();
		var allergy = $('#DietaryRestrictions').val();
		var holiday = $('input[name=holiday]:checked').val();
		console.log("inside form")

		if (numberOfPeople < 3) {
	 		console.log("less than three");
		 	dinnerParty.getMains(allergy,holiday);
		 }
		 if (numberOfPeople == 3 || numberOfPeople == 4){
		 		console.log("equal to 3 or 4");
		 		dinnerParty.getMains(allergy,holiday);
		 		dinnerParty.getDesserts(allergy,holiday);
		 }

	 	if (numberOfPeople > 4) {
	 		console.log("5 or above");
	 		dinnerParty.getApps(allergy,holiday);
	 		dinnerParty.getMains(allergy,holiday);
	 		dinnerParty.getDesserts(allergy,holiday);
	 	}

	 	dinnerParty.getArtists();

	 	$('html,body').animate({scrollTop:$("#answer").offset().top}, 'slow');
	});
};


dinnerParty.displayRecipes = function(res){
		console.log("im in display recipe!")
		console.log(res.matches[0]);
		var recipeName = $('<h2>').text(res.matches[0].recipeName);
		var recipeImage = $('<img>').attr('src', res.matches[0].smallImageUrls);
		var ingredients = $('<ul>').text(res.matches[0].ingredients);
		var source = $('<a>').attr('href', res.matches[0].sourceDisplayName).text("Get Recipe");
		var container = $('<div>').append(recipeName, recipeImage, ingredients, source);
		var recipesSection = $('section.recipes').append(container);

};

dinnerParty.displayArtists = function(artwork){
	console.log("im in display artists!")
	console.log(artwork);
	$.each(artwork.response.artists, function(i, item) {
		var artistTitle = $('<h2>').text(item.name);
		// var artistImage = $('<img>').attr('src', item.images[0].url);
		var artistUrl = $('<a>').attr('href', item.urls.lastfm_url).text("Play Artist");
		var container2 = $('<div>').append(artistTitle, artistUrl);
		var artistSection = $('section.artists').append(container2);
	});

}


dinnerParty.formRefresh = function() {
	$('.refresh').on('click', function(){
		location.reload();
	});
};


dinnerParty.init = function() {
	dinnerParty.populateGenres();
	dinnerParty.formSubmit();
	dinnerParty.formRefresh();
	
};


$(function(){
	dinnerParty.init();
}); 




	
