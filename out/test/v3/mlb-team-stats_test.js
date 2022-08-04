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
    return describe('#getTeamSeasonalStatistics()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get("/mlb-t3/seasontd/teams/" + (new Date().getFullYear()) + ".xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/team-stats-200.txt').get('/mlb-t3/seasontd/teams/2013.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/seasontd/teams/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/team-stats-200.txt').get('/mlb-t3/seasontd/teams/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/team-stats-200.txt').get('/mlb-t3/seasontd/teams/2010.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/team-stats-200-empty.txt');
      });
      it('should be a function', function() {
        return mlb.getTeamSeasonalStatistics.should.be.a('function');
      });
      it('should default to current year', function(done) {
        return mlb.getTeamSeasonalStatistics(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getTeamSeasonalStatistics(2013, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and rosters as result on 200', function(done) {
        return mlb.getTeamSeasonalStatistics(2013, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.statistics.should.be.a('object');
          result.statistics.team.should.be.an.instanceOf(Array)["with"].lengthOf(30);
          result.statistics.team[0].should.be.a('object');
          result.statistics.team[0].hitting.should.be.a('object');
          result.statistics.team[0].pitching.should.be.a('object');
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          year: 2013
        };
        return mlb.getTeamSeasonalStatistics(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.statistics.should.be.a('object');
          result.statistics.team.should.be.an.instanceOf(Array)["with"].lengthOf(30);
          result.statistics.team[0].should.be.a('object');
          result.statistics.team[0].hitting.should.be.a('object');
          result.statistics.team[0].pitching.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and empty rosters as result on 200 and no rosters', function(done) {
        return mlb.getTeamSeasonalStatistics(2010, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.statistics.should.be.a('object');
          should.not.exist(result.statistics.team);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
