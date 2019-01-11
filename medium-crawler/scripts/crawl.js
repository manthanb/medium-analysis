const config = require('../config/config');
const db = require('../libs/db');
const generic = require('./generic');
const request = require('request');
const async = require('async');


var maxUserCount = config.maxUserCount;
var curUserCount = 0;


function main(users, index) {

  async.waterfall([
    async.apply(crawl, users, index),
    save
  ],function(err, res){
    
    if (err) {
      generic.log("error before crawling could be finished", {error: err, curUserCount: curUserCount});
      process.exit(1);
    }

    if (curUserCount > maxUserCount-1) {
      generic.log("maximum allowed number of users crawled", null);
      process.exit(0);
    }

    generic.log("!!!!!!!!!!!!!!!!!!!!!!!!! user count !!!!!!!!!!!!!!!!!!!!!!!!!", curUserCount);

    setTimeout(function() {console.log("rested for 10 seconds"); main(res.users, res.index);}, 10000);
    
  });

}


function crawl(users, index, cb) {
  
  if (config.mode == "debug") generic.log("parameters, function->crawl", {users: users, index: index});

  if (curUserCount > maxUserCount)
    return cb("max user limit reached", null);

  index = index + 1;
  curUserCount = curUserCount + 1;

  if (config.mode == "debug") generic.log("debug 1, function->crawl", {curUserCount: curUserCount, index: index}); 
    
  while (users.slice(0, index).includes(users[index]))
    index = index + 1;

  if (index >= users.length) 
    return cb("no new user left. start with a new random point", null);

  var reqData = {};
  reqData.url = generic.formURL(generic.getUserName(users[index]));
  reqData.headers = config.medium.headers;
  if (config.mode == "debug") generic.log("debug 2, function->crawl", {request: reqData});

  request(reqData, function(err, res, body) {

    if (err)
      return cb(err, null);
   
    if (config.mode == "debug") generic.log("debug3, function->crawl. request to medium successfully returned", null);

    var children = generic.getMaxUserCount(config.maxChildrenCount);
    if (config.mode == "debug") generic.log("debug4, function->crawl, children!!!", children);

    links = generic.parse(body);
    if (config.mode == "debug") generic.log("debug5, function->crawl", {links: links});

    userObj = generic.createUserObj(users[index], links, children);
    if (config.mode == "debug") generic.log("debug6, function->crawl", {userObj: userObj});
      
    users = generic.addItems(users, links, children);
    if (config.mode == "debug") generic.log("debug7, function->crawl", {users: users});
     
    return cb(null, users, index, userObj);
  });

}


function save(users, index, userObj, cb) {
  
  db.put(userObj, function(err, data) {

    if (err) {
      generic.log("error while putting into database");
      return cb(err, null);
    }

    if (config.mode == "debug") {
      generic.log("debug8, function->save", null);
      generic.log("saved user object into database", null);
    }

    return cb(null, {users: users, index: index, userObj: userObj});

  });

}


module.exports = {
  main: main
}









