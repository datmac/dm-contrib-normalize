'use strict';

var path = require('path')
, basename = path.basename(path.dirname(__filename))
, debug = require('debug')('mill:contrib:' + basename)
, Transform = require("stream").Transform
, Segmenter = require('segmenter')
, iconv = require('iconv-lite')
, jschardet = require("jschardet")
;

function Command(options)
{
  Transform.call(this, options);
  this.begin = true;
  this.seg = new Segmenter();
  this.charset = 'utf8';
}

Command.prototype = Object.create(
  Transform.prototype, { constructor: { value: Command }});

Command.prototype.parse = function (lines, done) {
  var that = this;
  lines.forEach(function (line) {
      if (line.trim() !== '') {
        that.push(iconv.decode(line, that.charset).toString().replace(/\r+$/, "").concat("\n"));
      }
    }
  )
  done();
}

Command.prototype._transform = function (chunk, encoding, done) {
  var that = this;
  if (this.begin) {
    that.begin = false;
    that.emit('begin');
    that.charset = jschardet.detect(chunk.slice(0, chunk.length < 1024 ? chunk.length : 1024)).encoding;
    //console.log('charset detected', that.charset);
  }
  //console.log('chunk recevied', chunk.toString());
  this.parse(this.seg.fetch(chunk, that.charset), done);

}
Command.prototype.end = function () {
  var that = this;
  that.parse(that.seg.fetch(), function () {
      that.emit('end');
    }
  );
};

module.exports = function (options, si) {
  var cmd = new Command(options);
  return si.pipe(cmd);
}
