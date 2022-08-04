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
    return describe('#getStandings()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get("/mlb-t3/standings/" + (new Date().getFullYear()) + ".xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/standings-200.txt').get('/mlb-t3/standings/2013.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/standings/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/standings-200.txt').get('/mlb-t3/standings/2013.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/standings-200.txt').get('/mlb-t3/standings/2011.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/standings-200-empty.txt');
      });
      it('should be a function', function() {
        return mlb.getStandings.should.be.a('function');
      });
      it('should default to current year', function(done) {
        return mlb.getStandings(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getStandings(2013, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and standings as result on 200', function(done) {
        return mlb.getStandings(2013, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.standings.should.be.a('object');
          result.standings.league.should.be.an.instanceOf(Array);
          result.standings.league[0].should.be.a('object');
          result.standings.league[0].id.should.match(/AL/);
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          year: 2013
        };
        return mlb.getStandings(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.standings.should.be.a('object');
          result.standings.league.should.be.an.instanceOf(Array);
          result.standings.league[0].should.be.a('object');
          result.standings.league[0].id.should.match(/AL/);
          return done();
        });
      });
      it('should pass no error and empty standings as result on 200 and no standings', function(done) {
        return mlb.getStandings(2011, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.standings.should.be.a('object');
          should.not.exist(result.standings.league);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
