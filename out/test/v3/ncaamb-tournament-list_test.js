(function() {
  'use strict';
  var NCAAMB, moment, nock, should;

  should = require('should');

  nock = require('nock');

  moment = require('moment');

  NCAAMB = require('../../lib/v3/ncaamb.js');

  describe('V3 NCAAMB', function() {
    var badNcaamb, ncaamb;
    ncaamb = new NCAAMB('api-key', 't');
    badNcaamb = new NCAAMB('bad-key', 't');
    return describe('#getTournamentList()', function() {
      var now, scope;
      scope = void 0;
      now = moment();
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaamb-t3/tournaments/2013/REG/schedule.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/ncaamb-t3/tournaments/" + (new Date().getFullYear()) + "/REG/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaamb-tournament-list-200.txt').get("/ncaamb-t3/tournaments/2013/REG/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaamb-tournament-list-200.txt').get("/ncaamb-t3/tournaments/2012/REG/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaamb-tournament-list-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaamb.getTournamentList.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaamb.getTournamentList({
          year: 2013
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year and REG', function(done) {
        return ncaamb.getTournamentList(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return ncaamb.getTournamentList({
          year: 2013
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.should.be.a('object');
          result.league['season-schedule'].should.be.a('object');
          result.league['season-schedule'].tournament.should.be.an.instanceOf(Array);
          result.league['season-schedule'].tournament.should.have.length(21);
          return done();
        });
      });
      it('should pass no error and empty schedule as result on 200 and no schedule', function(done) {
        return ncaamb.getTournamentList({
          year: 2012
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          should.not.exist(result.league['season-schedule'].tournament);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
