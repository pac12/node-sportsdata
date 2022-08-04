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
    return describe('#getVenueInfo()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/mlb-t3/venues/venues.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/mlb-t3/venues/venues.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/venue-info-200.txt');
      });
      it('should be a function', function() {
        return mlb.getVenueInfo.should.be.a('function');
      });
      it('should pass error and no result with bad api key', function(done) {
        return badMlb.getVenueInfo(function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and venues as result on 200', function(done) {
        return mlb.getVenueInfo(function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.venues.should.be.a('object');
          result.venues.venue.should.be.an.instanceOf(Array);
          result.venues.venue[0].should.be.a('object');
          result.venues.venue[0].name.should.match(/PETCO Park/);
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
