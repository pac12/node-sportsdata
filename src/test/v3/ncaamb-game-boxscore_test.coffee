'use strict'
should = require 'should'
nock = require 'nock'

NCAAMB = require '../../lib/v3/ncaamb.js'

describe 'V3 NCAAMB', ->
  ncaamb = new NCAAMB 'api-key', 't'
  badNcaamb = new NCAAMB 'bad-key', 't'

  describe '#getGameBoxscore()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaamb-t3/games/2b999b4b-c01f-4aa6-9576-f2e195c6b421/boxscore.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/ncaamb-t3/games/bad-event-id/boxscore.xml?api_key=api-key')
        .reply(404, '')
        .get('/ncaamb-t3/games/2b999b4b-c01f-4aa6-9576-f2e195c6b421/boxscore.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaamb-game-boxscore-200.txt')
        .get('/ncaamb-t3/games/2b999b4b-c01f-4aa6-9576-f2e195c6b421/boxscore.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaamb-game-boxscore-200.txt')

    it 'should be a function', ->
      ncaamb.getGameBoxscore.should.be.a('function')

    it 'should should throw error without gameId', ->
      (->
        ncaamb.getGameBoxscore()
      ).should.throwError(/required/)

    it 'should pass error and no result with bad api key', (done) ->
      badNcaamb.getGameBoxscore '2b999b4b-c01f-4aa6-9576-f2e195c6b421', (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass error and no result with bad gameId', (done) ->
      ncaamb.getGameBoxscore 'bad-event-id', (err, result) ->
        err.should.match /HTTP 404/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      ncaamb.getGameBoxscore '2b999b4b-c01f-4aa6-9576-f2e195c6b421', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.game.should.be.a 'object'
        result.game.title.should.match /2013 National Championship/
        result.game.team.should.be.an.instanceOf Array
        result.game.team[0].scoring.should.be.a 'object'
        should.not.exist result.game.team[0].statistics
        done()

    it 'should support object literal as param', (done) ->
      params = { gameId: '2b999b4b-c01f-4aa6-9576-f2e195c6b421' }
      ncaamb.getGameBoxscore params, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.game.should.be.a 'object'
        result.game.title.should.match /2013 National Championship/
        result.game.team.should.be.an.instanceOf Array
        result.game.team[0].scoring.should.be.a 'object'
        should.not.exist result.game.team[0].statistics
        done()

    after ->
      scope.done()
