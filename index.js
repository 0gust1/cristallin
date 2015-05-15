/**
 * convert -normalize -modulate 100,0 leo.jpg test3.jpg
 * http://seenthis.net/messages/341357
 * https://github.com/KeyboardFire/mkcast
 * http://sebsauvage.net/python/webgobbler/index.html
 *
 * http://trackingjs.com/docs.html
 * http://inspirit.github.io/jsfeat/
 *
 * https://github.com/auduno/clmtrackr
 * http://alereimondo.no-ip.org/OpenCV/34
 * http://docs.opencv.org/doc/tutorials/features2d/feature_detection/feature_detection.html#feature-detection
 */


var Q = require("q");
var _ = require("lodash");
var path = require("path");
var request = require("request");
var parseRSS = require("parse-rss");
var fUrl = require('flickr-urls');

var DL_DIR = "./dl";

// Flickr.authenticate(flickrOptions, function(error, flickr) {
//   flickr.photos.search({
//   user_id: flickr.options.user_id,
//   page: 1,
//   per_page: 500
// }, function(err, result) {
//   console.log(result);
// });
// });

/**
 * [parseTumblrFeed description]
 * @param  {String} url [description]
 * @return {Promise}    Promise for the JS object representing the feed
 */
function parseTumblrFeed(url) {
  var defer = Q.defer();
  parseRSS(url, function(err, rss) {
    if (err) {
      throw err;
    }
    defer.resolve(rss);
  });
  return defer.promise;
}

var flickrSearch = require("./lib/flickr.js");

var searchOptions = {
  text: "pilot",
  sort: "interestingness-desc",
  safe_search: 3,
  page: 1,
  per_page: 5
};


console.log(flickrSearch.searchCommons(searchOptions));


