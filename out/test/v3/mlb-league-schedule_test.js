(function() {
  'use strict';
  var MLB, nock, should;

  should = require('should');

  nock = require('nock');

  MLB = require('../../lib/v3/mlb.js');

  describe('V3 MLB', function() {
    var badMlb, mlb;
    mlb = new MLB('api-key', 't');
    badMlb = new MLB('bad-key', 't');
    return describe('#getLeagueSchedule()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get("/mlb-t3/schedule/" + (new Date().getFullYear()) + ".xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/league-schedule-200.txt').get('/mlb-t3/schedule/2013.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/schedule/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/league-schedule-200.txt').get('/mlb-t3/schedule/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/league-schedule-200.txt').get('/mlb-t3/schedule/2011.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/league-schedule-200-empty.txt');
      });
      it('should be a function', function() {
        return mlb.getLeagueSchedule.should.be.a('function');
      });
      it('should default to current year', function(done) {
        return mlb.getLeagueSchedule(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getLeagueSchedule(2013, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return mlb.getLeagueSchedule(2013, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.calendars.should.be.a('object');
          result.calendars.event.should.be.an.instanceOf(Array);
          result.calendars.event[0].should.be.a('object');
          result.calendars.event[0].season_type.should.match(/REG/);
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          year: 2013
        };
        return mlb.getLeagueSchedule(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.calendars.should.be.a('object');
          result.calendars.event.should.be.an.instanceOf(Array);
          result.calendars.event[0].should.be.a('object');
          result.calendars.event[0].season_type.should.match(/REG/);
          return done();
        });
      });
      it('should pass no error and empty schedule as result on 200 and no schedule', function(done) {
        return mlb.getLeagueSchedule(2011, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.calendars.should.be.a('object');
          should.not.exist(result.calendars.event);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
