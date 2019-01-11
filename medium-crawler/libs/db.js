// import packages and config
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config/config').db;


var db;
var client;

function connect(cb) {
  mongoClient.connect(config.url, function(err, data) {
  	if (err) return cb(err, null);
  	client = data;
  	db = client.db(config.name);
  	return cb(null, "connection to db successfull");
  });
}


function close() {
	client.close();
}


function put(object, cb) {
	db.collection(config.collection).insertOne(object, function(err, data) {
		return cb(err, data);
	});
}


function get(query, cb) {
	db.collection(config.collection).find(query).toArray(function(err, data){
		return cb(err, data);
	});
}

module.exports = {
	connect: connect,
	put: put,
	get: get,
	close: close
}



