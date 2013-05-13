'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getPlayerProfile()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/mlb-t3/player/profile/898c62b6-95bf-4973-a435-c6cb42a52158.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/player/profile/bad-player-profile-id.xml?api_key=api-key')
        .replyWithFile(412, __dirname + '/replies/player-profile-id-error.txt')
        .get('/mlb-t3/player/profile/898c62b6-95bf-4973-a435-c6cb42a52158.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/player-profile-200.txt')

    it 'should be a function', ->
      mlb.getPlayerProfile.should.be.a('function')

    it 'should should throw error without playerId', ->
      (->
        mlb.getPlayerProfile()
      ).should.throwError(/required/)

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getPlayerProfile '898c62b6-95bf-4973-a435-c6cb42a52158', (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass error and not result with bad playerId', (done) ->
      mlb.getPlayerProfile 'bad-player-profile-id', (err, result) ->
        err.should.match /HTTP 412/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      mlb.getPlayerProfile '898c62b6-95bf-4973-a435-c6cb42a52158', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.participant.should.be.a 'object'
        result.participant.profile.should.be.a 'object'
        result.participant.profile.first.should.match /Gerald/
        result.participant.profile.preferred_first.should.match /Buster/
        result.participant.profile.last.should.match /Posey/
        done()

    after ->
      scope.done()
