(function() {
  'use strict';
  var NCAAFB, moment, nock, should;

  should = require('should');

  nock = require('nock');

  moment = require('moment');

  NCAAFB = require('../../lib/v1/ncaafb.js');

  describe('V1 NCAAFB', function() {
    var badNcaafb, ncaafb;
    ncaafb = new NCAAFB('api-key', 't');
    badNcaafb = new NCAAFB('bad-key', 't');
    return describe('#getStandings()', function() {
      var now, nowUrl, scope;
      scope = void 0;
      now = moment();
      nowUrl = "/ncaafb-t1/teams/FBS/" + (now.format('YYYY')) + "/REG/standings.xml?api_key=api-key";
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaafb-t1/teams/FBS/2013/REG/standings.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get(nowUrl).replyWithFile(200, __dirname + '/replies/ncaafb-standings-200.txt').get('/ncaafb-t1/teams/FBS/2013/REG/standings.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaafb-standings-200.txt').get('/ncaafb-t1/teams/FBS/2011/REG/standings.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaafb-standings-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaafb.getStandings.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaafb.getStandings({
          year: 2013
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year and REG', function(done) {
        return ncaafb.getStandings(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and standings as result on 200', function(done) {
        return ncaafb.getStandings({
          year: 2013
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.standings.should.be.a('object');
          result.standings.season.should.match(/2013/);
          result.standings.type.should.match(/REG/);
          result.standings.division.id.should.match(/FBS/);
          result.standings.division.conference.should.be.an.instanceOf(Array);
          result.standings.division.conference[9].id.should.match(/PAC-12/);
          result.standings.division.conference[9].team.should.be.an.instanceOf(Array);
          result.standings.division.conference[9].team.should.have.length(12);
          return done();
        });
      });
      it('should pass no error and empty standings as result on 200 and no standings', function(done) {
        return ncaafb.getStandings({
          year: 2011
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.standings.should.be.a('object');
          result.standings.season.should.match(/2011/);
          result.standings.type.should.match(/REG/);
          should.not.exist(result.standings.division.conference[9].team);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
