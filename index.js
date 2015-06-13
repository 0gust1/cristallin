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
_ = require("lodash"),
path = require("path"),
request = require("request"),
parseRSS = require("parse-rss"),
url = require("url"),
path = require("path"),
fUrl = require('flickr-urls'),
https = require("https"),
url = require("url"),
DL_DIR = "./dl";

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
  user_id:"me",
  //text: "sculpture",
  sort: "interestingness-desc",
  safe_search: 3,
  page: 1,
  per_page: 10
};

// var toto = flickrSearch.searchCommons(searchOptions);
// toto.then(function(el) {
//   console.log(el);
// })

var objdetect = require("./lib/objDetect.js");

var Canvas = require('canvas');
var Image = Canvas.Image;


var fs = require('fs');
var size = 1024;

searchFlickrAndExtractFaces(searchOptions);

function searchFlickrAndExtractFaces(searchOptions) {

  var search = flickrSearch.searchFlickr(searchOptions);

  search.then(function(res) {
    //console.log(res);

    var infos = res.map(function(element, index) {
      console.log(element);
      var el = {};
      el.id = element.id;
      el.targetUrl = element.targetUrl;
      el.title = element.title;
      return el;
    });

    infos.forEach(function(element, index) {
      console.log("ix : ", element);

      var options = url.parse(element.targetUrl);

      https.get(options, function(response) {
        var chunks = [];
        response.on('data', function(chunk) {
          chunks.push(chunk);
        }).on('end', function() {
          //console.log(response);
          var buffer = Buffer.concat(chunks);
          console.log("file : " + buffer.length);
          console.log("link : ", element.targetUrl);
          processImage(null, buffer, element);
        });
      });

    }); //end foreach

  });
}

function getImageFile(path, callback) {

}

function getUrl(imageUrl, fprocess, infos) {
  request.get(imageUrl).on('response', function(response) {
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
    console.log("response : ", response);

    fprocess.call(response);
  });
}

//fs.readFile(__dirname + '/dl/group4.jpg', processImage);

function processImage(err, buff, infos) {
  //console.log("buf : ",buff);
  var canvas = new Canvas();
  var ctx = canvas.getContext('2d');

  if (err)
    throw err;
  img = new Image;
  img.src = buff;

  canvas.width = ~~(size * img.width / img.height);
  canvas.height = ~~(size);

  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

  detector = new objdetect.detector(canvas.width, canvas.height, 1.25, objdetect.frontalface_alt);

  var rects = detectFaces(canvas).filter(function(e) {
    return e[4] > 10 && e[2] / img.width > 0.006;
  });

  //crop and save faces
  rects.map(function(e, i) {
    var canFace = new Canvas();

    canFace.width = e[2];
    canFace.height = e[3] * 1.618;
    canFace.getContext('2d').drawImage(canvas, e[0], e[1] - (e[3] * 0.309), e[2], e[3] * 1.618, 0, 0, e[2], e[3] * 1.618);

    saveCanvas(canFace, "dl/", infos.id + "_" + i);
  });

  /**
   * [detectFaces description]
   * @param  {Canvas} canvas [description]
   * @return {Canvas}        [description]
   */
  function detectFaces(canvas) {
    // Detect faces in the image:
    var rects = detector.detect(canvas, 1);
    //console.log("detector : ", detector.tilted);
    //console.log("dtected rectangles : ", rects);

    //we take the first detection square
    // if(rects[0]){
    // 	var coord = rects[0];
    // 	ctx.beginPath();
    // 	//ctx.lineWidth = '' + coord[4] * .5;
    // 	ctx.lineWidth = 1;
    // 	ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
    // 	ctx.rect(coord[0], coord[1], coord[2], coord[3]);
    // 	ctx.stroke();

    // }

    // Draw rectangles around detected faces:
    // for (var i = 0; i < rects.length; ++i) {

    //   var coord = rects[i];
    //   ctx.beginPath();
    //   //ctx.lineWidth = '' + coord[4] * .5;
    //   ctx.lineWidth = 1;
    //   ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
    //   ctx.rect(coord[0], coord[1], coord[2], coord[3]);
    //   ctx.stroke();
    // }
    return rects;
  //draw mean rectangles
  //detector.groupRectangles();
  }


  function saveCanvas(canvas, path, name) {
    var fst = require('fs'),
      out = fst.createWriteStream(__dirname + "/" + path + name + '.jpg'),
      stream = canvas.jpegStream();

    stream.on('data', function(chunk) {
      out.write(chunk);
    });

    stream.on('end', function() {
      console.log('saved ' + __dirname + "/" + path + name + '.jpg');
    });

  }

}
