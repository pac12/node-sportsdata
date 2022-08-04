(function() {
  'use strict';
  var NCAAFB, nock, should;

  should = require('should');

  nock = require('nock');

  NCAAFB = require('../../lib/v1/ncaafb.js');

  describe('V1 NCAAFB', function() {
    var badNcaafb, ncaafb;
    ncaafb = new NCAAFB('api-key', 't');
    badNcaafb = new NCAAFB('bad-key', 't');
    return describe('#getPlayByPlay()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaafb-t1/2013/REG/1/MICH/MSU/pbp.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get("/ncaafb-t1/" + (new Date().getFullYear()) + "/REG/1/MICH/MSU/pbp.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaafb-pbp-200.txt').get("/ncaafb-t1/2013/REG/1/MICH/MSU/pbp.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/ncaafb-pbp-200.txt').get("/ncaafb-t1/2013/REG/1/MICH/OSU/pbp.xml?api_key=api-key").reply(404);
      });
      it('should be a function', function() {
        return ncaafb.getPlayByPlay.should.be.a('function');
      });
      it('should pass error and no result with missing away param', function(done) {
        return ncaafb.getPlayByPlay(function(err, result) {
          err.should.match(/property "away" does not exist/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with missing home param', function(done) {
        return ncaafb.getPlayByPlay({
          away: 'MICH'
        }, function(err, result) {
          err.should.match(/property "home" does not exist/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaafb.getPlayByPlay({
          year: 2013,
          away: 'MICH',
          home: 'MSU'
        }, function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should default to current year, REG, and week 1', function(done) {
        return ncaafb.getPlayByPlay({
          away: 'MICH',
          home: 'MSU'
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and schedule as result on 200', function(done) {
        return ncaafb.getPlayByPlay({
          year: 2013,
          away: 'MICH',
          home: 'MSU'
        }, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.game.should.be.a('object');
          result.game.home.should.match(/MSU/);
          result.game.away.should.match(/MICH/);
          result.game.quarter.should.be.an.instanceOf(Array);
          result.game.quarter.should.have.length(4);
          result.game.summary.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad param', function(done) {
        return ncaafb.getPlayByPlay({
          year: 2013,
          away: 'MICH',
          home: 'OSU'
        }, function(err, result) {
          err.should.match(/HTTP 404/);
          should.not.exist(result);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
