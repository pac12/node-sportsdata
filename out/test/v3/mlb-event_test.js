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
    return describe('#getEvent()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/mlb-t3/event/c8457f5d-d8ed-4949-8c92-b341e5b37fa4.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/event/bad-event-id.xml?api_key=api-key').replyWithFile(412, __dirname + '/replies/event-id-error.txt').get('/mlb-t3/event/c8457f5d-d8ed-4949-8c92-b341e5b37fa4.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/event-200.txt').get('/mlb-t3/event/c8457f5d-d8ed-4949-8c92-b341e5b37fa4.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/event-200.txt');
      });
      it('should be a function', function() {
        return mlb.getEvent.should.be.a('function');
      });
      it('should should throw error without eventId', function() {
        return (function() {
          return mlb.getEvent();
        }).should.throwError(/required/);
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getEvent('c8457f5d-d8ed-4949-8c92-b341e5b37fa4', function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and not result with bad eventId', function(done) {
        return mlb.getEvent('bad-event-id', function(err, result) {
          err.should.match(/HTTP 412/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and teams as result on 200', function(done) {
        return mlb.getEvent('c8457f5d-d8ed-4949-8c92-b341e5b37fa4', function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.event.should.be.a('object');
          result.event.season_type.should.match(/REG/);
          result.event.game.should.be.a('object');
          result.event.game.visitor.should.be.a('object');
          result.event.game.home.should.be.a('object');
          return done();
        });
      });
      it('should support eventId object literal param', function(done) {
        var params;
        params = {
          eventId: 'c8457f5d-d8ed-4949-8c92-b341e5b37fa4'
        };
        return mlb.getEvent(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.event.should.be.a('object');
          result.event.season_type.should.match(/REG/);
          result.event.game.should.be.a('object');
          result.event.game.visitor.should.be.a('object');
          result.event.game.home.should.be.a('object');
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
