const crawl = require('./scripts/crawl');
const generic = require('./scripts/generic');
const config = require('./config/config');
const async = require('async');


generic.init(function(err, data){
	if (err) {
		console.log("error in initializing", err);
		process.exit(1);
	}

	if (config.mode == "debug") generic.log("initialzed from main app, app->init", data);
	
	crawl.main(data.users, data.index);
});