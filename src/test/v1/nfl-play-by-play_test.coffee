'use strict'
should = require 'should'
nock = require 'nock'

NFL = require '../../lib/v1/nfl.js'

describe 'V1 NFL', ->
  nfl = new NFL 'api-key', 't'
  badNfl = new NFL 'bad-key', 't'

  describe '#getPlayByPlay()', ->
    scope = undefined

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/nfl-t1/2013/REG/1/CLE/PIT/pbp.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get("/nfl-t1/#{new Date().getFullYear()}/REG/1/CLE/PIT/pbp.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/nfl-pbp-200.txt')
        .get("/nfl-t1/2013/REG/1/DAL/NYG/pbp.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/nfl-pbp-200.txt')
        .get("/nfl-t1/2013/REG/1/DAL/BAL/pbp.xml?api_key=api-key")
        .reply(404)

    it 'should be a function', ->
      nfl.getPlayByPlay.should.be.a('function')

    it 'should pass error and no result with missing away param', (done) ->
      nfl.getPlayByPlay (err, result) ->
        err.should.match /property "away" does not exist/
        should.not.exist result
        done()

    it 'should pass error and no result with missing home param', (done) ->
      nfl.getPlayByPlay {away: 'CLE'}, (err, result) ->
        err.should.match /property "home" does not exist/
        should.not.exist result
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badNfl.getPlayByPlay {away: 'CLE', home: 'PIT'}, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year, REG, and week 1', (done) ->
      nfl.getPlayByPlay {away: 'CLE', home: 'PIT'}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and schedule as result on 200', (done) ->
      nfl.getPlayByPlay {year: 2013, away: 'DAL', home: 'NYG'}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.game.should.be.a 'object'
        result.game.home.should.match /NYG/
        result.game.away.should.match /DAL/
        result.game.quarter.should.be.an.instanceOf Array
        result.game.quarter.should.have.length 4
        result.game.summary.should.be.a 'object'
        done()

    it 'should pass error and no result with bad param', (done) ->
      nfl.getPlayByPlay {year: 2013, away: 'DAL', home: 'BAL'}, (err, result) ->
        err.should.match /HTTP 404/
        should.not.exist result
        done()

    after ->
      scope.done()
