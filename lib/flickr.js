var Flickr = require("flickrapi");

var flickrOptions = require('./flickrKey.json');

var Q = require("q");
var _ = require("lodash");
var path = require("path");
var request = require("request");
var fUrl = require('flickr-urls');

var DL_DIR = "./dl";


exports.searchCommons = searchCommons;

exports.searchFlickr = searchFlickr;

function searchCommons(opts){

	var searchOptions = {
		is_commons: true
	};

	_.assign(searchOptions, opts);
	console.log("search options : \n%o\n",searchOptions);
	return searchFlickr(searchOptions);
}

function searchFlickr(opts){

	var defer = Q.defer();

	Flickr.tokenOnly(flickrOptions, function(error, flickr) {

	//console.log("flickr options : ", flickr.options);

	/*var searchOptions = {
		is_commons: true,
		//tags:'sorcery',
		text: "dharma",
		sort: "interestingness-desc",
		safe_search: 3,
		page: 1,
		per_page: 5,
		extras: "count_faves, count_comments, description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o"
	};*/

	var searchOptions = {
		sort: "interestingness-desc",
		safe_search: 3,
		page: 1,
		per_page: 1,
		extras: "count_faves, count_comments, description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o"
	};

	_.assign(searchOptions, opts);
	console.log("search options : \n%o\n",searchOptions);
	var gettingsearch = getFlickrSearchResults(flickr, searchOptions);
	gettingsearch.then(function(v) {
		var cleaned = _.compact(v);
		cleaned = calculateScores(cleaned);

		//console.log("final result : \n", cleaned);

		//downloadPictures(cleaned.map(function(e) {
		//	return e.url_l
		//}));

		defer.resolve(cleaned);
		//console.log(JSON.stringify(cleaned.map(function(e){return {"score":e.score,"id":e.id};}), null, 2));
		});
	});

	return defer.promise;

};

function calculateScores(flickrList){
	return flickrList.map(function(el){
		var views = parseFloat(el.views);
		var comments = parseFloat(el.count_comments);
		var favs = parseFloat(el.count_faves);;
		//var notes = parseInt(el.count_notes.note.length,10);

		el.score = comments/views + favs/views;

		return el;
	});
}

/**
 * Perform a flickr search with provided options
 * Filter out bad URLs
 *
 * Returns an array of verified, detailed photo objects
 *
 * @param  {[type]} flickr        [description]
 * @param  {[type]} searchOptions [description]
 * @return {[type]}               [description]
 */
function getFlickrSearchResults(flickr, searchOptions) {
	var defer = Q.defer();
	flickr.photos.search(searchOptions,
		function(err, result) {
			if (err) {
				throw err;
			}
			var photoList = result.photos.photo;
			//return the result with tested url (as flickr static servers are not able to send correct http codes)
			//console.log(photoList);
			if (photoList.length > 0) {
				photoList = getFlickrUrl(photoList);
				defer.resolve(removeInvalidPhotos(photoList, 'targetUrl'));
			} else {
					defer.resolve(photoList);
			}
		}
	);
	return defer.promise;
}
;

/**
 * Perform a complete flickr search with provided options
 * For each photo, get the detailed info
 * Filter out bad URLs
 *
 * Returns an array of verified, detailed photo objects
 *
 * @param  {[type]} flickr        [description]
 * @param  {[type]} searchOptions [description]
 * @return {[type]}               [description]
 */
function getFlickrSearchFullResults(flickr, searchOptions) {
	var defer = Q.defer();
	flickr.photos.search(searchOptions,
		function(err, result) {
			if (err) {
				throw err;
			}
			var finRes = null;

			var photoList = result.photos.photo;

			var gettingInfos = getPhotosInfosFromSearch(photoList, flickr);

			gettingInfos.then(function(val) {
				finRes = processPhotosInfos(val.map(function(e) {
					return e.photo;
				}), photoList);
				finRes = getFlickrUrl(finRes);
			}).done(function() {
				defer.resolve(removeInvalidPhotos(finRes, 'targetUrl'));
			});
		}
	);
	return defer.promise;
}

function getFlickrUrl(list) {
	return list.map(function(el) {
		el.targetUrl = getFUrl(el);
		return el;
	});

	function getFUrl(e) {
		var params = {
			server: e.server,
			secret: e.secret,
			id: e.id,
			farm: e.farm,
			size: fUrl.IMG_SIZES.LARGE_1024
		};
		return fUrl.getFarmUrl(params);
	}
}

function removeInvalidPhotos(photoCollection, urlField) {
	var https = require('https');

	var nextColl = photoCollection.map(function(e) {
		var defer = Q.defer();
		var urlObj = require('url').parse(e[urlField]);
		var requestOpts = {
			host: urlObj.host,
			path: urlObj.path,
			method: "HEAD"
		};

		var req = https.request(requestOpts, function(res) {
			if (res.headers.location) {
				//console.log("unavaiable : ",urlObj.path);
				res.destroy();
				defer.resolve(null);
			} else {
				defer.resolve(e);
			}
		});
		req.end();

		return defer.promise;
	});

	return Q.all(nextColl);
}

/**
 * Get a full collection of photo infos from a flickr search result
 * @param  {[type]} photoList [description]
 * @param  {[type]} flickr    [description]
 * @return {Promise}           [description]
 */
function getPhotosInfosFromSearch(photoList, flickr) {

	var gettingAllInfos = photoList.map(function(elem) {

		return Q.nfcall(flickr.photos.getInfo, {
			'photo_id': elem.id
		});
	});

	return Q.all(gettingAllInfos);
}

function processPhotosInfos(photoInfo, photoList) {
	_.merge(photoList, photoInfo);
	return photoList;
}

function downloadPictures(photoList) {
	var fs = require('fs');

	photoList.forEach(function(e) {
		var fileName = getFileName(e);
		request(e).pipe(fs.createWriteStream(path.resolve(DL_DIR, fileName)));
	});

	function getFileName(path) {
		return path.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/[\w/-]+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$/i)[8];
	}
}


//Get all th contributors to commons
//For each contributor, get the setList
//For each setlist (or the most faved/commented), get the most faved commented view photos
