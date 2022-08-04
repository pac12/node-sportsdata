(function() {
  'use strict';
  var NFL, nock, should;

  should = require('should');

  nock = require('nock');

  NFL = require('../../lib/v1/nfl.js');

  describe('V1 NFL', function() {
    var badNfl, nfl;
    nfl = new NFL('api-key', 't');
    badNfl = new NFL('bad-key', 't');
    return describe('#getPlayByPlay()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/nfl-t1/2013/REG/1/CLE/PIT/pbp.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/nfl-t1/" + (new Date().getFullYear()) + "/REG/1/CLE/PIT/pbp.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-pbp-200.txt').get("/nfl-t1/2013/REG/1/DAL/NYG/pbp.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-pbp-200.txt').get("/nfl-t1/2013/REG/1/DAL/BAL/pbp.xml?api_key=api-key").reply(404);
      });
      it('should be a function', function() {
        return nfl.getPlayByPlay.should.be.a('function');
      });
      it('should pass error and no result with missing away param', function(done) {
        return nfl.getPlayByPlay(function(err, result) {
          err.should.match(/property "away" does not exist/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with missing home param', function(done) {
        return nfl.getPlayByPlay({
          away: 'CLE'
        }, function(err, result) {
          err.should.match(/property "home" does not exist/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNfl.getPlayByPlay({
          year: 2013,
          away: 'CLE',
          home: 'PIT'
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year, REG, and week 1', function(done) {
        return nfl.getPlayByPlay({
          away: 'CLE',
          home: 'PIT'
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return nfl.getPlayByPlay({
          year: 2013,
          away: 'DAL',
          home: 'NYG'
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.game.should.be.a('object');
          result.game.home.should.match(/NYG/);
          result.game.away.should.match(/DAL/);
          result.game.quarter.should.be.an.instanceOf(Array);
          result.game.quarter.should.have.length(4);
          result.game.summary.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad param', function(done) {
        return nfl.getPlayByPlay({
          year: 2013,
          away: 'DAL',
          home: 'BAL'
        }, function(err, result) {
          err.should.match(/HTTP 404/);
          should.not.exist(result);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
