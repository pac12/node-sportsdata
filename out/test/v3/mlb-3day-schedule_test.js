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
    return describe('#getRollingThreeDaySchedule()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/mlb-t3/schedule-3day?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/schedule-3day?api_key=api-key').replyWithFile(200, __dirname + '/replies/rolling-schedule-200.txt');
      });
      it('should be a function', function() {
        return mlb.getRollingThreeDaySchedule.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getRollingThreeDaySchedule(function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return mlb.getRollingThreeDaySchedule(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.outlook.should.be.a('object');
          result.outlook.schedules.should.be.a('object');
          result.outlook.schedules.event.should.be.an.instanceOf(Array);
          result.outlook.schedules.event[0].should.be.a('object');
          result.outlook.schedules.event[0].season_type.should.match(/REG/);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
