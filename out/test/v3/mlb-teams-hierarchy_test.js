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
    return describe('#getTeamsHierarchy()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get("/mlb-t3/teams/" + (new Date().getFullYear()) + ".xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/teams-200.txt').get('/mlb-t3/teams/2013.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/teams/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-200.txt').get('/mlb-t3/teams/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-200.txt').get('/mlb-t3/teams/2010.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-200-empty.txt');
      });
      it('should be a function', function() {
        return mlb.getTeamsHierarchy.should.be.a('function');
      });
      it('should default to current year', function(done) {
        return mlb.getTeamsHierarchy(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getTeamsHierarchy(2013, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and teams as result on 200', function(done) {
        return mlb.getTeamsHierarchy(2013, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.teams.should.be.a('object');
          result.teams.team.should.be.an.instanceOf(Array);
          result.teams.team[0].should.be.a('object');
          result.teams.team[0].abbr.should.match(/LA/);
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          year: 2013
        };
        return mlb.getTeamsHierarchy(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.teams.should.be.a('object');
          result.teams.team.should.be.an.instanceOf(Array);
          result.teams.team[0].should.be.a('object');
          result.teams.team[0].abbr.should.match(/LA/);
          return done();
        });
      });
      it('should pass no error and empty teams as result on 200 and no teams', function(done) {
        return mlb.getTeamsHierarchy(2010, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.teams.should.be.a('object');
          should.not.exist(result.teams.team);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
