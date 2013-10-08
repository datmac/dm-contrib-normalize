'use strict';

var path = require('path')
, basename = path.basename(path.dirname(__filename))
, debug = require('debug')('dm:contrib:' + basename)
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
  this.counter = 0
}

Command.prototype = Object.create(
  Transform.prototype, { constructor: { value: Command }});

Command.prototype.parse = function (lines, done) {
  var that = this;
  lines.map(function (line) {
      if (line.trim() !== '') {
        that.counter++;
        return iconv.decode(line, that.charset).toString().replace(/\r+$/, "")
      }
    }
  );
  that.push(lines.join('\n'));
  done();
}

Command.prototype._transform = function (chunk, encoding, done) {
  var that = this;
  if (this.begin) {
    that.begin = false;
    that.emit('begin');
    that.charset = jschardet.detect(chunk.slice(0, chunk.length < 1024 ? chunk.length : 1024)).encoding;
    debug('Charset detected : ' + that.charset);
  }
  this.parse(this.seg.fetch(chunk, that.charset), done);

}
Command.prototype.end = function () {
  var that = this;
  that.parse(that.seg.fetch(), function () {
      debug('Lines normalized : ' + that.counter);
      that.emit('end');
    }
  );
};

module.exports = function (options, si) {
  var cmd = new Command(options);
  return si.pipe(cmd);
}
