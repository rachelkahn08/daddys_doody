// EXPRESS SETUP: --------------------------------------------------------------------------------------------------------
// import libraries
const express = require('express'),
	bodyParser = require('body-parser');

// create server
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:3000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});


// MONGOOSE SETUP --------------------------------------------------------------------------------------------------------

/*ZZ
ZZ
// import libraries
const mongoose = require('mongoose'),
	GeoJSON = require('mongoose-geojson-schema');
	
// connect to db
const db = mongoose.connections;
mongoose.connect('mongodb://localhost/daddys_doody_db', { useMongoclient: true });

// create schemas for the db 
const Schema = mongoose.Schema;

const locationSchema = new Schema({
	loc: { type: [Number], required: true }. //longitude, latitude using GeoJSON
	id: [Number],
	name: String,
	hasTables: { type: Boolean, required: true },
});

const geoJSONSchema = new mongoose.Schema({
    any: mongoose.Schema.Types.GeoJSON,
    point: mongoose.Schema.Types.Point,
	multipoint: mongoose.Schema.Types.MultiPoint,
	linestring: mongoose.Schema.Types.LineString,
	multilinestring: mongoose.Schema.Types.MultiLineString,
	polygon: mongoose.Schema.Types.Polygon,
	multipolygon: mongoose.Schema.Types.MultiPolygon,
	geometry: mongoose.Schema.Types.Geometry,
	geometrycollection: mongoose.Schema.Types.GeometryCollection,
	feature: mongoose.Schema.Types.Feature,
	featurecollection: mongoose.Schema.Types.FeatureCollection
});

const userSchema = new Schema({
	userName: String,
	password: String,
	email: String,
});

// create models for the schemas
const Location = mongoose.model('Location', locationSchema),
	Coordinates = mongoose.model('Coordinates', geoJSONSchema),
	User = mongoose.model('User', userSchema);

	*/




// CRUD LISTENERS --------------------------------------------------------------------------------------------------------

// set port
app.listen(1357, function() {
	console.log("daddy's back-end is listening to 1357");
});


// GET FUNCTIONS --------------------------------------------------

// return all locations within distance of user
app.get('/locations/nearby', function(req, res){
	let dataToSend = [];
	console.log(req);

	// send request to db for all mapped locations within radius of user
		// filter by lat and lng
		// if Math.abs(Location.lng - userLng) < req.radius && same for latitude 
	// foreach Location dataToSend.push(Location);
	return res.params.dataToSend;
});

// return locations that have changing tables in mens' or family restrooms
app.get('/locations/have_tables/:value', function(req, res){
	let dataToSend = [];
	// send request to db based on :value for true, false, or new
		// ? req.val == new : () => dataTosend.push(Location);
	// will return places that DO hve tables, places that DO NOT have tables, 
	// and places that recently added tables, respectively
	// return res;
});

// return data for a specific location
app.get('locations/:location', function(req, res){
	// return res;
}); 



// POST FUNCTIONS --------------------------------------------------

// create new or update existing location
app.post('locations/all/:id', function(req, res){
	// test if location w/id already exists
	// if yes, update
	// if no, create new
	// return res;
});

// create new user account
app.post('register/:username', function(req, res){
	
});


/*
WHAT NEEDS TO HAPPEN:
1) import libraries
2) set up database
	a) create schema for locations, users
	b) create model to search db for locations
3) set up listeners 
	a) gets
	b) puts

*/






