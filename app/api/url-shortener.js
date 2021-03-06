module.exports = function(app, db){

	const validUrl = require('valid-url');


	//visiting shortened url
	app.get('/:id', (req, res) => {
		// let query = 'http://localhost:8080/'+req.params.id;
		let appName = 'https://shorten-this-url.herokuapp.com/' || 'http://localhost:8080/';
		let query = appName+req.params.id;
		//finds the shortened_url in db
		//and redirects to the  original_url
		handleGet(db,query,req,res);
	});


	//when url is provided
	app.get('/new/:href*', (req,res) => {

		let href = req.params.href+req.params[0]+'/';
		console.log(href);
		//validates entered url
		if (validUrl.isUri(href)){
			//required json repsonse for valid url
        	handlePost(db,href,req,res);
    	} 
    	//error json response for invalid url
    	else {
        	res.json({
        		error:" invalid URL. Please make sure the url follow the valid http://www.example.com format and its a real site"
        	})
    	}
	});
	

	var handleGet = function(db,query,req,res){

			let collection = db.collection('urls');
			
			//finds the short_url in the db
			collection.findOne({
				short_url: query
			}, function(err, results){
				if(err) throw err;
				if(results){
					console.log(results);
					res.redirect(results.original_url);
				}
				else{
					res.json({
						err:'please enter a valid url'
					});
				}
			});
	};


	//saved the url in db and 
	//returns original_url & shortened_url in json response
	var handlePost = function(db,href,req,res){

			let collection = db.collection('urls');

			var doc1 = {
				'original_url': href,
				'short_url': generateId(href)
			};

			//send json response to the client
			res.send(doc1);

			//inserts and updates url database
			collection.save(doc1, function(err, results){
				console.log('saved results: '+results);
			});

			//prints all documents in the urls collection of url database
			collection.find().toArray(function(err, documents){
				console.log(documents);
				
			});
	};


	//generates unique shortened url
	var generateId = function(href){
		let domain = 'https://shorten-this-url.herokuapp.com/' || 'http://localhost:8080/';
		return domain+Math.floor(Math.random()*1000000)+1;
	};


};