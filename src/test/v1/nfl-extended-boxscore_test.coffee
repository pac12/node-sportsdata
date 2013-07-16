'use strict'
should = require 'should'
nock = require 'nock'

NFL = require '../../lib/v1/nfl.js'

describe 'V1 NFL', ->
  nfl = new NFL 'api-key', 't'
  badNfl = new NFL 'bad-key', 't'

  describe '#getExtendedBoxscore()', ->
    scope = undefined

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/nfl-t1/2013/REG/1/CLE/PIT/extended-boxscore.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get("/nfl-t1/#{new Date().getFullYear()}/REG/1/CLE/PIT/extended-boxscore.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/nfl-extended-boxscore-200.txt')
        .get("/nfl-t1/2013/REG/1/DAL/NYG/extended-boxscore.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/nfl-extended-boxscore-200.txt')
        .get("/nfl-t1/2013/REG/1/DAL/BAL/extended-boxscore.xml?api_key=api-key")
        .reply(404)

    it 'should be a function', ->
      nfl.getExtendedBoxscore.should.be.a('function')

    it 'should pass error and no result with missing away param', (done) ->
      nfl.getExtendedBoxscore (err, result) ->
        err.should.match /property "away" does not exist/
        should.not.exist result
        done()

    it 'should pass error and no result with missing home param', (done) ->
      nfl.getExtendedBoxscore {away: 'CLE'}, (err, result) ->
        err.should.match /property "home" does not exist/
        should.not.exist result
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badNfl.getExtendedBoxscore {away: 'CLE', home: 'PIT'}, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year, REG, and week 1', (done) ->
      nfl.getExtendedBoxscore {away: 'CLE', home: 'PIT'}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and schedule as result on 200', (done) ->
      nfl.getExtendedBoxscore {year: 2013, away: 'DAL', home: 'NYG'}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.game.should.be.a 'object'
        result.game.home.should.match /NYG/
        result.game.away.should.match /DAL/
        result.game.team.should.be.an.instanceOf Array
        result.game.team.should.have.length(2)
        result.game.possession.should.be.a 'object'
        result.game.last_event.should.be.a 'object'
        result.game.scoring_drives.should.be.a 'object'
        done()

    it 'should pass error and no result with bad param', (done) ->
      nfl.getExtendedBoxscore {year: 2013, away: 'DAL', home: 'BAL'}, (err, result) ->
        err.should.match /HTTP 404/
        should.not.exist result
        done()

    after ->
      scope.done()
