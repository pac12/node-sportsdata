(function() {
  'use strict';
  var NCAAFB, nock, should;

  should = require('should');

  nock = require('nock');

  NCAAFB = require('../../lib/v1/ncaafb.js');

  describe('V1 NCAAFB', function() {
    var badNcaafb, ncaafb;
    ncaafb = new NCAAFB('api-key', 't');
    badNcaafb = new NCAAFB('bad-key', 't');
    return describe('#getWeeklySchedule()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaafb-t1/2013/REG/1/schedule.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/ncaafb-t1/" + (new Date().getFullYear()) + "/REG/1/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaafb-weekly-schedule-200.txt').get("/ncaafb-t1/2013/REG/1/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaafb-weekly-schedule-200.txt').get("/ncaafb-t1/2005/REG/1/schedule.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaafb-weekly-schedule-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaafb.getWeeklySchedule.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaafb.getWeeklySchedule({
          year: 2013
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year, REG, and week 1', function(done) {
        return ncaafb.getWeeklySchedule(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return ncaafb.getWeeklySchedule({
          year: 2013
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.games.should.be.a('object');
          result.games.game.should.be.an.instanceOf(Array);
          result.games.game.should.have.length(74);
          return done();
        });
      });
      it('should pass no error and empty schedule as result on 200 and no schedule', function(done) {
        return ncaafb.getWeeklySchedule({
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
