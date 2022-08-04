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
    return describe('#getExtendedBoxscore()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/nfl-t1/2013/REG/1/CLE/PIT/extended-boxscore.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/nfl-t1/" + (new Date().getFullYear()) + "/REG/1/CLE/PIT/extended-boxscore.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-extended-boxscore-200.txt').get("/nfl-t1/2013/REG/1/DAL/NYG/extended-boxscore.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-extended-boxscore-200.txt').get("/nfl-t1/2013/REG/1/DAL/BAL/extended-boxscore.xml?api_key=api-key").reply(404);
      });
      it('should be a function', function() {
        return nfl.getExtendedBoxscore.should.be.a('function');
      });
      it('should pass error and no result with missing away param', function(done) {
        return nfl.getExtendedBoxscore(function(err, result) {
          err.should.match(/property "away" does not exist/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with missing home param', function(done) {
        return nfl.getExtendedBoxscore({
          away: 'CLE'
        }, function(err, result) {
          err.should.match(/property "home" does not exist/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNfl.getExtendedBoxscore({
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
        return nfl.getExtendedBoxscore({
          away: 'CLE',
          home: 'PIT'
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return nfl.getExtendedBoxscore({
          year: 2013,
          away: 'DAL',
          home: 'NYG'
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.game.should.be.a('object');
          result.game.home.should.match(/NYG/);
          result.game.away.should.match(/DAL/);
          result.game.team.should.be.an.instanceOf(Array);
          result.game.team.should.have.length(2);
          result.game.possession.should.be.a('object');
          result.game.last_event.should.be.a('object');
          result.game.scoring_drives.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad param', function(done) {
        return nfl.getExtendedBoxscore({
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
