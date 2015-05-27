

eval(require('fs').readFileSync('lib/js-objectdetect/js/objectdetect.js', 'utf8'));
eval(require('fs').readFileSync('lib/js-objectdetect/js/objectdetect.frontalface.js', 'utf8'));
eval(require('fs').readFileSync('lib/js-objectdetect/js/objectdetect.frontalface_alt.js', 'utf8'));
eval(require('fs').readFileSync('lib/js-objectdetect/js/objectdetect.eye.js', 'utf8'));

module.exports = objectdetect;
