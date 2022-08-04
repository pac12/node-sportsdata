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
    return describe('#getTeamRostersFull()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get("/mlb-t3/rosters-full/" + (new Date().getFullYear()) + ".xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/team-rosters-full-200.txt').get('/mlb-t3/rosters-full/2013.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/rosters-full/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/team-rosters-full-200.txt').get('/mlb-t3/rosters-full/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/team-rosters-full-200.txt').get('/mlb-t3/rosters-full/2010.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/team-rosters-full-200-empty.txt');
      });
      it('should be a function', function() {
        return mlb.getTeamRostersFull.should.be.a('function');
      });
      it('should default to current year', function(done) {
        return mlb.getTeamRostersFull(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getTeamRostersFull(2013, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and rosters as result on 200', function(done) {
        return mlb.getTeamRostersFull(2013, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.rosters.should.be.a('object');
          result.rosters.team.should.be.an.instanceOf(Array);
          result.rosters.team[0].should.be.a('object');
          result.rosters.team[0].players.should.be.a('object');
          result.rosters.team[0].players.profile.should.be.an.instanceOf(Array)["with"].lengthOf(34);
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          year: 2013
        };
        return mlb.getTeamRostersFull(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.rosters.should.be.a('object');
          result.rosters.team.should.be.an.instanceOf(Array);
          result.rosters.team[0].should.be.a('object');
          result.rosters.team[0].players.should.be.a('object');
          result.rosters.team[0].players.profile.should.be.an.instanceOf(Array)["with"].lengthOf(34);
          return done();
        });
      });
      it('should pass no error and empty rosters as result on 200 and no rosters', function(done) {
        return mlb.getTeamRostersFull(2010, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.rosters.should.be.a('object');
          should.not.exist(result.rosters.team);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
