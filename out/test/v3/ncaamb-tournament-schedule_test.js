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
    return describe('#getTournamentSchedule()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaamb-t3/tournaments/ab0754a7-2a19-4e22-987a-c45ce217ea60/schedule.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/ncaamb-t3/tournaments/bad-tournament-id/schedule.xml?api_key=api-key').reply(404, '').get('/ncaamb-t3/tournaments/ab0754a7-2a19-4e22-987a-c45ce217ea60/schedule.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-tournament-schedule-200.txt').get('/ncaamb-t3/tournaments/ab0754a7-2a19-4e22-987a-c45ce217ea60/schedule.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-tournament-schedule-200.txt');
      });
      it('should be a function', function() {
        return ncaamb.getTournamentSchedule.should.be.a('function');
      });
      it('should should throw error without tournamentId', function() {
        return (function() {
          return ncaamb.getTournamentSchedule();
        }).should.throwError(/required/);
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaamb.getTournamentSchedule('ab0754a7-2a19-4e22-987a-c45ce217ea60', function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and not result with bad tournament id', function(done) {
        return ncaamb.getTournamentSchedule('bad-tournament-id', function(err, result) {
          err.should.match(/HTTP 404/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and teams as result on 200', function(done) {
        return ncaamb.getTournamentSchedule('ab0754a7-2a19-4e22-987a-c45ce217ea60', function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league['tournament-schedule'].should.be.a('object');
          result.league['tournament-schedule'].name.should.match(/Las Vegas Invitational/);
          result.league['tournament-schedule'].round.should.be.an.instanceOf(Array);
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          tournamentId: 'ab0754a7-2a19-4e22-987a-c45ce217ea60'
        };
        return ncaamb.getTournamentSchedule(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league['tournament-schedule'].should.be.a('object');
          result.league['tournament-schedule'].name.should.match(/Las Vegas Invitational/);
          result.league['tournament-schedule'].round.should.be.an.instanceOf(Array);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
