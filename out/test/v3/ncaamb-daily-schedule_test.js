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
    return describe('#getDailySchedule()', function() {
      var now, nowUrl, scope;
      scope = void 0;
      now = moment();
      nowUrl = "/ncaamb-t3/games/" + (now.format('YYYY')) + "/" + (now.format('MM')) + "/" + (now.format('DD')) + "/schedule.xml?api_key=api-key";
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get(nowUrl).replyWithFile(200, __dirname + '/replies/ncaamb-daily-schedule-200.txt').get('/ncaamb-t3/games/2013/10/14/schedule.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/ncaamb-t3/games/2013/11/08/schedule.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-daily-schedule-200.txt').get('/ncaamb-t3/games/2013/11/08/schedule.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-daily-schedule-200.txt').get('/ncaamb-t3/games/2013/11/08/schedule.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-daily-schedule-200.txt').get('/ncaamb-t3/games/2013/10/15/schedule.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-daily-schedule-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaamb.getDailySchedule.should.be.a('function');
      });
      it('should default to current date', function(done) {
        return ncaamb.getDailySchedule(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaamb.getDailySchedule(new Date('2013-10-14 00:00:00'), function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return ncaamb.getDailySchedule(new Date('2013-11-08 00:00:00'), function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.should.be.a('object');
          result.league['daily-schedule'].should.be.a('object');
          result.league['daily-schedule'].games.should.be.a('object');
          result.league['daily-schedule'].games.game.should.be.an.instanceOf(Array);
          result.league['daily-schedule'].games.game[0].should.be.a('object');
          result.league['daily-schedule'].games.game[0].status.should.match(/scheduled/);
          return done();
        });
      });
      it('should support date object literal param', function(done) {
        var params;
        params = {
          date: new Date('2013-11-08 00:00:00')
        };
        return ncaamb.getDailySchedule(params, function(err, result) {
          should.not.exist(err);
          result.league.should.be.a('object');
          result.league['daily-schedule'].should.be.a('object');
          result.league['daily-schedule'].games.should.be.a('object');
          result.league['daily-schedule'].games.game.should.be.an.instanceOf(Array);
          result.league['daily-schedule'].games.game[0].should.be.a('object');
          result.league['daily-schedule'].games.game[0].status.should.match(/scheduled/);
          return done();
        });
      });
      it('should support string param', function(done) {
        return ncaamb.getDailySchedule('2013-11-08 00:00:00', function(err, result) {
          should.not.exist(err);
          result.league.should.be.a('object');
          result.league['daily-schedule'].should.be.a('object');
          result.league['daily-schedule'].games.should.be.a('object');
          result.league['daily-schedule'].games.game.should.be.an.instanceOf(Array);
          result.league['daily-schedule'].games.game[0].should.be.a('object');
          result.league['daily-schedule'].games.game[0].status.should.match(/scheduled/);
          return done();
        });
      });
      it('should pass no error and empty schedule as result on 200 and no schedule', function(done) {
        return ncaamb.getDailySchedule(new Date('2013-10-15 00:00:00'), function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league['daily-schedule'].games.should.be.a('string');
          result.league['daily-schedule'].games.should.be.empty;
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
