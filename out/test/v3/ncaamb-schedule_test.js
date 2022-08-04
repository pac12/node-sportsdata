(function() {
  'use strict';
  var NCAAMB, nock, should;

  should = require('should');

  nock = require('nock');

  NCAAMB = require('../../lib/v3/ncaamb.js');

  describe('V3 NCAAMB', function() {
    var badNcaamb, ncaamb;
    ncaamb = new NCAAMB('api-key', 't');
    badNcaamb = new NCAAMB('bad-key', 't');
    return describe('#getSchedule()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaamb-t3/games/2013/REG/schedule.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/ncaamb-t3/games/" + (new Date().getFullYear()) + "/REG/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaamb-schedule-200.txt').get("/ncaamb-t3/games/2013/REG/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaamb-schedule-200.txt').get("/ncaamb-t3/games/2012/REG/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaamb-schedule-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaamb.getSchedule.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaamb.getSchedule({
          year: 2013
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year and REG', function(done) {
        return ncaamb.getSchedule(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return ncaamb.getSchedule({
          year: 2013
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.should.be.a('object');
          result.league['season-schedule'].should.be.a('object');
          result.league['season-schedule'].games.should.be.a('object');
          result.league['season-schedule'].games.game.should.be.an.instanceOf(Array);
          result.league['season-schedule'].games.game.should.have.length(37);
          return done();
        });
      });
      it('should pass no error and empty schedule as result on 200 and no schedule', function(done) {
        return ncaamb.getSchedule({
          year: 2012
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league['season-schedule'].games.should.be.a('string');
          result.league['season-schedule'].games.should.be.empty;
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
