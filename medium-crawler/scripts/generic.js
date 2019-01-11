const db = require("../libs/db");
const config = require("../config/config")
const cheerio = require('cheerio');


function init(cb) {
  db.connect(function(err,res){
    if (err) return cb(err, null);
    var users = [];
    users.push(config.medium.baseURL + config.initialUser);
    return cb(null, {users: users, index: -1});
  });
}

function parse(body) {

  var html_root = cheerio.load(body);
  var links = [];

  html_root('a').each(function(i, element){
    if (element['attribs'] && element['attribs']['class'] && element['attribs']['href'] && element['attribs']['data-action'] && element['attribs']['data-action']=='show-user-card' && element['attribs']['class']=='link u-baseColor--link avatar u-width60 u-marginRight20 u-flex0') 
    links.push(element['attribs']['href']);
  });

  return links;

}

function formURL(userName) {
  return config.medium.baseURL + userName + "/following" 
}

function getUserName(url) {
  return url.split("/")[3]
}

function addItems(main, items, max) {
  for (var i=0; i<items.length && i<max; i++)
    main.push(items[i]);
  return main;
}

function createUserObj(user, following, max) {
  
  var userObj = {};
  userObj.id = getUserName(user);
  userObj.following = [];

  for (var i=0; i<following.length && i<max; i++) {
    userObj.following.push(getUserName(following[i]));
  }

  return userObj;

}

function log(message, data) {
  console.log(message, data);
}

function getMaxUserCount(max) {
  return Math.floor(Math.random() * Math.floor(max-1)) + 1;
}

module.exports = {
  init: init,
	parse: parse,
	formURL: formURL,
	getUserName: getUserName,
  addItems: addItems,
  createUserObj: createUserObj, 
  log: log,
  getMaxUserCount: getMaxUserCount
}