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
    return describe('#getTeamsHierarchy()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get("/ncaafb-t1/teams/FBS/hierarchy.xml?api_key=api-key").replyWithFile(200, __dirname + '/replies/teams-ncaafb-200.txt').get('/ncaafb-t1/teams/FBS/hierarchy.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/ncaafb-t1/teams/FBS/hierarchy.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-ncaafb-200.txt').get('/ncaafb-t1/teams/FCS/hierarchy.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/teams-ncaafb-200-empty.txt');
      });
      it('should be a function', function() {
        return ncaafb.getTeamsHierarchy.should.be.a('function');
      });
      it('should default to FBS division', function(done) {
        return ncaafb.getTeamsHierarchy(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          return done();
        });
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaafb.getTeamsHierarchy(function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and teams as result on 200', function(done) {
        return ncaafb.getTeamsHierarchy(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.division.should.be.a('object');
          result.division.conference.should.be.an.instanceOf(Array);
          result.division.conference[8].id.should.match(/PAC-12/);
          result.division.conference[8].subdivision.should.be.an.instanceOf(Array);
          return done();
        });
      });
      it('should pass no error and empty teams as result on 200 and no teams', function(done) {
        return ncaafb.getTeamsHierarchy('FCS', function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.division.should.be.a('object');
          should.not.exist(result.division.conference);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
