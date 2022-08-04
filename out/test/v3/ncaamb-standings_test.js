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
    return describe('#getStandings()', function() {
      var now, nowUrl, scope;
      scope = void 0;
      now = moment();
      nowUrl = "/ncaamb-t3/seasontd/" + (now.format('YYYY')) + "/REG/standings.xml?api_key=api-key";
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaamb-t3/seasontd/2013/REG/standings.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get(nowUrl).replyWithFile(200, __dirname + '/replies/ncaamb-standings-200.txt').get('/ncaamb-t3/seasontd/2013/REG/standings.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-standings-200.txt').get('/ncaamb-t3/seasontd/2012/REG/standings.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-standings-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaamb.getStandings.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaamb.getStandings({
          year: 2013
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year and REG', function(done) {
        return ncaamb.getStandings(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and standings as result on 200', function(done) {
        return ncaamb.getStandings({
          year: 2013
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.should.be.a('object');
          result.league.season.should.be.a('object');
          result.league.season.year.should.match(/2013/);
          result.league.season.type.should.match(/REG/);
          result.league.season.conference.should.be.an.instanceOf(Array);
          result.league.season.conference.should.have.length(2);
          result.league.season.conference[1].alias.should.match(/PAC12/);
          result.league.season.conference[1].team.should.be.an.instanceOf(Array);
          result.league.season.conference[1].team.should.have.length(12);
          return done();
        });
      });
      it('should pass no error and empty standings as result on 200 and no standings', function(done) {
        return ncaamb.getStandings({
          year: 2012
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.league.season.should.be.a('object');
          result.league.season.year.should.match(/2012/);
          result.league.season.type.should.match(/REG/);
          should.not.exist(result.league.season.conference);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
