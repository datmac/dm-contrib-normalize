'use strict';
var  path = require('path')
, basename = path.basename(path.dirname(__filename))
, util = require('util')
, should = require('should')
, tester = require('dm-core').tester
, command = require('./index.js')
;


describe(basename, function () {

    describe('#1', function () {
        it('should be normalized', function (done) {
            tester(command, {})
            .send("[A]\r\n[B]\r\n[C]\r\n")
            .end(function (err, res) {
                res.should.equal("[A]\n[B]\n[C]\n");
                done();
              }
            );
          }
        )
      }
    )
    describe('#2', function () {
        it('should be normalized', function (done) {
            tester(command, {})
            .send("[A]\n[B]\n[C]\n")
            .end(function (err, res) {
                res.should.equal("[A]\n[B]\n[C]\n");
                done()
              }
            )
          }
        )
      }
    )
    describe('#3', function () {
        it('should be normalized', function (done) {
            tester(command, {})
            .send("X\r\n")
            .end(function (err, res) {
                res.should.equal("X\n");
                done()
              }
            )
          }
        )
      }
    )
    describe('#4', function () {
        it('should be normalized', function (done) {
            tester(command, {})
            .send('-aÃ©Ã®Ã¶Ã¹-\n')
            .end(function (err, res) {
                res.should.equal('-aéîöù-\n');
                done();
              }
            );
          }
        )
      }
    )
    describe('#5', function () {
        it('should be normalized', function (done) {
            tester(command, {})
            .send('-aÃ©Ã®Ã¶Ã¹-\r\n')
            .end(function (err, res) {
                res.should.equal('-aéîöù-\n');
                done();
              }
            );
          }
        )
      }
    )
  }
);
