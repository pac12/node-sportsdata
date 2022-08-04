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
    return describe('#getWeeklySchedule()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/nfl-t1/2013/REG/1/schedule.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/nfl-t1/" + (new Date().getFullYear()) + "/REG/1/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-weekly-schedule-200.txt').get("/nfl-t1/2013/REG/1/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-weekly-schedule-200.txt').get("/nfl-t1/2005/REG/1/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/nfl-weekly-schedule-200-empty.txt');
      });
      it('should be a function', function() {
        return nfl.getWeeklySchedule.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNfl.getWeeklySchedule({
          year: 2013
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year, REG, and week 1', function(done) {
        return nfl.getWeeklySchedule(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return nfl.getWeeklySchedule({
          year: 2013
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.games.should.be.a('object');
          result.games.game.should.be.an.instanceOf(Array);
          result.games.game.should.have.length(16);
          return done();
        });
      });
      it('should pass no error and empty schedule as result on 200 and no schedule', function(done) {
        return nfl.getWeeklySchedule({
          year: 2005
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.games.should.be.a('object');
          should.not.exist(result.games.game);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
