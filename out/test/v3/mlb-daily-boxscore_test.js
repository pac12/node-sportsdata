(function() {
  'use strict';
  var MLB, moment, nock, should;

  should = require('should');

  nock = require('nock');

  moment = require('moment');

  MLB = require('../../lib/v3/mlb.js');

  describe('V3 MLB', function() {
    var badMlb, mlb;
    mlb = new MLB('api-key', 't');
    badMlb = new MLB('bad-key', 't');
    return describe('#getDailyBoxscore()', function() {
      var now, nowUrl, scope;
      scope = void 0;
      now = moment();
      nowUrl = "/mlb-t3/daily/boxscore/" + (now.format('YYYY')) + "/" + (now.format('MM')) + "/" + (now.format('DD')) + ".xml?api_key=api-key";
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get(nowUrl).replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt').get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt').get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt').get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt').get('/mlb-t3/daily/boxscore/2013/07/15.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/daily-boxscore-200-empty.txt');
      });
      it('should be a function', function() {
        return mlb.getDailyBoxscore.should.be.a('function');
      });
      it('should default to current date', function(done) {
        return mlb.getDailyBoxscore(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getDailyBoxscore(new Date('2013-05-10 00:00:00'), function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and boxscores as result on 200', function(done) {
        return mlb.getDailyBoxscore(new Date('2013-05-10 00:00:00'), function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.boxscores.should.be.a('object');
          result.boxscores.boxscore.should.be.an.instanceOf(Array);
          result.boxscores.boxscore[0].should.be.a('object');
          result.boxscores.boxscore[0].season_type.should.match(/REG/);
          result.boxscores.boxscore[0].visitor.should.be.a('object');
          result.boxscores.boxscore[0].home.should.be.a('object');
          return done();
        });
      });
      it('should support date object literal param', function(done) {
        var params;
        params = {
          date: new Date('2013-05-10 00:00:00')
        };
        return mlb.getDailyBoxscore(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.boxscores.should.be.a('object');
          result.boxscores.boxscore.should.be.an.instanceOf(Array);
          result.boxscores.boxscore[0].should.be.a('object');
          result.boxscores.boxscore[0].season_type.should.match(/REG/);
          result.boxscores.boxscore[0].visitor.should.be.a('object');
          result.boxscores.boxscore[0].home.should.be.a('object');
          return done();
        });
      });
      it('should support string param', function(done) {
        return mlb.getDailyBoxscore('2013-05-10 00:00:00', function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.boxscores.should.be.a('object');
          result.boxscores.boxscore.should.be.an.instanceOf(Array);
          result.boxscores.boxscore[0].should.be.a('object');
          result.boxscores.boxscore[0].season_type.should.match(/REG/);
          result.boxscores.boxscore[0].visitor.should.be.a('object');
          result.boxscores.boxscore[0].home.should.be.a('object');
          return done();
        });
      });
      it('should pass no error and empty boxscores as result on 200 and no boxscores', function(done) {
        return mlb.getDailyBoxscore(new Date('2013-07-15 00:00:00'), function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.boxscores.should.be.a('object');
          should.not.exist(result.boxscores.boxscore);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
