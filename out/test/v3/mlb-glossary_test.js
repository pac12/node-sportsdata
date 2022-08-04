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
    return describe('#getGlossary()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/mlb-t3/glossary/glossary.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/glossary/glossary.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/glossary-200.txt');
      });
      it('should be a function', function() {
        return mlb.getGlossary.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getGlossary(function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and glossary as result on 200', function(done) {
        return mlb.getGlossary(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.glossary.should.be.a('object');
          result.glossary.pitch_types.should.be.a('object');
          result.glossary.player_statuses.should.be.a('object');
          result.glossary.pitch_outcome.should.be.a('object');
          result.glossary.game_status.should.be.a('object');
          result.glossary.runner_outcomes.should.be.a('object');
          result.glossary.post_season.should.be.a('object');
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
