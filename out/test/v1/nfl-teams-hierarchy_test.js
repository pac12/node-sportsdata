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
    return describe('#getTeamsHierarchy()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/nfl-t1/teams/hierarchy.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/nfl-t1/teams/hierarchy.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-nfl-200.txt').get('/nfl-t1/teams/hierarchy.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-nfl-200-empty.txt');
      });
      it('should be a function', function() {
        return nfl.getTeamsHierarchy.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNfl.getTeamsHierarchy(function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and teams as result on 200', function(done) {
        return nfl.getTeamsHierarchy(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.should.be.a('object');
          result.league.conference.should.be.an.instanceOf(Array);
          result.league.conference[0].division.should.be.an.instanceOf(Array);
          return done();
        });
      });
      it('should pass no error and empty teams as result on 200 and no teams', function(done) {
        return nfl.getTeamsHierarchy(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.should.be.a('object');
          should.not.exist(result.league.conference);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
